import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
const source = 'archive/legacy/public_html';
async function images(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) await images(file);
    else if (/\.jpg$/.test(file)) {
      const base = file.replace(source, 'public/assets').replace(/\.jpg$/, '');
      await mkdir(dirname(base), { recursive: true });
      await sharp(file)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(base + '.webp');
      for (const width of [480, 960, 1600])
        await sharp(file).resize({ width }).webp({ quality: 76 }).toFile(`${base}-${width}.webp`);
    }
  }
}
await images(source + '/images');
const video = 'public/assets/video/hero/';
const original = source + '/assets/hero_construction.mp4';
function run(args) {
  const result = spawnSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: 'inherit',
  });
  if (result.status !== 0) throw new Error('Video optimization failed');
}
run(['-i', original, '-frames:v', '1', video + 'poster.jpg']);
await sharp(video + 'poster.jpg')
  .resize({ width: 1280, withoutEnlargement: true })
  .jpeg({ quality: 82 })
  .toFile(video + 'poster-optimized.jpg');
await sharp(video + 'poster.jpg')
  .webp({ quality: 72 })
  .toFile(video + 'poster-desktop.webp');
await sharp(video + 'poster.jpg')
  .resize({ width: 640 })
  .webp({ quality: 74 })
  .toFile(video + 'poster-mobile.webp');
run([
  '-i',
  original,
  '-an',
  '-vf',
  'fps=24',
  '-c:v',
  'libx264',
  '-crf',
  '27',
  '-preset',
  'fast',
  '-movflags',
  '+faststart',
  video + 'desktop.mp4',
]);
run([
  '-i',
  original,
  '-an',
  '-vf',
  'scale=640:-2,fps=24',
  '-c:v',
  'libx264',
  '-crf',
  '29',
  '-preset',
  'fast',
  '-movflags',
  '+faststart',
  video + 'mobile.mp4',
]);
run([
  '-i',
  original,
  '-an',
  '-vf',
  'fps=24',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '43',
  '-b:v',
  '0',
  '-deadline',
  'good',
  '-cpu-used',
  '4',
  video + 'desktop.webm',
]);
run([
  '-i',
  original,
  '-an',
  '-vf',
  'scale=640:-2,fps=24',
  '-c:v',
  'libvpx-vp9',
  '-crf',
  '42',
  '-b:v',
  '0',
  '-deadline',
  'good',
  '-cpu-used',
  '4',
  video + 'mobile.webm',
]);
console.log('Responsive WebP images and desktop/mobile video formats generated.');
