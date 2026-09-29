import { build } from 'esbuild';

await build({
  entryPoints: [
    'server/vercel/routes/admin.ts',
    'server/vercel/routes/content.ts',
    'server/vercel/routes/upload.ts',
    'server/vercel/routes/password.ts',
  ],
  outdir: 'api',
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  target: 'node22',
  minify: false,
  logLevel: 'warning',
});

console.log('Vercel API JavaScript bundles are ready.');
