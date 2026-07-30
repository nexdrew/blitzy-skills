#!/usr/bin/env node
// Copies shared/*.md into every skill's references/_shared/ so each skill stays
// self-contained when installed individually (npx skills add ... --skill <name>).
// Run after editing anything in shared/; CI fails if copies drift.
//
//   node scripts/sync-shared.mjs          # sync
//   node scripts/sync-shared.mjs --check  # exit 1 if any copy is out of date

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sharedDir = join(root, 'shared')
const skillsDir = join(root, 'skills')
const check = process.argv.includes('--check')

const sharedFiles = readdirSync(sharedDir).filter((f) => f.endsWith('.md'))
const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(skillsDir, d.name, 'SKILL.md')))
  .map((d) => d.name)

let drift = 0
for (const skill of skills) {
  const target = join(skillsDir, skill, 'references', '_shared')
  for (const file of sharedFiles) {
    const src = readFileSync(join(sharedDir, file), 'utf8')
    const dest = join(target, file)
    const current = existsSync(dest) ? readFileSync(dest, 'utf8') : null
    if (current === src) continue
    drift++
    if (check) {
      console.error(`DRIFT: ${skill}/references/_shared/${file}`)
    } else {
      mkdirSync(target, { recursive: true })
      writeFileSync(dest, src)
      console.log(`synced ${skill}/references/_shared/${file}`)
    }
  }
}

if (check && drift) {
  console.error(`\n${drift} file(s) out of sync. Run: node scripts/sync-shared.mjs`)
  process.exit(1)
}
console.log(check ? 'shared references in sync' : `done (${skills.length} skills)`)
