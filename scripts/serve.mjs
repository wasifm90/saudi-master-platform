// Local verification server only. Production output requires no Node runtime.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve, extname, sep } from 'node:path';
import { previewCms } from './preview-cms.mjs';
const root = resolve('dist/website/browser');
const port = Number(process.env['PORT'] || 4306);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (await previewCms(req, res, pathname)) return;
    if (extname(pathname) === '.php') {
      res.writeHead(404).end('Not found');
      return;
    }
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    let info = await stat(file).catch(() => null);
    if (info?.isDirectory()) {
      file = resolve(file, 'index.html');
      info = await stat(file).catch(() => null);
    }
    let status = 200;
    if (!info) {
      if (pathname === '/admin') {
        file = resolve(root, 'index.csr.html');
        info = await stat(file);
      } else {
        if (extname(pathname) || /^\/(assets|api)\//.test(pathname)) {
          res.writeHead(404).end('Not found');
          return;
        }
        file = resolve(root, 'index.csr.html');
        info = await stat(file);
        status = 404;
      }
    }
    const headers = {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff',
    };
    if (
      /\.(html|css|js|json|xml|txt|svg)$/.test(file) &&
      req.headers['accept-encoding']?.includes('gzip')
    ) {
      const compressed = gzipSync(await readFile(file));
      res.writeHead(status, {
        ...headers,
        'Content-Encoding': 'gzip',
        Vary: 'Accept-Encoding',
        'Content-Length': compressed.length,
      });
      if (req.method === 'HEAD') res.end();
      else res.end(compressed);
      return;
    }
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Math.min(Number(range[2] || info.size - 1), info.size - 1);
      if (start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
        return;
      }
      res.writeHead(206, {
        ...headers,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${info.size}`,
      });
      if (req.method === 'HEAD') res.end();
      else createReadStream(file, { start, end }).pipe(res);
    } else {
      res.writeHead(status, { ...headers, 'Content-Length': info.size });
      if (req.method === 'HEAD') res.end();
      else createReadStream(file).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500).end('Server error');
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Angular production preview: http://localhost:${port}`),
);
