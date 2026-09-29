import { compare } from 'bcryptjs';
import { adminHash, databaseConfigured } from '../database';
import { expiredSessionCookie, input, json, mutationError, newSessionCookie, session } from '../shared';

export async function GET(request: Request): Promise<Response> {
  if (!databaseConfigured()) return json({ authenticated: false, configured: false, csrf: null });
  try {
    const hash = await adminHash();
    const active = session(request, hash);
    return json({ authenticated: Boolean(active), configured: Boolean(hash), csrf: active?.csrf ?? null });
  } catch (error) {
    console.error('CMS admin status:', error);
    return json({ authenticated: false, configured: false, csrf: null, error: 'CMS database is unavailable.' }, 503);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await input(request, 4096);
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'Invalid request.' }, 400);
  const action = body as Record<string, unknown>;
  if (!databaseConfigured()) return json({ error: 'CMS database is not configured.' }, 503);
  let hash: string | null;
  try {
    hash = await adminHash();
  } catch (error) {
    console.error('CMS admin login:', error);
    return json({ error: 'CMS database is unavailable.' }, 503);
  }
  if (action['action'] === 'logout') {
    const error = mutationError(request, request.headers.get('x-csrf-token'), hash);
    if (error) return error;
    return json({ authenticated: false }, 200, { 'Set-Cookie': expiredSessionCookie(request) });
  }
  if (action['action'] !== 'login' || typeof action['password'] !== 'string') {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!hash) return json({ error: 'Admin password is not configured in MySQL.' }, 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const valid = await compare(action['password'], hash).catch(() => false);
  if (!valid) return json({ error: 'Incorrect password.' }, 401);
  const active = newSessionCookie(request, hash);
  return json({ authenticated: true, csrf: active.csrf }, 200, { 'Set-Cookie': active.cookie });
}
