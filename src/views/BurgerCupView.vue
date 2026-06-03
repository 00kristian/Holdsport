<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('burger.title') }}</h1>
      <p>{{ t('burger.subtitle') }}</p>
    </div>

    <!-- All-time scoreboard: series titles won by each side -->
    <div class="section-label">{{ t('burger.allTime') }}</div>
    <div class="scoreboard">
      <div class="sb-team" :class="{ leading: dkWins > rowWins }">
        <div class="sb-flag"><FlagDk class="sb-flag-img" /></div>
        <div class="sb-name">{{ t('burger.teams.dk') }}</div>
        <div class="sb-wins">{{ dkWins }}</div>
      </div>
      <div class="sb-vs">–</div>
      <div class="sb-team" :class="{ leading: rowWins > dkWins }">
        <div class="sb-flag"><GlobeIcon class="sb-globe-img" /></div>
        <div class="sb-name">{{ t('burger.teams.row') }}</div>
        <div class="sb-wins">{{ rowWins }}</div>
      </div>
    </div>
    <p class="sb-caption">{{ t('burger.seriesCaption') }}</p>

    <!-- Reigning champions -->
    <div v-if="reigning" class="reigning">
      <span class="reigning-icon">🍔</span>
      <div class="reigning-body">
        <div class="reigning-label">{{ t('burger.reigning') }}</div>
        <div class="reigning-team">
          <FlagDk v-if="reigning.winner === 'dk'" class="reigning-flag" />
          <GlobeIcon v-else class="reigning-globe" />
          {{ t('burger.teams.' + reigning.winner) }}
          <span class="reigning-meta">· {{ reigning.year }} · {{ reigning.score }}</span>
        </div>
      </div>
    </div>

    <!-- Edition-by-edition history -->
    <div class="section-label" style="margin-top: 2.5rem">{{ t('burger.history') }}</div>
    <ol class="edition-list">
      <li v-for="ed in data.editions" :key="ed.year" class="edition-row">
        <div class="ed-year">{{ ed.year }}</div>
        <div class="ed-winner">
          <FlagDk v-if="ed.winner === 'dk'" class="ed-flag-icon flag" />
          <GlobeIcon v-else class="ed-flag-icon globe" />
          {{ t('burger.teams.' + ed.winner) }}
        </div>
        <span class="badge badge-green">{{ t('burger.won') }} {{ ed.score }}</span>
      </li>
    </ol>

    <RouterLink to="/regler" class="rules-link" @click="goToBurgerRules">
      {{ t('burger.rulesLink') }} →
    </RouterLink>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReglerStore } from '../stores/regler.js'
import data from '../data/burger-cup.json'
import FlagDk from '../components/FlagDk.vue'
import GlobeIcon from '../components/GlobeIcon.vue'

const { t } = useI18n()
const reglerStore = useReglerStore()

const dkWins  = computed(() => data.editions.filter((e) => e.winner === 'dk').length)
const rowWins = computed(() => data.editions.filter((e) => e.winner === 'row').length)

// Editions are stored newest-first, so the first one is the reigning champion.
const reigning = computed(() => data.editions[0] || null)

function goToBurgerRules() {
  reglerStore.activeTab = 'burger'
}
</script>

<style scoped>
/* Scoreboard */
.scoreboard {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  gap: 1rem; background: var(--navy2); border: 1px solid var(--border2);
  border-radius: var(--radius); padding: 1.75rem 1.5rem;
}
.sb-team { text-align: center; opacity: 0.7; transition: opacity 0.15s; }
.sb-team.leading { opacity: 1; }
.sb-flag { display: flex; justify-content: center; align-items: center; height: 2.5rem; }
.sb-flag-img { width: 3.5rem; height: 2.6rem; border-radius: 3px; }
.sb-globe-img { width: 2.5rem; height: 2.5rem; color: var(--muted); }
.sb-team.leading .sb-globe-img { color: var(--blue-light); }
.sb-name {
  font-family: var(--font-cond); font-weight: 700; font-size: 0.85rem;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--steel);
  margin-top: 0.35rem;
}
.sb-team.leading .sb-name { color: var(--white-pure); }
.sb-wins {
  font-family: var(--font-display); font-size: 3.5rem; line-height: 1;
  color: var(--muted); margin-top: 0.25rem;
}
.sb-team.leading .sb-wins { color: var(--blue-light); }
.sb-vs { font-family: var(--font-display); font-size: 2rem; color: var(--muted); }
.sb-caption { text-align: center; color: var(--muted); font-size: 0.78rem; margin-top: 0.75rem; }

/* Reigning champions */
.reigning {
  display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem;
  padding: 1.1rem 1.4rem; background: var(--navy2);
  border: 1px solid var(--border2); border-left: 3px solid var(--yellow);
  border-radius: var(--radius);
}
.reigning-icon { font-size: 1.75rem; }
.reigning-label {
  font-family: var(--font-cond); font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase; color: var(--yellow);
}
.reigning-team {
  font-family: var(--font-cond); font-weight: 700; font-size: 1.15rem;
  letter-spacing: 0.04em; color: var(--white-pure); margin-top: 0.1rem;
  display: flex; align-items: center; gap: 0.5rem;
}
.reigning-flag { width: 1.8rem; height: 1.35rem; border-radius: 2px; flex-shrink: 0; }
.reigning-globe { width: 1.3rem; height: 1.3rem; flex-shrink: 0; color: var(--blue-light); }
.reigning-meta { color: var(--steel); font-weight: 600; font-size: 0.9rem; }

/* History */
.edition-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.edition-row {
  display: grid; grid-template-columns: 56px 1fr auto; gap: 1rem; align-items: center;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 0.85rem 1.25rem;
}
.ed-year { font-family: var(--font-display); font-size: 1.4rem; color: var(--blue-light); }
.ed-winner {
  font-family: var(--font-cond); font-weight: 700; font-size: 1rem;
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--white);
  display: flex; align-items: center; gap: 0.5rem;
}
.ed-flag-icon.flag { width: 1.6rem; height: 1.2rem; border-radius: 2px; flex-shrink: 0; }
.ed-flag-icon.globe { width: 1.2rem; height: 1.2rem; flex-shrink: 0; color: var(--steel); }

.rules-link {
  display: inline-block; margin-top: 2rem;
  font-family: var(--font-cond); font-weight: 700; font-size: 0.9rem;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--blue-light); text-decoration: none;
}
.rules-link:hover { color: var(--white-pure); }

@media (max-width: 480px) {
  .sb-wins { font-size: 2.75rem; }
  .sb-flag { font-size: 1.85rem; }
}
</style>
