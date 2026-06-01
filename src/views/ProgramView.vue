<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('program.title') }}</h1>
      <p>{{ t('program.subtitle') }}</p>
    </div>

    <!-- Loading: skeleton cards stand in for the schedule while it resolves -->
    <div v-if="loading" class="activity-list" aria-busy="true" :aria-label="t('program.loading')">
      <div v-for="n in 4" :key="n" class="skeleton-card">
        <div class="sk sk-date"></div>
        <div class="sk-info">
          <div class="sk sk-line sk-title"></div>
          <div class="sk sk-line sk-meta"></div>
        </div>
        <div class="sk sk-badge"></div>
      </div>
    </div>

    <!-- Error: the schedule couldn't be loaded at all -->
    <div v-else-if="error" class="state-box state-error" role="alert">
      <span class="state-icon">⚠️</span>
      <p>{{ t('program.error') }}</p>
    </div>

    <!-- Loaded -->
    <template v-else>
      <div v-if="events.length" class="activity-list">
        <ActivityCard v-for="activity in events" :key="activity.id" :activity="activity" />
      </div>
      <div v-else class="state-box empty-state">{{ t('program.empty') }}</div>

      <p v-if="updatedLabel" class="updated" :class="{ stale: isStale }">
        <span v-if="isStale" class="stale-dot">●</span>
        {{ t('program.updated') }} {{ updatedLabel }}<span v-if="isStale" class="stale-note"> · {{ t('program.stale') }}</span>
      </p>
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ActivityCard from '../components/ActivityCard.vue'

const { t, locale } = useI18n()

// The schedule is shipped as a committed JSON, built from the Holdsport API at
// deploy time (see scripts/fetch-program.mjs). We load it asynchronously rather
// than importing it statically so the page can show a loading skeleton, and a
// clear error state if the data ever fails to load — instead of a blank page.
const program = ref(null)
const loading = ref(true)
const error = ref(false)

// The deploy rebuilds the schedule every two hours. If the committed data is
// older than a day, several rebuilds have failed (e.g. Holdsport was down or
// login broke) — so we flag it as possibly stale rather than pretend it's fresh.
const STALE_AFTER_MS = 24 * 60 * 60 * 1000

onMounted(async () => {
  try {
    const mod = await import('../data/program.json')
    program.value = mod.default
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})

// Only show activities that haven't already finished.
const events = computed(() => {
  if (!program.value?.events) return []
  const now = Date.now()
  return program.value.events.filter((e) => !e.end || new Date(e.end).getTime() >= now)
})

const generatedAt = computed(() => program.value?.generatedAt || null)

const updatedLabel = computed(() => {
  if (!generatedAt.value) return ''
  return new Date(generatedAt.value).toLocaleString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: 'Europe/Copenhagen',
  })
})

const isStale = computed(() => {
  if (!generatedAt.value) return false
  return Date.now() - new Date(generatedAt.value).getTime() > STALE_AFTER_MS
})
</script>

<style scoped>
.activity-list { display: flex; flex-direction: column; gap: 0.5rem; }

/* Loading skeletons — mirror ActivityCard's grid so the layout doesn't jump. */
.skeleton-card {
  display: grid; grid-template-columns: 56px 1fr auto;
  gap: 1rem; align-items: center;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 1rem 1.25rem;
}
.sk { background: var(--navy3); border-radius: var(--radius-sm); position: relative; overflow: hidden; }
.sk::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
  transform: translateX(-100%); animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
.sk-date { width: 40px; height: 40px; margin: 0 auto; }
.sk-info { display: flex; flex-direction: column; gap: 0.5rem; }
.sk-line { height: 0.9rem; }
.sk-title { width: 55%; }
.sk-meta { width: 40%; height: 0.7rem; }
.sk-badge { width: 56px; height: 20px; }

.state-box {
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  text-align: center; padding: 2.5rem 1rem; font-size: 0.9rem; color: var(--muted);
  border: 1px dashed var(--border2); border-radius: var(--radius);
}
.state-box p { margin: 0; }
.state-icon { font-size: 1.5rem; }
.state-error { color: var(--steel); }

.updated { margin-top: 1.5rem; color: var(--muted); font-size: 0.78rem; }
.updated.stale { color: var(--yellow); }
.stale-dot { font-size: 0.55rem; vertical-align: middle; margin-right: 0.15rem; }
.stale-note { opacity: 0.85; }

@media (prefers-reduced-motion: reduce) {
  .sk::after { animation: none; }
}
</style>
