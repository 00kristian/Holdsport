<template>
  <main>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-rink"></div>
      <div class="hero-glow"></div>
      <div class="hero-scratches"></div>
      <div class="hero-jersey">9</div>
      <div class="hero-content container">
        <div class="hero-left">
          <div class="hero-kicker">{{ t('home.kicker') }}</div>
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
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = computed(() => [
  { value: '26/27', label: t('home.statSeason') },
  { value: '31',    label: t('home.statPlayers') },
  { value: '3',     label: t('home.statCoaches') },
])
</script>

<style scoped>
.hero {
  min-height: 500px; position: relative; overflow: hidden;
  background: var(--navy2);
  display: flex; flex-direction: column; justify-content: flex-end;
  border-bottom: 1px solid var(--border);
}
.hero-rink {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 30% 50% at 75% 50%, transparent 49%, #1560bd18 50%, transparent 51%),
    linear-gradient(90deg, transparent 60%, #1560bd12 60.5%, transparent 61%),
    linear-gradient(90deg, transparent 49.5%, #c8304a10 50%, transparent 50.5%);
}
.hero-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 70% at 20% 60%, #1560bd14 0%, transparent 60%);
}
.hero-scratches {
  position: absolute; inset: 0; opacity: 0.03;
  background-image: repeating-linear-gradient(92deg, transparent, transparent 2px, #fff 2px, #fff 3px);
  background-size: 200px 100%;
}
.hero-jersey {
  position: absolute; right: 2rem; bottom: 0;
  font-family: var(--font-display); font-size: 22rem; line-height: 1;
  color: var(--navy3); letter-spacing: -0.05em;
  user-select: none; pointer-events: none; opacity: 0.5;
}
.hero-content { position: relative; z-index: 2; padding: 4rem 2rem 3.5rem; }
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
.hero h1 em { color: var(--blue-light); font-style: normal; display: block; }
.hero-sub { color: var(--steel); font-size: 1rem; max-width: 420px; margin-bottom: 2rem; line-height: 1.5; }
.hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

.stats-strip { background: var(--blue); }
.stats-inner { display: flex; }
.stat-item { flex: 1; text-align: center; padding: 0.75rem 1rem; border-right: 1px solid rgba(255,255,255,0.15); }
.stat-item:last-child { border-right: none; }
.stat-num { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.06em; color: var(--white-pure); line-height: 1; }
.stat-label { font-family: var(--font-cond); font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-top: 0.1rem; }
</style>
