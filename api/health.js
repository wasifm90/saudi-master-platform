export default function handler(_request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify({ ok: true }));
}
