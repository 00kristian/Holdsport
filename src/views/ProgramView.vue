<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>PROGRAM</h1>
      <p>Kommende træning og kampe — live fra Holdsport.</p>
    </div>

    <!-- Login form (shown when not logged in) -->
    <div v-if="!authStore.isLoggedIn" class="auth-panel">
      <h3>LOG IND MED HOLDSPORT</h3>
      <div class="field">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="din@email.dk" @keyup.enter="submit" />
      </div>
      <div class="field">
        <label>Adgangskode</label>
        <input v-model="form.password" type="password" placeholder="••••••••" @keyup.enter="submit" />
      </div>
      <div class="field">
        <label>Hold-ID</label>
        <input v-model="form.teamId" type="text" placeholder="f.eks. 6237" @keyup.enter="submit" />
      </div>
      <button class="btn btn-primary submit-btn" @click="submit" :disabled="programStore.loading">
        {{ programStore.loading ? 'Henter…' : 'Hent Program' }}
      </button>
      <div class="cors-warn">
        <strong>⚠ CORS-begrænsning</strong>
        Holdsport API'et tillader ikke direkte browserkald. En Cloudflare Worker proxy løser dette (gratis, ~10 linjer JS).
      </div>
    </div>

    <!-- Logged in: show activities or error -->
    <div v-else>
      <div class="session-bar">
        <span>Logget ind som <strong>{{ authStore.email }}</strong> · Hold {{ authStore.teamId }}</span>
        <button class="btn btn-ghost logout-btn" @click="logout">Log ud</button>
      </div>

      <!-- Error state -->
      <div v-if="programStore.error" class="error-box">
        <strong>Fejl</strong>{{ programStore.error }}
      </div>

      <!-- Loading state -->
      <div v-else-if="programStore.loading" class="loading-box">
        <div class="spinner"></div>
        <p>Henter aktiviteter…</p>
      </div>

      <!-- Activities -->
      <div v-else-if="programStore.hasActivities" class="activity-list">
        <ActivityCard
          v-for="activity in programStore.activities"
          :key="activity.id"
          :activity="activity"
        />
      </div>

      <div v-else class="empty-state">
        Ingen kommende aktiviteter fundet.
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore }    from '../stores/auth.js'
import { useProgramStore } from '../stores/program.js'
import ActivityCard from '../components/ActivityCard.vue'

const authStore    = useAuthStore()
const programStore = useProgramStore()

// Local form state — only used until credentials are submitted
const form = reactive({ email: '', password: '', teamId: '' })

async function submit() {
  if (!form.email || !form.password || !form.teamId) return
  // Save credentials to Pinia auth store
  authStore.setCredentials(form.email, form.password, form.teamId)
  // Trigger fetch in program store
  await programStore.fetchActivities()
}

function logout() {
  authStore.clearCredentials()
  programStore.clearActivities()
  form.email = ''; form.password = ''; form.teamId = ''
}
</script>

<style scoped>
.auth-panel { background: var(--navy2); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; max-width: 420px; margin-bottom: 2rem; }
.auth-panel h3 { font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.06em; color: var(--white-pure); margin-bottom: 1.25rem; }
.field { margin-bottom: 0.75rem; }
.field label { display: block; font-family: var(--font-cond); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--steel); margin-bottom: 0.35rem; }
.field input { width: 100%; background: var(--navy); border: 1px solid var(--border2); border-radius: var(--radius-sm); color: var(--white); font-family: var(--font-body); font-size: 0.9rem; padding: 0.6rem 0.9rem; outline: none; }
.field input:focus { border-color: var(--blue); }
.submit-btn { width: 100%; justify-content: center; margin-top: 0.5rem; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cors-warn { background: #0a1828; border: 1px solid var(--border2); border-left: 2px solid var(--blue); border-radius: 0 var(--radius) var(--radius) 0; padding: 1rem 1.25rem; margin-top: 1.25rem; font-size: 0.84rem; color: var(--steel); line-height: 1.6; }
.cors-warn strong { display: block; font-family: var(--font-cond); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--blue-light); margin-bottom: 0.3rem; }

.session-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding: 0.75rem 1.25rem; background: var(--navy2); border: 1px solid var(--border); border-radius: var(--radius); font-size: 0.88rem; color: var(--steel); }
.session-bar strong { color: var(--white); }
.logout-btn { font-size: 0.78rem; padding: 0.35rem 0.9rem; }

.error-box { background: #1e0a10; border: 1px solid #4a1020; border-radius: var(--radius); padding: 1.25rem 1.5rem; color: #e05060; font-size: 0.9rem; }
.error-box strong { display: block; margin-bottom: 0.3rem; font-family: var(--font-cond); text-transform: uppercase; letter-spacing: 0.06em; }

.loading-box { text-align: center; padding: 3rem; color: var(--muted); }
.spinner { width: 36px; height: 36px; border-radius: 50%; border: 3px solid var(--border2); border-top-color: var(--blue); animation: spin 0.8s linear infinite; margin: 0 auto 1rem; }
@keyframes spin { to { transform: rotate(360deg); } }

.activity-list { display: flex; flex-direction: column; gap: 0.5rem; }
.empty-state { color: var(--muted); padding: 2rem 0; font-size: 0.9rem; }
</style>
