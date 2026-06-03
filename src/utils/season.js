/**
 * Computes the current football season label, e.g. "25/26".
 *
 * The season flips in August: from August onward we're in the season that
 * runs into next year. So August 2025 → "25/26", July 2025 → "24/25".
 */
export function currentSeason(date = new Date()) {
  const SEASON_FLIP_MONTH = 7 // August (0-indexed: Jan = 0)
  const year = date.getFullYear() % 100
  const start = date.getMonth() >= SEASON_FLIP_MONTH ? year : year - 1
  const end = (start + 1) % 100
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(start)}/${pad(end)}`
}
