import { json } from '../server/vercel/shared';

export function GET(): Response {
  return json({ ok: true });
}
