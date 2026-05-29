import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth.js'

/**
 * PROGRAM STORE
 * Responsible for fetching activities from the Holdsport API
 * and caching them so we don't re-fetch on every page visit.
 *
 * This is a great example of why Pinia is useful:
 * the fetch lives here, not inside the component — meaning
 * any component can read activities without triggering a new request.
 */
export const useProgramStore = defineStore('program', () => {
  const auth = useAuthStore()

  // --- State ---
  const activities  = ref([])       // The fetched activity list
  const loading     = ref(false)    // True while fetching
  const error       = ref(null)     // Error message string or null
  const lastFetched = ref(null)     // Timestamp of last successful fetch

  // --- Getters ---
  const hasActivities = computed(() => activities.value.length > 0)

  // Only re-fetch if more than 5 minutes have passed since last fetch
  const isStale = computed(() => {
    if (!lastFetched.value) return true
    return Date.now() - lastFetched.value > 5 * 60 * 1000
  })

  // --- Actions ---
  async function fetchActivities(forceRefresh = false) {
    if (!auth.isLoggedIn) {
      error.value = 'Ikke logget ind — udfyld email, adgangskode og hold-ID.'
      return
    }

    // Use cache if data is fresh and we're not forcing a refresh
    if (!forceRefresh && !isStale.value && hasActivities.value) return

    loading.value = true
    error.value   = null

    const today = new Date().toISOString().split('T')[0]
    const url   = `https://api.holdsport.dk/v1/teams/${auth.teamId}/activities?per_page=20&date=${today}`

    try {
      const res = await fetch(url, {
        headers: {
          'Authorization': auth.basicAuthHeader,
          'Accept': 'application/json',
        },
      })

      if (res.status === 401) throw new Error('Forkert email eller adgangskode.')
      if (res.status === 403) throw new Error('Ingen adgang til dette hold.')
      if (res.status === 404) throw new Error('Hold ikke fundet — tjek dit hold-ID.')
      if (!res.ok)            throw new Error(`API fejl: ${res.status}`)

      activities.value  = await res.json()
      lastFetched.value = Date.now()

    } catch (err) {
      if (err.name === 'TypeError') {
        // Most likely a CORS block
        error.value = 'CORS: Holdsport API\'et blokerede browserkald. En Cloudflare Worker proxy er nødvendig.'
      } else {
        error.value = err.message
      }
    } finally {
      loading.value = false
    }
  }

  function clearActivities() {
    activities.value  = []
    lastFetched.value = null
    error.value       = null
  }

  return { activities, loading, error, hasActivities, isStale, fetchActivities, clearActivities }
})
