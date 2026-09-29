import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const cookieName = 'sm_cms';
const lifetimeSeconds = 12 * 60 * 60;

type Session = { expires: number; csrf: string };

export function configured(): boolean {
  return Boolean(process.env['CMS_ADMIN_PASSWORD_HASH'] && process.env['BLOB_READ_WRITE_TOKEN']);
}

export function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
}

function signature(payload: string): string {
  const hash = process.env['CMS_ADMIN_PASSWORD_HASH'] ?? '';
  return createHmac('sha256', hash).update(`saudi-master-cms-session-v1:${payload}`).digest('base64url');
}

export function session(request: Request): Session | null {
  if (!configured()) return null;
  const token = request.headers.get('cookie')?.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const expected = Buffer.from(signature(parts[0]));
  const received = Buffer.from(parts[1]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[0], 'base64url').toString()) as Session;
    return Number.isFinite(parsed.expires) && parsed.expires > Date.now() &&
      typeof parsed.csrf === 'string' && parsed.csrf.length >= 32 ? parsed : null;
  } catch {
    return null;
  }
}

export function newSessionCookie(request: Request): { cookie: string; csrf: string } {
  const csrf = randomBytes(24).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ expires: Date.now() + lifetimeSeconds * 1000, csrf }))
    .toString('base64url');
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return {
    csrf,
    cookie: `${cookieName}=${payload}.${signature(payload)}; Max-Age=${lifetimeSeconds}; HttpOnly; SameSite=Strict; Path=/${secure}`,
  };
}

export function expiredSessionCookie(request: Request): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${cookieName}=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/${secure}`;
}

export function mutationError(request: Request, csrf: string | null): Response | null {
  const active = session(request);
  if (!active) return json({ error: 'Sign in required.' }, 401);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  if (!csrf || csrf !== active.csrf) return json({ error: 'Session check failed. Refresh and sign in again.' }, 403);
  return null;
}

export async function input(request: Request, maxBytes = 4_000_000): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new Error('Request is too large.');
  const raw = await request.text();
  if (Buffer.byteLength(raw) > maxBytes) throw new Error('Request is too large.');
  return JSON.parse(raw) as unknown;
}

export function validDocument(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const document = value as Record<string, unknown>;
  const collections = ['products', 'geometries', 'assembly', 'projects', 'services', 'processes', 'industries', 'articles', 'jobs', 'navigation'];
  const sections = ['company', 'home', 'pages', 'collectionCopy', 'media', 'labels', 'visibility'];
  if (!collections.every((key) => Array.isArray(document[key]))) return false;
  if (!sections.every((key) => document[key] && typeof document[key] === 'object' && !Array.isArray(document[key]))) return false;
  const slugs = new Set<string>();
  for (const item of document['products'] as unknown[]) {
    if (!item || typeof item !== 'object') return false;
    const product = item as Record<string, unknown>;
    if (typeof product['slug'] !== 'string' || !/^[a-z0-9-]+$/.test(product['slug']) ||
        typeof product['name'] !== 'string' || !product['name'].trim() ||
        typeof product['featuredImage'] !== 'string' || !product['featuredImage'].trim() ||
        slugs.has(product['slug'])) return false;
    slugs.add(product['slug']);
  }
  return true;
}
