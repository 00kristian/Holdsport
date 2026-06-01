#!/usr/bin/env node
/**
 * fetch-leaderboard.mjs — generates src/data/leaderboard.json from the Holdsport API.
 *
 * Builds the attendance leaderboard ("mød-op-konge"): team members ranked by how
 * many activities they've signed up for ("Tilmeldt") this season. Computed at
 * build time and shipped as a committed JSON, so no credentials reach the browser.
 * Runs before `npm run build` (see "prebuild") alongside the roster/program fetch.
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

// Season window. Bounded (not all-time) so numbers don't creep forever and
// newcomers can still catch up. Bump this each season.
const SEASON_START = '2025-08-01'
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

// Fetch every activity from SEASON_START onward, following pagination until a
// page comes back empty. Dedupe by id in case pages overlap.
async function fetchActivities(teamId, email, password) {
  const byId = new Map()
  for (let page = 1; page < 100; page++) {
    const batch = await api(
      `/teams/${teamId}/activities?date=${SEASON_START}&per_page=${PER_PAGE}&page=${page}`,
      email, password,
    )
    if (!batch.length) break
    for (const a of batch) byId.set(a.id, a)
  }
  return [...byId.values()]
}

function buildLeaderboard(members, activities, config) {
  const excluded = new Set((config.excludeMemberIds || []).map(Number))
  const overrides = config.overrides || {}
  // Activity event types to leave out of the count (e.g. admin meetings).
  const excludeTypes = (config.leaderboardExcludeEventTypes || []).map((s) => s.toLowerCase())
  const today = new Date().toISOString().split('T')[0]

  // Only activities that have already started (signups for things that happened),
  // within the season, excluding any opted-out event types.
  const counted = activities.filter((a) => {
    const date = String(a.starttime || '').split('T')[0]
    if (!date || date < SEASON_START || date > today) return false
    if (excludeTypes.includes(String(a.event_type || '').toLowerCase())) return false
    return true
  })

  // Tally signups (status_code 1 = Tilmeldt) by user.
  const tally = new Map()
  for (const a of counted) {
    for (const u of a.activities_users || []) {
      if (u.status_code === 1) tally.set(u.user_id, (tally.get(u.user_id) || 0) + 1)
    }
  }

  // Join against current members so everyone appears (including 0-counts), and
  // so former members who left the team drop off — mirrors the roster's filter.
  const ranking = members
    .filter((m) => m.role !== 5 && !excluded.has(m.id))
    .map((m) => {
      const ov = overrides[String(m.id)] || {}
      return { userId: m.id, name: ov.name || cleanName(m), attended: tally.get(m.id) || 0 }
    })
    // Sort by attendance desc, ties broken by name (stable, predictable).
    .sort((a, b) => b.attended - a.attended || a.name.localeCompare(b.name, 'da'))

  return {
    generatedAt: new Date().toISOString(),
    source: 'holdsport-api',
    seasonStart: SEASON_START,
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
    return // exit 0 so builds/deploys never fail on missing secrets
  }

  const [members, activities] = await Promise.all([
    api(`/teams/${teamId}/members`, email, password),
    fetchActivities(teamId, email, password),
  ])
  const leaderboard = buildLeaderboard(members, activities, config)

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(leaderboard, null, 2) + '\n')
  console.log(
    `✓ Wrote leaderboard: ${leaderboard.ranking.length} members over ` +
    `${leaderboard.activitiesCounted} activities to ${path.relative(ROOT, OUT_PATH)}`,
  )
}

main().catch((err) => {
  console.error('✗ ' + err.message)
  process.exit(1)
})
