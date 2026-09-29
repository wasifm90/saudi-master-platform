import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin = process.env['PREVIEW_URL'] || 'http://localhost:4305';
const sitemap = await readFile('public/sitemap.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const path of paths) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, /ng-version="22\.2\.0"/);
}
for (const path of ['/robots.txt', '/sitemap.xml'])
  assert.equal((await fetch(origin + path)).status, 200);
for (const path of ['/assets/missing.jpg', '/missing-script.js', '/this-route-does-not-exist'])
  assert.equal((await fetch(origin + path)).status, 404, path);
const media = await fetch(origin + '/assets/video/hero/mobile.mp4', {
  headers: { Range: 'bytes=0-1023' },
});
assert.equal(media.status, 206);
assert.equal((await media.arrayBuffer()).byteLength, 1024);
const home = await fetch(origin, { headers: { 'Accept-Encoding': 'gzip' } });
assert.equal(home.headers.get('content-encoding'), 'gzip');
console.log(
  `PASS: HTTP 200 for ${paths.length} Angular routes; robots/sitemap; real 404s; video byte ranges; gzip HTML.`,
);
