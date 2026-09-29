import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const output = resolve('dist/website/browser/api');
await mkdir(output, { recursive: true });
await cp(resolve('server/php-api'), output, { recursive: true });
console.log('PHP API copied into dist/website/browser/api for Apache deployment.');
