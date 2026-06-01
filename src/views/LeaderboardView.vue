<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('leaderboard.title') }}</h1>
      <p>{{ t('leaderboard.subtitle') }}</p>
    </div>

    <template v-if="ranking.length">
      <!-- Honesty note + window -->
      <div class="lb-meta">
        <span class="lb-badge">{{ t('leaderboard.basis') }}</span>
        <span class="lb-window">{{ t('leaderboard.window', { date: seasonLabel, count: data.activitiesCounted }) }}</span>
      </div>

      <!-- Top 5 bar chart -->
      <div class="section-label">{{ t('leaderboard.top5') }}</div>
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
          <span class="lb-pct" v-if="data.activitiesCounted">{{ pct(r.attended) }}%</span>
          <span class="lb-count">{{ r.attended }} <span class="lb-unit">{{ t('leaderboard.activitiesShort') }}</span></span>
        </li>
      </ol>

      <p v-if="updatedLabel" class="updated">{{ t('leaderboard.updated') }} {{ updatedLabel }}</p>
    </template>

    <div v-else class="empty-state">{{ t('leaderboard.empty') }}</div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import data from '../data/leaderboard.json'

const { t, locale } = useI18n()

// Already sorted (attended desc, name asc) at build time.
const ranking = computed(() => data.ranking || [])
const top5 = computed(() => ranking.value.slice(0, 5))

// Scale bars to the leader so the chart fills its width.
const maxAttended = computed(() => ranking.value[0]?.attended || 1)
const barWidth = (n) => `${Math.max(4, Math.round((n / maxAttended.value) * 100))}%`
const pct = (n) => Math.round((n / data.activitiesCounted) * 100)
const medal = (i) => ['🥇', '🥈', '🥉'][i] || ''

const seasonLabel = computed(() =>
  new Date(data.seasonStart).toLocaleDateString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Copenhagen',
  }),
)

const updatedLabel = computed(() => {
  if (!data.generatedAt) return ''
  return new Date(data.generatedAt).toLocaleString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Copenhagen',
  })
})
</script>

<style scoped>
.lb-meta {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 0.9rem;
  margin-bottom: 2rem;
}
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

@media (prefers-reduced-motion: reduce) {
  .chart-bar { animation: none; }
}
@media (max-width: 480px) {
  .lb-pct { display: none; }
}
</style>
