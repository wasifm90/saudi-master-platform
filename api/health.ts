import type { IncomingMessage, ServerResponse } from 'node:http';

export default function handler(_request: IncomingMessage, response: ServerResponse): void {
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ ok: true }));
}
