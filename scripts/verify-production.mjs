import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve('dist/website/browser');
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
const paths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1]);
let assets = 0;
for (const route of paths) {
  const html = await readFile(join(root, route, 'index.html'), 'utf8');
  assert.match(html, /ng-version="22\.2\.0"/);
  assert.match(html, /<h1[\s>]/);
  assert.match(html, /<link[^>]+rel="canonical"/);
  assert.match(html, /<meta[^>]+name="description"/);
  assert.doesNotMatch(html, /onclick=|js\/app\.js|DB_SNAPSHOT/);
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
    await stat(join(root, match[1]));
    assets++;
  }
}
assert.match(await readFile(join(root, 'robots.txt'), 'utf8'), /Sitemap:/);
assert.match(await readFile(join(root, '.htaccess'), 'utf8'), /index.csr.html/);
console.log(
  `PASS: ${paths.length} prerendered routes, metadata/canonicals, ${assets} asset references, robots, sitemap, Apache fallback; no legacy application handlers.`,
);
