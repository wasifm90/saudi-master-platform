import { compare } from 'bcryptjs';

export async function GET(): Promise<Response> {
  return Response.json({ ok: await compare('test', '$2b$04$abcdefghijklmnopqrstuuVh1CUhqEe47IzMbJelhiTM.RmKdPUv6').catch(() => false) });
}
