// Erzeugt das herunterladbare PDF der Gesamt-Präsentation aus der Druck-Route
// /praesentation/druck (Playwright + System-Chrome, wie die übrige Verifikation).
// Ergebnis: public/CineTicket_Praesentation.pdf + Hash-Sidecar (.meta.json).
// Der Hash deckt alle Folien-JSON ab — scripts/check-praesentation.mjs schlägt
// beim Build fehl, wenn Folien geändert wurden, ohne das PDF neu zu erzeugen.
import { execSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4177
const BASE = `http://localhost:${PORT}/Kino-Project-Vorbereitung`
const PDF = join(root, 'public', 'CineTicket_Praesentation.pdf')
const META = join(root, 'public', 'CineTicket_Praesentation.meta.json')

export function praesentationHash() {
  const dir = join(root, 'src', 'data', 'presentations')
  const h = createHash('sha256')
  for (const f of readdirSync(dir).sort()) h.update(f).update(readFileSync(join(dir, f)))
  return h.digest('hex')
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url)
if (isMain) {
  console.log('→ Build (Guard übersprungen, wird gleich neu erzeugt) …')
  execSync('npm run build', { cwd: root, stdio: 'inherit', env: { ...process.env, PRAES_SKIP_CHECK: '1' } })

  console.log('→ Preview starten …')
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' })
  try {
    let up = false
    for (let i = 0; i < 40 && !up; i++) {
      up = await fetch(`${BASE}/`).then((r) => r.ok).catch(() => false)
      if (!up) await new Promise((r) => setTimeout(r, 300))
    }
    if (!up) throw new Error('Preview-Server startet nicht')

    console.log('→ Druck-Route rendern …')
    const { chromium } = await import('playwright-core')
    const browser = await chromium.launch({ channel: 'chrome', headless: true })
    // Viewport exakt in Seitengröße (297×167 mm bei 96 dpi): Sonst reflowt die
    // Print-Pipeline auf die schmalere Seite und breite Visuals brechen um.
    const page = await browser.newPage({ viewport: { width: 1122, height: 631 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(`${BASE}/praesentation/druck`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000) // reduzierte Animationen ausblenden lassen
    const folien = await page.locator('section').count()
    if (folien < 10) throw new Error(`Nur ${folien} Folien gerendert — Druck-Route defekt?`)
    if (errors.length) throw new Error('Seitenfehler: ' + errors.join(' | '))

    await page.pdf({
      path: PDF,
      width: '297mm', height: '167mm',
      printBackground: true,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    })
    await browser.close()

    writeFileSync(META, JSON.stringify({
      hash: praesentationHash(),
      folien,
      erzeugt: new Date().toISOString().slice(0, 10),
    }, null, 2) + '\n')
    console.log(`✓ PDF mit ${folien} Folien erzeugt: public/CineTicket_Praesentation.pdf`)
  } finally {
    preview.kill()
  }
}
