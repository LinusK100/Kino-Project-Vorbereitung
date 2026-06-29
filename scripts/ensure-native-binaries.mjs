// Insurance for a known npm quirk: optional native packages sometimes get
// installed without their actual `.node` binary (only package.json), which
// breaks rolldown / lightningcss / @tailwindcss/oxide at build time.
// This script scans node_modules for native binding packages whose `main`
// points to a missing `.node` file and restores it from the registry tarball.
// Idempotent and safe: does nothing if all binaries are present.

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execSync } from 'node:child_process'

const root = path.resolve('node_modules')

function* walk(dir, depth = 0) {
  if (depth > 3) return
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (!e.isDirectory() || e.name === '.bin') continue
    const full = path.join(dir, e.name)
    if (fs.existsSync(path.join(full, 'package.json'))) yield full
    if (e.name.startsWith('@') || e.name === 'node_modules') yield* walk(full, depth + 1)
  }
}

let restored = 0
for (const dir of walk(root)) {
  let pkg
  try { pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')) } catch { continue }
  const main = pkg.main || ''
  if (!main.endsWith('.node')) continue
  if (fs.existsSync(path.join(dir, main))) continue
  try {
    const url = execSync(`npm view ${pkg.name}@${pkg.version} dist.tarball`, { encoding: 'utf8' }).trim()
    if (!url) continue
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nat-'))
    execSync(`curl -sL "${url}" -o "${tmp}/p.tgz" && tar -xzf "${tmp}/p.tgz" -C "${tmp}"`)
    const found = execSync(`find "${tmp}/package" -name "*.node"`, { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    for (const f of found) {
      fs.copyFileSync(f, path.join(dir, path.basename(f)))
      // @tailwindcss/oxide's loader tries a local copy first → mirror it into the parent
      if (pkg.name.startsWith('@tailwindcss/oxide-')) {
        const parent = path.join(root, '@tailwindcss', 'oxide')
        if (fs.existsSync(parent)) fs.copyFileSync(f, path.join(parent, path.basename(f)))
      }
      restored++
      console.log(`restored ${pkg.name} → ${path.basename(f)}`)
    }
  } catch (err) {
    console.log(`skip ${pkg.name}: ${err.message}`)
  }
}
console.log(restored ? `Native binaries repaired: ${restored}` : 'All native binaries present.')
