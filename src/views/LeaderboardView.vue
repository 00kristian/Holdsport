<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('leaderboard.title') }}</h1>
      <p>{{ t('leaderboard.subtitle') }}</p>
    </div>

    <!-- Season selector + view toggle -->
    <div class="controls">
      <div class="season-row">
        <label class="season-label" for="season-select">{{ t('leaderboard.seasonLabel') }}</label>
        <select id="season-select" v-model="selectedLabel" class="season-select">
          <option v-for="s in seasons" :key="s.label" :value="s.label">{{ s.label }}</option>
        </select>
      </div>
      <div class="view-tabs">
        <button :class="['vtab', { active: view === 'attended' }]" @click="view = 'attended'">
          {{ t('leaderboard.tabAttended') }}
        </button>
        <button :class="['vtab', { active: view === 'frameldt' }]" @click="view = 'frameldt'">
          {{ t('leaderboard.tabFrameldt') }}
        </button>
      </div>
    </div>

    <template v-if="ranking.length">
      <div class="lb-meta">
        <span class="lb-badge">{{ t('leaderboard.basis') }}</span>
        <span class="lb-window">{{ t('leaderboard.window', { season: selectedLabel, count: current.activitiesCounted }) }}</span>
      </div>

      <!-- Top 5 bar chart -->
      <div class="section-label">{{ t('leaderboard.top5') }}</div>
      <div class="chart">
        <div v-for="(r, i) in top5" :key="r.userId" class="chart-row">
          <div class="chart-rank">{{ medal(i) }}</div>
          <div class="chart-body">
            <div class="chart-label">
              <span class="chart-name">{{ r.name }}</span>
              <span class="chart-count">{{ activeCount(r) }}</span>
            </div>
            <div class="chart-track">
              <div class="chart-bar" :class="{ gold: i === 0 && view === 'attended', red: view === 'frameldt' }" :style="{ width: barWidth(activeCount(r)) }"></div>
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
          <span class="lb-pct" v-if="current.activitiesCounted">{{ pct(activeCount(r)) }}%</span>
          <span class="lb-count">{{ activeCount(r) }} <span class="lb-unit">{{ t('leaderboard.activitiesShort') }}</span></span>
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
const view = ref('attended') // 'attended' | 'frameldt'

const current = computed(() => seasons.value.find((s) => s.label === selectedLabel.value) || seasons.value[0] || {})

const ranking = computed(() => {
  const rows = current.value.ranking || []
  if (view.value === 'frameldt') {
    return [...rows].sort((a, b) => b.frameldt - a.frameldt || a.name.localeCompare(b.name, 'da'))
  }
  return rows // already sorted by attended desc at build time
})

const top5 = computed(() => ranking.value.slice(0, 5))

const activeCount = (r) => view.value === 'frameldt' ? (r.frameldt ?? 0) : r.attended
const maxCount = computed(() => top5.value.reduce((m, r) => Math.max(m, activeCount(r)), 1))
const barWidth = (n) => `${Math.max(4, Math.round((n / maxCount.value) * 100))}%`
const pct = (n) => Math.round((n / current.value.activitiesCounted) * 100)
const medal = (i) => ['🥇', '🥈', '🥉'][i] || ''

const updatedLabel = computed(() => {
  if (!current.value.generatedAt) return ''
  return new Date(current.value.generatedAt).toLocaleString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen',
  })
})
</script>

<style scoped>
.controls {
  display: flex; flex-wrap: wrap; align-items: center;
  justify-content: space-between; gap: 0.75rem; margin-bottom: 1.5rem;
}

/* Season selector */
.season-row { display: flex; align-items: center; gap: 0.75rem; }
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

/* View toggle tabs */
.view-tabs { display: flex; border: 1px solid var(--border2); border-radius: var(--radius-sm); overflow: hidden; }
.vtab {
  font-family: var(--font-cond); font-size: 0.82rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.4rem 1rem; background: none; border: none; cursor: pointer;
  color: var(--muted); transition: color 0.15s, background 0.15s;
}
.vtab:hover { color: var(--white); }
.vtab.active { background: var(--blue); color: var(--white-pure); }

/* Meta */
.lb-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 0.9rem; margin-bottom: 1.25rem; }
.lb-badge {
  font-size: 0.74rem; color: var(--steel);
  background: var(--navy2); border: 1px solid var(--border2);
  border-radius: 999px; padding: 0.3rem 0.7rem;
}
.lb-window { font-size: 0.78rem; color: var(--muted); }

/* Top 5 bar chart */
.chart { display: flex; flex-direction: column; gap: 0.85rem; }
.chart-row { display: grid; grid-template-columns: 28px 1fr; gap: 0.75rem; align-items: center; }
.chart-rank { font-size: 1.2rem; text-align: center; }
.chart-label { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.3rem; }
.chart-name { font-family: var(--font-cond); font-weight: 700; font-size: 0.95rem; letter-spacing: 0.03em; color: var(--white); }
.chart-count { font-family: var(--font-display); font-size: 1.15rem; color: var(--blue-light); }
.chart-track { background: var(--navy2); border: 1px solid var(--border); border-radius: 999px; height: 14px; overflow: hidden; }
.chart-bar {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, var(--blue), var(--blue-light));
  animation: grow 0.7s ease-out;
}
.chart-bar.gold { background: linear-gradient(90deg, #b8901a, var(--yellow)); }
.chart-bar.red  { background: linear-gradient(90deg, #8b1a2a, #c8304a); }
@keyframes grow { from { width: 0 !important; } }

/* Full ranking */
.lb-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.4rem; }
.lb-row {
  display: grid; grid-template-columns: 2rem 1fr auto auto; gap: 0.85rem; align-items: center;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.7rem 1.1rem;
}
.lb-row.top { border-color: var(--border2); }
.lb-rank { font-family: var(--font-display); font-size: 1.05rem; color: var(--muted); text-align: center; min-width: 2rem; }
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

@media (prefers-reduced-motion: reduce) { .chart-bar { animation: none; } }
@media (max-width: 480px) {
  .lb-pct { display: none; }
  .controls { flex-direction: column; align-items: flex-start; }
}
</style>
