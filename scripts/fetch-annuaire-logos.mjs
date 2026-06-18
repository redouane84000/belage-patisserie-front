/**
 * Télécharge les avatars (TikTok puis Instagram) pour les fiches sans logo local.
 * Ne touche PAS au logo Bel Âge (/entreprise.belage.png).
 * Usage: node scripts/fetch-annuaire-logos.mjs
 */
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const CURL = process.platform === 'win32' ? 'curl.exe' : 'curl'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** @type {{ label: string, out: string, tiktok?: string, instagram?: string }[]} */
const TARGETS = [
  {
    label: 'Leyla PatisS',
    out: 'public/patissieres/leyla-patiss.jpg',
    tiktok: 'leyla.patisS',
    instagram: 'leyla_aygar',
  },
  {
    label: 'MAISON MRP',
    out: 'public/patissieres/maison-mrp.jpg',
    tiktok: 'maisonmrp',
    instagram: 'maisonmrp',
  },
  {
    label: 'Pâtisserie Délice',
    out: 'public/patissieres/patisserie-delice.jpg',
    tiktok: 'patisserie.delice78',
    instagram: 'patisserie_delice_',
  },
  {
    label: 'Créatrice by Iness',
    out: 'public/photographes/creatrice-by-iness.jpg',
    tiktok: 'creatricedecontenubyinss',
    instagram: 'creatrice.by.iness',
  },
]

function sleep(ms) {
  execFileSync(process.platform === 'win32' ? 'powershell.exe' : 'sleep', [
    ...(process.platform === 'win32' ? ['-Command', `Start-Sleep -Milliseconds ${ms}`] : [String(ms / 1000)]),
  ])
}

function curlPage(url) {
  return execFileSync(CURL, ['-sL', '-A', UA, url], { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 })
}

function downloadFile(url, outRel) {
  const outPath = path.join(root, outRel)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  execFileSync(CURL, ['-sL', '-A', UA, '-o', outPath, url])
  const size = fs.statSync(outPath).size
  if (size < 500) throw new Error(`fichier invalide (${size} o)`)
}

function extractAvatarFromHtml(html, { profileOnly = true } = {}) {
  const profilePatterns = [
    /"avatarLarger":"([^"]+)"/,
    /"avatarMedium":"([^"]+)"/,
    /"profile_pic_url_hd":"([^"]+)"/,
    /"profile_pic_url":"([^"]+)"/,
  ]
  const ogPatterns = [
    /property="og:image" content="([^"]+)"/,
    /content="([^"]+)" property="og:image"/,
  ]
  const patterns = profileOnly ? [...profilePatterns, ...ogPatterns] : [...ogPatterns, ...profilePatterns]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) {
      return m[1]
        .replace(/\\u0026/g, '&')
        .replace(/\\u002F/g, '/')
        .replace(/&amp;/g, '&')
        .replace(/s\d+x\d+/g, 's640x640')
    }
  }
  return null
}

function fetchAvatarUrl({ tiktok, instagram }) {
  if (tiktok) {
    try {
      const html = curlPage(`https://www.tiktok.com/@${tiktok}`)
      const url = extractAvatarFromHtml(html)
      if (url) return { url, source: `TikTok @${tiktok}` }
    } catch {
      /* fallback instagram */
    }
  }
  if (instagram) {
    sleep(800)
    const html = curlPage(`https://www.instagram.com/${instagram}/`)
    const url = extractAvatarFromHtml(html)
    if (url) return { url, source: `Instagram @${instagram}` }
  }
  throw new Error('avatar introuvable')
}

for (const target of TARGETS) {
  process.stdout.write(`${target.label} → ${target.out} … `)
  try {
    const { url, source } = fetchAvatarUrl(target)
    downloadFile(url, target.out)
    console.log(`OK (${source})`)
  } catch (err) {
    console.log(`ÉCHEC (${err.message})`)
  }
  sleep(600)
}
