#!/usr/bin/env node
/**
 * fetch-roster.mjs — generates src/data/roster.json from the Holdsport API.
 *
 * The website reads the committed roster.json; this script refreshes it.
 * It runs automatically before `npm run build` (see "prebuild" in package.json).
 *
 * Credentials are read from environment variables (loaded from a gitignored
 * .env file locally, or from deploy/CI secrets in production):
 *   HOLDSPORT_EMAIL, HOLDSPORT_PASSWORD, HOLDSPORT_TEAM_ID
 *
 * Usage:
 *   npm run roster          Fetch members and write roster.json
 *   npm run roster:teams    List the teams your account can see (to find your team ID)
 *   npm run roster:list     List every member with id + role + name (to pick excludes/overrides)
 *
 * If credentials are missing, the script keeps the existing roster.json and
 * exits 0 — so a deploy never fails just because secrets aren't configured.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const CONFIG_PATH = path.join(__dirname, 'roster-config.json')
const OUT_PATH = path.join(ROOT, 'src', 'data', 'roster.json')

// Holdsport role codes → see https://github.com/Holdsport/holdsport-api
// 1 player, 2 coach, 3 assistant coach, 4 injured, 5 inactive
const ROLE_NAMES = { 1: 'player', 2: 'coach', 3: 'assistant coach', 4: 'injured', 5: 'inactive' }

// --- Minimal .env loader (no dependency) -----------------------------------
function loadEnv() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    if (process.env[key] === undefined) process.env[key] = val
  }
}

function readConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
}

function credentials(config) {
  const email = process.env.HOLDSPORT_EMAIL
  const password = process.env.HOLDSPORT_PASSWORD
  const teamId = process.env.HOLDSPORT_TEAM_ID || config.teamId
  return { email, password, teamId }
}

function authHeader(email, password) {
  return 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64')
}

async function api(urlPath, email, password) {
  const res = await fetch(`https://api.holdsport.dk/v1${urlPath}`, {
    headers: { Authorization: authHeader(email, password), Accept: 'application/json' },
  })
  if (res.status === 401) throw new Error('401 — wrong email or password.')
  if (res.status === 403) throw new Error('403 — no access to this team.')
  if (res.status === 404) throw new Error('404 — not found (check the team ID).')
  if (!res.ok) throw new Error(`Holdsport API error: ${res.status}`)
  return res.json()
}

const sortByName = (a, b) => a.name.localeCompare(b.name, 'da')

// Build a clean display name from the API's firstname/lastname, stripping the
// jersey numbers and goalie tags people put in their Holdsport names, e.g.
// "Simon  Søgaard Heidensleben (G)" or "Eliot Yarbrough # 34".
function cleanName(m) {
  const raw = `${m.firstname || ''} ${m.lastname || ''}`
  return raw
    .replace(/#\s*\d+/g, '')                 // jersey numbers: "#34", "# 34"
    .replace(/\(\s*(goalie|g)\s*\)/gi, '')   // goalie tags: "(Goalie)", "(G)"
    .replace(/\s+/g, ' ')                    // collapse whitespace
    .trim()
}

// A member is a goalie if their Holdsport name is tagged with "(G)"/"(Goalie)".
function looksLikeGoalie(m) {
  return /\(\s*(goalie|g)\s*\)|goalie/i.test(`${m.firstname || ''} ${m.lastname || ''}`)
}

function buildRoster(members, config) {
  const excluded = new Set((config.excludeMemberIds || []).map(Number))
  const overrides = config.overrides || {}
  const staff = []
  const players = []

  for (const m of members) {
    if (m.role === 5) continue        // inactive on Holdsport
    if (excluded.has(m.id)) continue  // manually hidden (still-active accounts we don't want shown)

    const ov = overrides[String(m.id)] || {}
    const name = ov.name || cleanName(m)
    const playerRole = looksLikeGoalie(m) ? 'goalie' : 'player'
    const playerEntry = { name, roleKey: playerRole, emoji: playerRole === 'goalie' ? '🥅' : '🏒' }

    // Staff is opt-in via overrides — the Holdsport "role" field doesn't match
    // the website's staff concept (real coaches are sometimes listed as players
    // and vice versa). Everyone else is a player.
    if (ov.group === 'staff') {
      staff.push({ name, roleKey: ov.roleKey || 'coach', emoji: ov.emoji || '🧑‍🏫' })
      if (ov.alsoPlayer) players.push(playerEntry) // staff who also skate stay in the squad
    } else {
      players.push(playerEntry)
    }
  }

  staff.sort(sortByName)
  players.sort(sortByName)
  return { generatedAt: new Date().toISOString(), source: 'holdsport-api', staff, players }
}

async function main() {
  loadEnv()
  const config = readConfig()
  const { email, password, teamId } = credentials(config)
  const mode = process.argv[2]

  // --- List teams (to discover the team ID) ---
  if (mode === '--teams') {
    if (!email || !password) {
      console.error('Set HOLDSPORT_EMAIL and HOLDSPORT_PASSWORD in .env first.')
      process.exit(1)
    }
    const teams = await api('/teams', email, password)
    console.log('\nYour Holdsport teams:\n')
    for (const t of teams) console.log(`  id ${t.id}\t${t.name}`)
    console.log('\nPut the right id in .env as HOLDSPORT_TEAM_ID.\n')
    return
  }

  // --- List members (to pick excludes / overrides) ---
  if (mode === '--list') {
    if (!email || !password || !teamId) {
      console.error('Set HOLDSPORT_EMAIL, HOLDSPORT_PASSWORD and HOLDSPORT_TEAM_ID in .env first.')
      process.exit(1)
    }
    const members = await api(`/teams/${teamId}/members`, email, password)
    const rows = members
      .map((m) => ({ id: m.id, role: m.role, name: cleanName(m), goalie: looksLikeGoalie(m) }))
      .sort((a, b) => a.role - b.role || sortByName(a, b))
    console.log(`\nMembers of team ${teamId} (${members.length}):\n`)
    for (const m of rows) {
      const tag = m.goalie ? ' 🥅' : ''
      console.log(`  id ${String(m.id).padEnd(8)} role ${m.role} (${ROLE_NAMES[m.role] || '?'})\t${m.name}${tag}`)
    }
    console.log('\nAdd unwanted ids to excludeMemberIds, and goalie/staff detail to overrides, in scripts/roster-config.json.\n')
    return
  }

  // --- Default: fetch and write roster.json ---
  if (!email || !password || !teamId) {
    console.warn('⚠ Holdsport credentials not set — keeping existing roster.json.')
    return // exit 0 so builds/deploys never fail on missing secrets
  }

  const members = await api(`/teams/${teamId}/members`, email, password)
  const roster = buildRoster(members, config)
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(roster, null, 2) + '\n')
  console.log(`✓ Wrote ${roster.staff.length} staff + ${roster.players.length} players to ${path.relative(ROOT, OUT_PATH)}`)
}

main().catch((err) => {
  console.error('✗ ' + err.message)
  process.exit(1)
})
