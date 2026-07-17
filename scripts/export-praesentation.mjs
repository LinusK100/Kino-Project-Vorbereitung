// Erzeugt das herunterladbare PDF der Gesamt-Präsentation als Folge echter
// Screenshots des Präsentationsmodus (Playwright + System-Chrome): Der Export
// startet die Präsentation auf der gebauten Website, fotografiert jede Folie
// in 1600×900 (2× Auflösung) und bindet die Bilder zu einem PDF. Das PDF kann
// dadurch nicht vom Live-Aussehen abweichen. Erste und letzte Seite verlinken
// auf die Website. Ergebnis: public/CineTicket_Praesentation.pdf + Sidecar.
// Der Hash deckt alle Folien-JSON ab — scripts/check-praesentation.mjs schlägt
// beim Build fehl, wenn Folien geändert wurden, ohne neu zu exportieren.
import { execSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4177
const BASE = `http://localhost:${PORT}/Kino-Project-Vorbereitung`
const LIVE = 'https://linusk100.github.io/Kino-Project-Vorbereitung/'
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

    console.log('→ Präsentation abfotografieren …')
    const { chromium } = await import('playwright-core')
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--hide-scrollbars'] })
    // 1600×900 = Referenz-Viewport der Präsentation, 2× für gestochen scharfe Schrift
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))

    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Präsentation starten' }).first().click()
    await page.waitForTimeout(400)
    await page.locator('[role="dialog"]').getByText('von vorn').click()
    await page.waitForTimeout(600)

    const folien = await page.locator('[role="tablist"] button').count()
    if (folien < 10) throw new Error(`Nur ${folien} Folien erkannt — Präsentation defekt?`)

    const bilder = []
    for (let i = 0; i < folien; i++) {
      await page.waitForTimeout(1300) // Einblend-Animationen und FitVisual ausklingen lassen
      bilder.push(await page.screenshot({ type: 'jpeg', quality: 92 }))
      if (i < folien - 1) await page.keyboard.press('ArrowRight')
    }
    if (errors.length) throw new Error('Seitenfehler: ' + errors.join(' | '))

    console.log(`→ ${folien} Folien zu PDF binden …`)
    const seiten = bilder.map((buf, i) => {
      const img = `<img src="data:image/jpeg;base64,${buf.toString('base64')}" style="display:block;width:1600px;height:900px">`
      const seite = i === 0 || i === bilder.length - 1
        ? `<a href="${LIVE}">${img}</a>` // Titel- und Schlussfolie verlinken auf die Website
        : img
      return `<div style="width:1600px;height:900px;overflow:hidden;${i < bilder.length - 1 ? 'page-break-after:always;' : ''}">${seite}</div>`
    }).join('')
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><title>CineTicket — Systemanalyse und Entwurf</title>` +
      `<style>html,body{margin:0;padding:0}</style></head><body>${seiten}</body></html>`,
      { waitUntil: 'load' },
    )
    await page.pdf({
      path: PDF,
      width: '1600px', height: '900px',
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
