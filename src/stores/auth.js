import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * AUTH STORE
 * Holds Holdsport login credentials in memory for the session.
 * This means the user only needs to log in once per visit —
 * the Program page reads from here instead of asking again.
 *
 * NOTE: We intentionally do NOT persist to localStorage.
 * Credentials should not be stored in the browser beyond the session.
 */
export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const email    = ref('')
  const password = ref('')
  const teamId   = ref('')

  // --- Getters ---
  // True only when all three fields are filled in
  const isLoggedIn = computed(() =>
    email.value.trim() !== '' &&
    password.value.trim() !== '' &&
    teamId.value.trim() !== ''
  )

  // Base64-encoded Basic Auth header value
  const basicAuthHeader = computed(() =>
    isLoggedIn.value
      ? 'Basic ' + btoa(`${email.value}:${password.value}`)
      : null
  )

  // --- Actions ---
  function setCredentials(e, p, t) {
    email.value    = e
    password.value = p
    teamId.value   = t
  }

  function clearCredentials() {
    email.value    = ''
    password.value = ''
    teamId.value   = ''
  }

  return { email, password, teamId, isLoggedIn, basicAuthHeader, setCredentials, clearCredentials }
})
