import { compare } from 'bcryptjs';
import { configured, expiredSessionCookie, input, json, mutationError, newSessionCookie, session } from '../server/vercel/shared';

export function GET(request: Request): Response {
  const active = session(request);
  return json({ authenticated: Boolean(active), configured: configured(), csrf: active?.csrf ?? null });
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
  if (action['action'] === 'logout') {
    const error = mutationError(request, request.headers.get('x-csrf-token'));
    if (error) return error;
    return json({ authenticated: false }, 200, { 'Set-Cookie': expiredSessionCookie(request) });
  }
  if (action['action'] !== 'login' || typeof action['password'] !== 'string') {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!configured()) return json({ error: 'Admin storage or password is not configured.' }, 503);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Invalid origin.' }, 403);
  const hash = process.env['CMS_ADMIN_PASSWORD_HASH']!;
  const valid = await compare(action['password'], hash).catch(() => false);
  if (!valid) return json({ error: 'Incorrect password.' }, 401);
  const active = newSessionCookie(request);
  return json({ authenticated: true, csrf: active.csrf }, 200, { 'Set-Cookie': active.cookie });
}
