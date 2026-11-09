// Generates the demo placeholders: monogram portraits for the team and board,
// typographic logo plates for the portfolio, and the brand icons / OG image.
// Re-run after changing names in src/data (npm run placeholders). Replace the
// generated files with real photos and logos when you have them.
import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

sharp.cache(false)
const root = path.resolve('public/media')
const INK = '#0c1f28'
const TEAL = '#17495e'
const SKY = '#80d3f4'
const STONE = '#e7e0d5'
const IVORY = '#f4f0ea'
const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "'Segoe UI', Arial, sans-serif"

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
const initials = (name) =>
  name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

/** Pull `name` (and `slug` / logo key) pairs out of the data files without importing TypeScript. */
async function readPairs(file, re) {
  const src = await readFile(file, 'utf8')
  return [...src.matchAll(re)].map((m) => m.slice(1))
}

const MARK = `<path d="M0 0H16V5.5H3.2Z" fill="${IVORY}"/><path d="M18 0H34L30.8 5.5H18Z" fill="${SKY}"/><path d="M14.5 7.5H19.5V22L17 25L14.5 22Z" fill="${IVORY}"/><path d="M0 28.6C5.7 25.4 11.3 25.4 17 28.6C22.7 31.8 28.3 31.8 34 28.6V32.4C28.3 35.6 22.7 35.6 17 32.4C11.3 29.2 5.7 29.2 0 32.4Z" fill="${IVORY}"/>`

function portrait(name, w, h) {
  const r = w * 0.3
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${STONE}"/><stop offset="1" stop-color="#d6cab8"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w / 2}" cy="${h * 0.42}" r="${r}" fill="none" stroke="${TEAL}" stroke-opacity="0.35" stroke-width="${w / 240}"/>
  <text x="${w / 2}" y="${h * 0.42 + r * 0.36}" text-anchor="middle" font-family="${SERIF}" font-size="${r * 1.02}" font-weight="300" fill="${TEAL}" letter-spacing="${w / 120}">${initials(name)}</text>
  <rect x="${w * 0.42}" y="${h * 0.78}" width="${w * 0.16}" height="${w / 240}" fill="${TEAL}" fill-opacity="0.45"/>
</svg>`
}

const shapes = [
  (c) => `<circle cx="240" cy="168" r="62" fill="${c}"/>`,
  (c) => `<rect x="180" y="106" width="120" height="120" fill="${c}"/>`,
  (c) => `<path d="M240 100L308 168L240 236L172 168Z" fill="${c}"/>`,
  (c) => `<path d="M240 104L312 230H168Z" fill="${c}"/>`,
  (c) => `<rect x="178" y="106" width="124" height="124" rx="30" fill="${c}"/>`,
]

function plate(name, i) {
  const words = name.split(' ')
  const lines = words.length > 2 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [name]
  const size = lines.some((l) => l.length > 16) ? 30 : 36
  const color = i % 2 ? TEAL : INK
  const text = lines
    .map((l, k) => `<text x="240" y="${300 + k * (size + 8)}" text-anchor="middle" font-family="${i % 3 === 1 ? SANS : SERIF}" font-weight="${i % 3 === 1 ? 600 : 400}" font-size="${size}" fill="${INK}">${esc(l)}</text>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480" viewBox="0 0 480 480">
  <rect width="480" height="480" fill="#ffffff"/>
  ${shapes[i % shapes.length](color)}
  <text x="240" y="${shapes[i % shapes.length] === shapes[3] ? 206 : 186}" text-anchor="middle" font-family="${SERIF}" font-size="52" fill="#ffffff">${esc(initials(name))}</text>
  ${text}
</svg>`
}

const toWebp = (svg, out, quality = 82) => sharp(Buffer.from(svg)).webp({ quality }).toFile(out)

// Team portraits (2:3) at 480 and 960 wide.
await mkdir(path.join(root, 'team'), { recursive: true })
for (const [slug, name] of await readPairs('src/data/team.ts', /slug: '([^']+)',\s*name: '([^']+)'/g)) {
  await toWebp(portrait(name, 480, 720), path.join(root, 'team', `${slug}-480.webp`))
  await toWebp(portrait(name, 960, 1440), path.join(root, 'team', `${slug}-960.webp`))
}

// Board portraits.
await mkdir(path.join(root, 'board'), { recursive: true })
for (const [name, file] of await readPairs('src/data/team.ts', /\{ name: '([^']+)', image: '\/media\/board\/([^']+)' \}/g)) {
  await toWebp(portrait(name, 480, 720), path.join(root, 'board', file))
}

// Portfolio logo plates.
await mkdir(path.join(root, 'portfolio'), { recursive: true })
const companies = await readPairs('src/data/portfolio.ts', /name: '([^']+)',[\s\S]*?logo: logo\('([^']+)'\)/g)
for (const [i, [name, key]] of companies.entries()) {
  await toWebp(plate(name, i), path.join(root, 'portfolio', `${key}-480.webp`), 90)
}

// Brand: SVG icon, PNG favicons and the Open Graph card.
const icon = (size, pad) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-pad} ${-pad} ${34 + pad * 2} ${35 + pad * 2}"><rect x="${-pad}" y="${-pad}" width="${34 + pad * 2}" height="${35 + pad * 2}" fill="${INK}"/>${MARK}</svg>`
await mkdir(path.join(root, 'brand'), { recursive: true })
await sharp(Buffer.from(icon(256, 8))).png().toFile(path.join(root, 'brand', 'apple-icon.png'))
await sharp(Buffer.from(icon(64, 4))).resize(32, 32).png().toFile(path.join(root, 'brand', 'favicon.png'))
const { writeFile } = await import('node:fs/promises')
await writeFile(path.join(root, 'brand', 'icon.svg'), icon(100, 4).replace(/ width="100" height="100"/, ''))
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <g transform="translate(96 96) scale(3)">${MARK}</g>
  <text x="96" y="380" font-family="${SERIF}" font-size="76" fill="${IVORY}" letter-spacing="4">TALLWATER</text>
  <text x="96" y="440" font-family="${SERIF}" font-style="italic" font-size="40" fill="${SKY}">Capital that stays for the long haul.</text>
  <text x="96" y="540" font-family="${SANS}" font-size="24" fill="${IVORY}" fill-opacity="0.6">Growth capital for owner-led companies across the Great Lakes</text>
</svg>`
await sharp(Buffer.from(og)).jpeg({ quality: 88 }).toFile(path.join(root, 'brand', 'og.jpg'))

console.log('placeholders done')
