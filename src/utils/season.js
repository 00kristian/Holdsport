/**
 * Computes the current football season label, e.g. "26/27".
 *
 * The season flips in June: from June onward we're in the season that
 * runs into next year. So June 2026 → "26/27", May 2026 → "25/26".
 */
export function currentSeason(date = new Date()) {
  const SEASON_FLIP_MONTH = 5 // June (0-indexed: Jan = 0)
  const year = date.getFullYear() % 100
  const start = date.getMonth() >= SEASON_FLIP_MONTH ? year : year - 1
  const end = (start + 1) % 100
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(start)}/${pad(end)}`
}
