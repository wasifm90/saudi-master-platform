// Local-only API parity for the PHP/MySQL CMS. Never deploy this Node module as the public CMS.
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const directory = resolve('.local-cms');
const passwordFile = resolve(directory, 'preview-password');
const contentFile = resolve(directory, 'content.json');
const uploads = resolve(directory, 'uploads');
const sessions = new Map();
await mkdir(directory, { recursive: true });
let password = process.env['CMS_PREVIEW_PASSWORD'];
if (!password) {
  password = await readFile(passwordFile, 'utf8').catch(() => '');
  if (!password) {
    password = randomBytes(12).toString('base64url');
    await writeFile(passwordFile, password, { mode: 0o600 });
  }
}
console.log('Local CMS password: .local-cms/preview-password (or CMS_PREVIEW_PASSWORD)');

function json(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(JSON.stringify(body));
}
async function body(req, max = 4_000_000) {
  let length = 0;
  const chunks = [];
  for await (const chunk of req) {
    length += chunk.length;
    if (length > max) throw new Error('Request too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
function session(req) {
  const token = /(?:^|;\s*)sm_preview=([^;]+)/.exec(req.headers.cookie || '')?.[1];
  return token ? sessions.get(token) : null;
}
function authorized(req, res) {
  const active = session(req);
  if (!active) {
    json(res, 401, { error: 'Sign in required.' });
    return false;
  }
  if (req.headers['x-csrf-token'] !== active.csrf) {
    json(res, 403, { error: 'Session check failed.' });
    return false;
  }
  return true;
}
async function saved() {
  return JSON.parse(await readFile(contentFile, 'utf8').catch(() => 'null'));
}
export async function previewCms(req, res, pathname) {
  if (pathname.startsWith('/assets/uploads/')) {
    const name = pathname.slice('/assets/uploads/'.length);
    if (!/^[a-f0-9]{32}\.(?:jpg|png|webp|avif|mp4|webm)$/.test(name)) {
      res.writeHead(404).end();
      return true;
    }
    const file = resolve(uploads, name);
    const info = await stat(file).catch(() => null);
    if (!info) {
      res.writeHead(404).end();
      return true;
    }
    const types = {
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };
    res.writeHead(200, { 'Content-Type': types[extname(file)], 'Content-Length': info.size });
    (await import('node:fs')).createReadStream(file).pipe(res);
    return true;
  }
  if (!pathname.startsWith('/api/')) return false;
  try {
    if (pathname === '/api/admin.php') {
      if (req.method === 'GET') {
        const active = session(req);
        json(res, 200, { authenticated: !!active, configured: true, csrf: active?.csrf ?? null });
        return true;
      }
      if (req.method !== 'POST') {
        json(res, 405, { error: 'Method not allowed.' });
        return true;
      }
      const input = JSON.parse((await body(req, 4096)).toString());
      if (input.action === 'logout') {
        if (!authorized(req, res)) return true;
        const token = /sm_preview=([^;]+)/.exec(req.headers.cookie || '')?.[1];
        sessions.delete(token);
        json(
          res,
          200,
          { authenticated: false },
          { 'Set-Cookie': 'sm_preview=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/' },
        );
        return true;
      }
      const supplied = Buffer.from(String(input.password ?? ''));
      const expected = Buffer.from(password);
      if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
        json(res, 401, { error: 'Incorrect password.' });
        return true;
      }
      const token = randomBytes(24).toString('hex');
      const csrf = randomBytes(24).toString('hex');
      sessions.set(token, { csrf });
      json(
        res,
        200,
        { authenticated: true, csrf },
        { 'Set-Cookie': `sm_preview=${token}; HttpOnly; SameSite=Strict; Path=/` },
      );
      return true;
    }
    if (pathname === '/api/content.php') {
      if (req.method === 'GET') {
        const data = await saved();
        json(res, 200, data ?? { content: null, revision: 0 });
        return true;
      }
      if (req.method !== 'PUT') {
        json(res, 405, { error: 'Method not allowed.' });
        return true;
      }
      if (!authorized(req, res)) return true;
      const input = JSON.parse((await body(req)).toString());
      const current = await saved();
      const revision = current?.revision ?? 0;
      if (input.revision !== revision) {
        json(res, 409, {
          error: 'Content changed in another session. Reload before saving.',
          revision,
        });
        return true;
      }
      if (
        !input.content ||
        !Array.isArray(input.content.products) ||
        !Array.isArray(input.content.navigation)
      ) {
        json(res, 422, { error: 'Invalid content document.' });
        return true;
      }
      const next = { revision: revision + 1, content: input.content };
      const temp = resolve(directory, `content-${randomBytes(6).toString('hex')}.tmp`);
      await writeFile(temp, JSON.stringify(next));
      await rename(temp, contentFile);
      json(res, 200, next);
      return true;
    }
    if (pathname === '/api/upload.php') {
      if (req.method !== 'POST') {
        json(res, 405, { error: 'Method not allowed.' });
        return true;
      }
      if (!authorized(req, res)) return true;
      const bytes = await body(req, 50_500_000);
      const request = new Request('http://localhost/upload', {
        method: 'POST',
        headers: { 'content-type': req.headers['content-type'] },
        body: bytes,
      });
      const file = (await request.formData()).get('file');
      const allowed = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/avif': 'avif',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
      };
      if (!file || !allowed[file.type] || file.size > 50_000_000) {
        json(res, 415, { error: 'Use JPG, PNG, WebP, AVIF, MP4 or WebM under 50 MB.' });
        return true;
      }
      await mkdir(uploads, { recursive: true });
      const name = `${randomBytes(16).toString('hex')}.${allowed[file.type]}`;
      await writeFile(resolve(uploads, name), Buffer.from(await file.arrayBuffer()));
      json(res, 201, { url: `/assets/uploads/${name}` });
      return true;
    }
    res.writeHead(404).end('Not found');
    return true;
  } catch (error) {
    console.error('Preview CMS:', error);
    json(res, 500, { error: 'Preview CMS request failed.' });
    return true;
  }
}
