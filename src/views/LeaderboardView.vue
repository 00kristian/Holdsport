<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('leaderboard.title') }}</h1>
      <p>{{ t('leaderboard.subtitle') }}</p>
    </div>

    <!-- Season selector -->
    <div class="season-row">
      <label class="season-label" for="season-select">{{ t('leaderboard.seasonLabel') }}</label>
      <select id="season-select" v-model="selectedLabel" class="season-select">
        <option v-for="s in seasons" :key="s.label" :value="s.label">{{ s.label }}</option>
      </select>
    </div>

    <template v-if="ranking.length">
      <!-- Meta -->
      <div class="lb-meta">
        <span class="lb-badge">{{ t('leaderboard.basis') }}</span>
        <span class="lb-window">{{ t('leaderboard.window', { season: selectedLabel, count: current.activitiesCounted }) }}</span>
      </div>

      <!-- Frameldt stat (issue #36) -->
      <div class="frameldt-stat" @click="frameldtOpen = !frameldtOpen" role="button" tabindex="0" @keydown.enter="frameldtOpen = !frameldtOpen">
        <div class="frameldt-left">
          <span class="frameldt-icon">🚫</span>
          <div>
            <div class="frameldt-title">{{ t('leaderboard.frameldt') }}</div>
            <div class="frameldt-desc">{{ t('leaderboard.frameldtDesc') }}</div>
          </div>
        </div>
        <span class="frameldt-toggle">{{ frameldtOpen ? '−' : '+' }}</span>
      </div>
      <Transition name="faq">
        <div v-show="frameldtOpen" class="frameldt-panel">
          <ol class="lb-list">
            <li v-for="(r, i) in absentRanking" :key="r.userId" class="lb-row">
              <span class="lb-rank">{{ i + 1 }}</span>
              <span class="lb-name">{{ r.name }}</span>
              <span class="lb-count">{{ r.absences }} <span class="lb-unit">{{ t('leaderboard.frameldtAbsences') }}</span></span>
            </li>
          </ol>
        </div>
      </Transition>

      <!-- Top 5 bar chart -->
      <div class="section-label" style="margin-top: 1.5rem">{{ t('leaderboard.top5') }}</div>
      <div class="chart">
        <div v-for="(r, i) in top5" :key="r.userId" class="chart-row">
          <div class="chart-rank">{{ medal(i) }}</div>
          <div class="chart-body">
            <div class="chart-label">
              <span class="chart-name">{{ r.name }}</span>
              <span class="chart-count">{{ r.attended }}</span>
            </div>
            <div class="chart-track">
              <div class="chart-bar" :class="{ gold: i === 0 }" :style="{ width: barWidth(r.attended) }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full ranking -->
      <div class="section-label" style="margin-top: 2.5rem">{{ t('leaderboard.fullList') }}</div>
      <ol class="lb-list">
        <li v-for="(r, i) in ranking" :key="r.userId" class="lb-row" :class="{ top: i < 3 }">
          <span class="lb-rank">{{ i < 3 ? medal(i) : i + 1 }}</span>
          <span class="lb-name">{{ r.name }}</span>
          <span class="lb-pct" v-if="current.activitiesCounted">{{ pct(r.attended) }}%</span>
          <span class="lb-count">{{ r.attended }} <span class="lb-unit">{{ t('leaderboard.activitiesShort') }}</span></span>
        </li>
      </ol>

      <p v-if="updatedLabel" class="updated">{{ t('leaderboard.updated') }} {{ updatedLabel }}</p>
    </template>

    <div v-else class="empty-state">{{ t('leaderboard.empty') }}</div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import data from '../data/leaderboard.json'

const { t, locale } = useI18n()

const seasons = computed(() => data.seasons || [])

const selectedLabel = ref(seasons.value[0]?.label || '')

const current = computed(() => seasons.value.find((s) => s.label === selectedLabel.value) || seasons.value[0] || {})

const ranking = computed(() => current.value.ranking || [])
const top5 = computed(() => ranking.value.slice(0, 5))

const maxAttended = computed(() => ranking.value[0]?.attended || 1)
const barWidth = (n) => `${Math.max(4, Math.round((n / maxAttended.value) * 100))}%`
const pct = (n) => Math.round((n / current.value.activitiesCounted) * 100)
const medal = (i) => ['🥇', '🥈', '🥉'][i] || ''

// Frameldt: sort by most absences (activitiesCounted - attended), descending.
const frameldtOpen = ref(false)
const absentRanking = computed(() => {
  const total = current.value.activitiesCounted || 0
  return [...ranking.value]
    .map((r) => ({ ...r, absences: total - r.attended }))
    .sort((a, b) => b.absences - a.absences || a.name.localeCompare(b.name, 'da'))
})

const updatedLabel = computed(() => {
  if (!current.value.generatedAt) return ''
  return new Date(current.value.generatedAt).toLocaleString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen',
  })
})
</script>

<style scoped>
/* Season selector */
.season-row {
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
}
.season-label {
  font-family: var(--font-cond); font-size: 0.8rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--steel);
}
.season-select {
  font-family: var(--font-cond); font-size: 0.9rem; font-weight: 700;
  letter-spacing: 0.06em; color: var(--white-pure);
  background: var(--navy2); border: 1px solid var(--border2);
  border-radius: var(--radius-sm); padding: 0.4rem 0.8rem; cursor: pointer;
  appearance: auto;
}
.season-select:focus { outline: 2px solid var(--blue); outline-offset: 2px; }

/* Meta */
.lb-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 0.9rem;
  margin-bottom: 1.25rem;
}
.lb-badge {
  font-size: 0.74rem; color: var(--steel);
  background: var(--navy2); border: 1px solid var(--border2);
  border-radius: 999px; padding: 0.3rem 0.7rem;
}
.lb-window { font-size: 0.78rem; color: var(--muted); }

/* Frameldt stat */
.frameldt-stat {
  display: flex; align-items: center; justify-content: space-between;
  background: var(--navy2); border: 1px solid var(--border2);
  border-left: 3px solid var(--red, #c8304a);
  border-radius: var(--radius); padding: 0.9rem 1.25rem;
  cursor: pointer; user-select: none; margin-bottom: 0.25rem;
  transition: border-color 0.15s;
}
.frameldt-stat:hover { border-color: var(--border2); }
.frameldt-left { display: flex; align-items: center; gap: 0.85rem; }
.frameldt-icon { font-size: 1.4rem; }
.frameldt-title {
  font-family: var(--font-cond); font-size: 0.95rem; font-weight: 700;
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--white-pure);
}
.frameldt-desc { font-size: 0.78rem; color: var(--steel); margin-top: 0.1rem; }
.frameldt-toggle {
  font-family: monospace; font-size: 1.3rem; color: var(--blue-light); flex-shrink: 0;
}
.frameldt-panel {
  background: var(--navy2); border: 1px solid var(--border); border-top: none;
  border-radius: 0 0 var(--radius) var(--radius); padding: 0.75rem 1rem 0.5rem;
  margin-bottom: 1rem;
}
.frameldt-panel .lb-list { gap: 0.3rem; }
.frameldt-panel .lb-row { padding: 0.5rem 0.85rem; }

/* Top 5 bar chart */
.chart { display: flex; flex-direction: column; gap: 0.85rem; }
.chart-row { display: grid; grid-template-columns: 28px 1fr; gap: 0.75rem; align-items: center; }
.chart-rank { font-size: 1.2rem; text-align: center; }
.chart-label {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 0.3rem;
}
.chart-name {
  font-family: var(--font-cond); font-weight: 700; font-size: 0.95rem;
  letter-spacing: 0.03em; color: var(--white);
}
.chart-count { font-family: var(--font-display); font-size: 1.15rem; color: var(--blue-light); }
.chart-track { background: var(--navy2); border: 1px solid var(--border); border-radius: 999px; height: 14px; overflow: hidden; }
.chart-bar {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, var(--blue), var(--blue-light));
  animation: grow 0.7s ease-out;
}
.chart-bar.gold { background: linear-gradient(90deg, #b8901a, var(--yellow)); }
@keyframes grow { from { width: 0 !important; } }

/* Full ranking list */
.lb-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.lb-row {
  display: grid; grid-template-columns: 2rem 1fr auto auto; gap: 0.85rem; align-items: center;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.7rem 1.1rem;
}
.lb-row.top { border-color: var(--border2); }
.lb-rank {
  font-family: var(--font-display); font-size: 1.05rem; color: var(--muted);
  text-align: center; min-width: 2rem;
}
.lb-name {
  font-family: var(--font-cond); font-weight: 700; font-size: 0.95rem;
  letter-spacing: 0.03em; text-transform: uppercase; color: var(--white);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.lb-pct { font-size: 0.78rem; color: var(--muted); }
.lb-count { font-family: var(--font-cond); font-weight: 700; color: var(--white-pure); white-space: nowrap; }
.lb-unit { font-weight: 400; font-size: 0.72rem; color: var(--steel); text-transform: lowercase; }

.updated { margin-top: 1.5rem; color: var(--muted); font-size: 0.78rem; }
.empty-state { color: var(--muted); padding: 2rem 0; font-size: 0.9rem; }

/* Frameldt panel transition */
.faq-enter-active, .faq-leave-active { transition: opacity 0.18s ease; }
.faq-enter-from, .faq-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .chart-bar { animation: none; }
}
@media (max-width: 480px) {
  .lb-pct { display: none; }
}
</style>
