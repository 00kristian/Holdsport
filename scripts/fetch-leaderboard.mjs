#!/usr/bin/env node
/**
 * fetch-leaderboard.mjs — generates src/data/leaderboard.json from the Holdsport API.
 *
 * Builds the attendance leaderboard ("mød-op-konge"): team members ranked by how
 * many activities they've signed up for ("Tilmeldt") per season. Computed at
 * build time and shipped as a committed JSON, so no credentials reach the browser.
 * Runs before `npm run build` (see "prebuild") alongside the roster/program fetch.
 *
 * Output format: { seasons: [ { label, seasonStart, generatedAt, activitiesCounted, ranking } ] }
 * The UI shows a dropdown to select which season to display.
 *
 * Note on "attendance": this is RSVP status (status_code 1 = Tilmeldt), NOT
 * coach-verified presence — it's the best signal the API offers. The UI says so.
 *
 * Implementation note: the team activities endpoint already EMBEDS each
 * activity's `activities_users`, so we don't need the N+1 per-activity calls the
 * issue anticipated — one paginated sweep of the activity list is enough.
 *
 * Credentials come from env (gitignored .env locally, CI secrets in prod):
 *   HOLDSPORT_EMAIL, HOLDSPORT_PASSWORD, HOLDSPORT_TEAM_ID
 *
 * If credentials are missing, it keeps the existing leaderboard.json and exits 0,
 * so a deploy never fails on missing secrets.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONFIG_PATH = path.join(__dirname, 'roster-config.json')
const OUT_PATH = path.join(ROOT, 'src', 'data', 'leaderboard.json')

// All seasons to include, newest first. Season boundaries are 1 August – 31 July.
// Add a new entry here each August when a new season starts.
const SEASONS = [
  { label: '25/26', start: '2025-08-01', end: null          }, // current — end=null means up to today
  { label: '24/25', start: '2024-08-01', end: '2025-07-31' },
  { label: '23/24', start: '2023-08-01', end: '2024-07-31' },
]

const PER_PAGE = 50

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

// Same name-cleaning as fetch-roster: strip jersey numbers and goalie tags.
function cleanName(m) {
  return `${m.firstname || ''} ${m.lastname || ''}`
    .replace(/#\s*\d+/g, '')
    .replace(/\(\s*(goalie|g)\s*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Fetch every activity from earliestStart onward, following pagination until a
// page comes back empty. Dedupe by id in case pages overlap.
async function fetchAllActivities(teamId, email, password, earliestStart) {
  const byId = new Map()
  for (let page = 1; page < 200; page++) {
    const batch = await api(
      `/teams/${teamId}/activities?date=${earliestStart}&per_page=${PER_PAGE}&page=${page}`,
      email, password,
    )
    if (!batch.length) break
    for (const a of batch) byId.set(a.id, a)
  }
  return [...byId.values()]
}

// Count practices and games only — not socials, meetings, cups, etc.
function isPracticeOrGame(a) {
  const t = String(a.event_type || '').toLowerCase()
  return /træning|practice|training/.test(t) || /kamp|match|game/.test(t)
}

// Cancelled sessions are prefixed "AFLYST" — a signup for one isn't real turnout.
function isCancelled(a) {
  return /^\s*aflyst\b/i.test(a.name || '')
}

function buildSeasonLeaderboard(season, members, allActivities, config) {
  const excluded = new Set((config.excludeMemberIds || []).map(Number))
  const overrides = config.overrides || {}
  const today = new Date().toISOString().split('T')[0]
  const end = season.end || today

  const counted = allActivities.filter((a) => {
    const date = String(a.starttime || '').split('T')[0]
    if (!date || date < season.start || date > end) return false
    if (!isPracticeOrGame(a) || isCancelled(a)) return false
    return true
  })

  const tally = new Map()
  for (const a of counted) {
    for (const u of a.activities_users || []) {
      if (u.status_code === 1) tally.set(u.user_id, (tally.get(u.user_id) || 0) + 1)
    }
  }

  const ranking = members
    .filter((m) => m.role !== 5 && !excluded.has(m.id))
    .map((m) => {
      const ov = overrides[String(m.id)] || {}
      return { userId: m.id, name: ov.name || cleanName(m), attended: tally.get(m.id) || 0 }
    })
    .sort((a, b) => b.attended - a.attended || a.name.localeCompare(b.name, 'da'))

  return {
    label: season.label,
    seasonStart: season.start,
    generatedAt: new Date().toISOString(),
    source: 'holdsport-api',
    activitiesCounted: counted.length,
    ranking,
  }
}

async function main() {
  loadEnv()
  const config = readConfig()
  const { email, password, teamId } = credentials(config)

  if (!email || !password || !teamId) {
    console.warn('⚠ Holdsport credentials not set — keeping existing leaderboard.json.')
    return
  }

  // Fetch from the earliest season start so one call covers all seasons.
  const earliestStart = SEASONS[SEASONS.length - 1].start

  const [members, allActivities] = await Promise.all([
    api(`/teams/${teamId}/members`, email, password),
    fetchAllActivities(teamId, email, password, earliestStart),
  ])

  const seasons = SEASONS.map((s) => buildSeasonLeaderboard(s, members, allActivities, config))

  const output = { seasons }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + '\n')

  for (const s of seasons) {
    console.log(`✓ ${s.label}: ${s.ranking.length} members, ${s.activitiesCounted} activities`)
  }
  console.log(`Wrote to ${path.relative(ROOT, OUT_PATH)}`)
}

main().catch((err) => {
  console.error('✗ ' + err.message)
  process.exit(1)
})
