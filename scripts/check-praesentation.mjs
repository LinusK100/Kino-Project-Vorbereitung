// Stale-Guard: Das eingecheckte Präsentations-PDF muss zu den Folien-JSON
// passen. Läuft vor jedem Build (auch in CI) — schlägt fehl, wenn Folien
// geändert wurden, ohne `npm run export:praesentation` auszuführen.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { praesentationHash } from './export-praesentation.mjs'

if (process.env.PRAES_SKIP_CHECK === '1') process.exit(0)

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PDF = join(root, 'public', 'CineTicket_Praesentation.pdf')
const META = join(root, 'public', 'CineTicket_Praesentation.meta.json')

if (!existsSync(PDF) || !existsSync(META)) {
  console.error('✗ Präsentations-PDF fehlt. Bitte `npm run export:praesentation` ausführen.')
  process.exit(1)
}
const meta = JSON.parse(readFileSync(META, 'utf8'))
if (meta.hash !== praesentationHash()) {
  console.error('✗ Folien-JSON geändert, PDF veraltet. Bitte `npm run export:praesentation` ausführen.')
  process.exit(1)
}
console.log(`✓ Präsentations-PDF aktuell (${meta.folien} Folien, Stand ${meta.erzeugt})`)
