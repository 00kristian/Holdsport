<template>
  <main class="home-main">
    <!-- Hero -->
    <section class="hero">
      <img src="/images/teamphoto.jpeg" alt="" class="hero-photo" aria-hidden="true" />
      <div class="hero-overlay"></div>
      <div class="hero-scratches"></div>
      <div class="hero-content container">
        <div class="hero-left">
          <div class="hero-kicker">{{ t('home.kicker', { season }) }}</div>
          <h1>{{ t('home.h1') }}<em>{{ t('home.h1em') }}</em></h1>
          <p class="hero-sub">{{ t('home.sub') }}</p>
          <div class="hero-actions">
            <RouterLink to="/ny-spiller" class="btn btn-primary">{{ t('home.btnNewPlayer') }}</RouterLink>
            <RouterLink to="/regler"     class="btn btn-ghost">{{ t('home.btnRules') }}</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats strip -->
    <div class="stats-strip">
      <div class="container stats-inner">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <div class="stat-num">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Next up -->
    <div class="container next-up">
      <div class="section-label" style="margin-top: 2rem">{{ t('home.nextUp.label') }}</div>
      <RouterLink v-if="nextUp" to="/program" class="next-up-link">
        <ActivityCard :activity="nextUp" />
      </RouterLink>
      <RouterLink v-else to="/program" class="next-up-empty">{{ t('home.nextUp.empty') }}</RouterLink>
    </div>

  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { currentSeason } from '../utils/season.js'
import roster from '../data/roster.json'
import program from '../data/program.json'
import ActivityCard from '../components/ActivityCard.vue'

const { t } = useI18n()

const season = currentSeason()

// The next activity that hasn't finished yet — mirrors ProgramView's filter,
// then takes the soonest one. Events in program.json are already sorted by start.
const nextUp = computed(() => {
  const now = Date.now()
  return program.events.find((e) => !e.end || new Date(e.end).getTime() >= now) || null
})

const stats = computed(() => [
  { value: season,                          label: t('home.statSeason') },
  { value: String(roster.players.length),   label: t('home.statPlayers') },
  { value: String(roster.staff.length),     label: t('home.statCoaches') },
])

</script>

<style scoped>
.hero {
  min-height: 560px; position: relative; overflow: hidden;
  background: var(--navy2);
  display: flex; flex-direction: column; justify-content: flex-end;
  border-bottom: 1px solid var(--border);
}
.hero-photo {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center 70%;
  z-index: 0;
}
.hero-overlay {
  position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(
    to bottom,
    rgba(8, 14, 28, 0.55) 0%,
    rgba(8, 14, 28, 0.55) 30%,
    rgba(8, 14, 28, 0.85) 100%
  );
}
.hero-scratches {
  position: absolute; inset: 0; z-index: 2; opacity: 0.04;
  background-image: repeating-linear-gradient(92deg, transparent, transparent 2px, #fff 2px, #fff 3px);
  background-size: 200px 100%;
}
.hero-content { position: relative; z-index: 3; padding: 4rem 2rem 3.5rem; }
.hero-kicker {
  font-family: var(--font-cond); font-size: 0.78rem; font-weight: 700;
  letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--blue-light); margin-bottom: 0.75rem;
  display: flex; align-items: center; gap: 0.6rem;
}
.hero-kicker::before { content: ''; width: 20px; height: 2px; background: var(--blue-light); display: block; }
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6.5rem);
  letter-spacing: 0.04em; line-height: 0.9;
  color: var(--white-pure); margin-bottom: 1.25rem;
}
.hero h1 em { color: var(--blue-light); font-style: normal; display: block; margin-top: 0.15em; }
.hero-sub { color: var(--steel); font-size: 1rem; max-width: 420px; margin-bottom: 2rem; line-height: 1.5; }
.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.stats-strip { background: var(--blue); }
.stats-inner { display: flex; }
.stat-item { flex: 1; text-align: center; padding: 0.75rem 1rem; border-right: 1px solid rgba(255,255,255,0.15); }
.stat-item:last-child { border-right: none; }
.stat-num { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.06em; color: var(--white-pure); line-height: 1; }
.stat-label { font-family: var(--font-cond); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 0.1rem; }

.home-main { flex: 1; display: flex; flex-direction: column; }

/* Next up */
.next-up { flex: 1; padding-bottom: 3rem; }
.next-up-link { display: block; text-decoration: none; }
.next-up-link :deep(.activity-card) { cursor: pointer; }
.next-up-empty {
  display: block; text-decoration: none;
  background: var(--navy2); border: 1px solid var(--border); border-radius: var(--radius);
  padding: 1rem 1.25rem; color: var(--muted); font-size: 0.9rem;
}
.next-up-empty:hover { border-color: var(--border2); }

@media (max-width: 768px) {
  .hero { min-height: unset; }
  .hero-content { padding: 2.5rem 1.25rem 2.25rem; }
  .hero-jersey { font-size: 10rem; opacity: 0.15; right: -0.5rem; bottom: -0.5rem; }
  .hero h1 { font-size: 2.4rem; margin-bottom: 0.9rem; }
  .hero-sub { font-size: 0.9rem; margin-bottom: 1.5rem; }
  .hero-actions { flex-direction: row; flex-wrap: wrap; gap: 0.5rem; }
  .hero-actions .btn { flex: 1; min-width: 130px; justify-content: center; }
  .stat-item { padding: 0.6rem 0.5rem; }
  .stat-num  { font-size: 1.2rem; }
  .stat-label { font-size: 0.6rem; letter-spacing: 0.06em; }
}
</style>
