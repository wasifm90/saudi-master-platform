import { compare, hash as hashPassword } from 'bcryptjs';
import { adminHash, changeAdminHash, databaseConfigured } from '../database';
import { expiredSessionCookie, input, json, mutationError } from '../shared';

export async function POST(request: Request): Promise<Response> {
  if (!databaseConfigured()) return json({ error: 'CMS database is not configured.' }, 503);
  let currentHash: string | null;
  try {
    currentHash = await adminHash();
  } catch {
    return json({ error: 'CMS database is unavailable.' }, 503);
  }
  const error = mutationError(request, request.headers.get('x-csrf-token'), currentHash);
  if (error) return error;
  let body: unknown;
  try {
    body = await input(request, 4096);
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'Invalid request.' }, 400);
  const values = body as Record<string, unknown>;
  if (typeof values['currentPassword'] !== 'string' || typeof values['newPassword'] !== 'string' ||
      values['newPassword'].length < 12 || values['newPassword'].length > 128) {
    return json({ error: 'Use a new password between 12 and 128 characters.' }, 422);
  }
  if (!currentHash || !await compare(values['currentPassword'], currentHash)) {
    return json({ error: 'Current password is incorrect.' }, 401);
  }
  try {
    const replacement = await hashPassword(values['newPassword'], 12);
    if (!await changeAdminHash(currentHash, replacement)) {
      return json({ error: 'Password changed in another session. Sign in again.' }, 409);
    }
    return json({ authenticated: false }, 200, { 'Set-Cookie': expiredSessionCookie(request) });
  } catch (failure) {
    console.error('CMS password update:', failure);
    return json({ error: 'Could not update password.' }, 503);
  }
}
