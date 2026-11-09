// Converts the photographs in assets-src/photo into responsive WebP files in
// public/media/hero (960 and 1920 wide). Run with `npm run images` after you
// add or replace a photo; reference it in code by `/media/hero/<file name>`.
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

sharp.cache(false)
const src = path.resolve('assets-src/photo')
const out = path.resolve('public/media/hero')
await mkdir(out, { recursive: true })

for (const file of await readdir(src)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue
  const base = file.replace(/\.[^.]+$/, '')
  for (const w of [960, 1920]) {
    await sharp(path.join(src, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(out, `${base}-${w}.webp`))
  }
}
console.log('done')
