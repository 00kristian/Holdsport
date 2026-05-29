#!/usr/bin/env node
/**
 * fetch-program.mjs — generates src/data/program.json from the Holdsport API.
 *
 * The Program page reads this committed file, so visitors see the schedule
 * with no login. It runs automatically before `npm run build` (see "prebuild")
 * and on a daily cron in the deploy workflow, so the schedule stays current.
 *
 * Credentials come from env (gitignored .env locally, CI secrets in prod):
 *   HOLDSPORT_EMAIL, HOLDSPORT_PASSWORD, HOLDSPORT_TEAM_ID
 *
 * If credentials are missing, it keeps the existing program.json and exits 0,
 * so a deploy never fails on missing secrets.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONFIG_PATH = path.join(__dirname, 'roster-config.json')
const OUT_PATH = path.join(ROOT, 'src', 'data', 'program.json')

const HOW_MANY = 30 // upcoming activities to fetch

function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    if (process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
}

function readConfig() {
  return fs.existsSync(CONFIG_PATH) ? JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')) : {}
}

function credentials(config) {
  const teamId = process.env.HOLDSPORT_TEAM_ID || config.teamId
  return { email: process.env.HOLDSPORT_EMAIL, password: process.env.HOLDSPORT_PASSWORD, teamId }
}

async function api(urlPath, email, password) {
  const auth = 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64')
  const res = await fetch(`https://api.holdsport.dk/v1${urlPath}`, {
    headers: { Authorization: auth, Accept: 'application/json' },
  })
  if (res.status === 401) throw new Error('401 — wrong email or password.')
  if (res.status === 404) throw new Error('404 — team not found (check the team ID).')
  if (!res.ok) throw new Error(`Holdsport API error: ${res.status}`)
  return res.json()
}

// Reduce each activity to a small, public-safe shape — no per-member name lists.
function toEvent(a) {
  const attending = Array.isArray(a.activities_users)
    ? a.activities_users.filter((u) => u.status_code === 1).length
    : 0
  return {
    id: a.id,
    name: a.name || '',
    eventType: a.event_type || '',
    start: a.starttime || null,
    end: a.endtime || null,
    place: a.place || '',
    comment: a.comment || '',
    attending,
  }
}

async function main() {
  loadEnv()
  const config = readConfig()
  const { email, password, teamId } = credentials(config)

  if (!email || !password || !teamId) {
    console.warn('⚠ Holdsport credentials not set — keeping existing program.json.')
    return // exit 0 so builds/deploys never fail on missing secrets
  }

  // Activity names to hide (e.g. open drop-in sessions that aren't our team).
  const exclude = (config.programExcludeNames || []).map((s) => s.toLowerCase())
  const isExcluded = (name) => exclude.some((x) => (name || '').toLowerCase().includes(x))

  const today = new Date().toISOString().split('T')[0]
  const raw = await api(`/teams/${teamId}/activities?per_page=${HOW_MANY}&date=${today}`, email, password)
  const events = raw
    .filter((a) => !isExcluded(a.name))
    .map(toEvent)
    .sort((a, b) => String(a.start).localeCompare(String(b.start)))

  const program = { generatedAt: new Date().toISOString(), source: 'holdsport-api', events }
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(program, null, 2) + '\n')
  console.log(`✓ Wrote ${events.length} upcoming activities to ${path.relative(ROOT, OUT_PATH)}`)
}

main().catch((err) => {
  console.error('✗ ' + err.message)
  process.exit(1)
})
