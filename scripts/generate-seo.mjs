import { readFile, writeFile } from 'node:fs/promises';
const config = await readFile('src/environments/environment.ts', 'utf8');
const siteUrl = config.match(/siteUrl:\s*'([^']+)'/)?.[1];
if (!siteUrl) throw new Error('Configure production siteUrl');
const paths = [
  '',
  'about',
  'products',
  'projects',
  'services',
  'industries',
  'safety-quality',
  'careers',
  'insights',
  'contact',
  'privacy',
  'terms',
];
for (const name of ['products', 'projects', 'services']) {
  const data = JSON.parse(await readFile(`src/app/data/${name}.json`, 'utf8'));
  for (const item of data) if (item.active !== false) paths.push(`${name}/${item.slug}`);
}
const projects = JSON.parse(await readFile('src/app/data/projects.json', 'utf8'));
for (const item of projects)
  paths.push(
    'industries/' +
      item.industry
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
  );
await writeFile(
  'public/sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    [...new Set(paths)].map((path) => `  <url><loc>${siteUrl}/${path}</loc></url>`).join('\n') +
    '\n</urlset>\n',
);
await writeFile('public/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
