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
          <div class="hero-kicker">Sæson 2025 / 26</div>
          <h1>VELKOMMEN<em>TIL HOLDET</em></h1>
          <p class="hero-sub">Alt hvad du behøver — regler, holdinfo og kontakt på ét sted. Ny spiller? Start her.</p>
          <div class="hero-actions">
            <RouterLink to="/ny-spiller" class="btn btn-primary">⚡ Ny Spiller</RouterLink>
            <RouterLink to="/regler"     class="btn btn-ghost">Læs Regler</RouterLink>
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

    <!-- Nav cards -->
    <div class="container">
      <div class="home-grid">
        <RouterLink v-for="card in cards" :key="card.to" :to="card.to" class="home-card">
          <div class="card-icon">{{ card.icon }}</div>
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
const stats = [
  { value: '2025', label: 'Sæson' },
  { value: '18',   label: 'Spillere' },
  { value: '2',    label: 'Trænere' },
  { value: '75%',  label: 'Fremmødekrav' },
]

const cards = [
  { to: '/ny-spiller', icon: '⚡', title: 'Ny Spiller',  description: 'Ny på holdet? Her er alt du skal vide fra dag 1.' },
  { to: '/regler',     icon: '📋', title: 'Regler',      description: 'Generelle regler og Burger Cup regler.' },
  { to: '/holdet',     icon: '👥', title: 'Holdet',      description: 'Mød spillere, trænere og stab.' },
  { to: '/kontakt',    icon: '📬', title: 'Kontakt',     description: 'Trænere og holdledelse.' },
  { to: '/program',    icon: '📅', title: 'Program',     description: 'Live fra Holdsport API.' },
]
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

.home-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; margin-top: 3rem; }
.home-card { background: var(--navy2); padding: 1.75rem 1.5rem; text-decoration: none; color: var(--white); transition: background 0.15s; display: block; }
.home-card:hover { background: var(--navy3); }
.card-icon { font-size: 1.4rem; margin-bottom: 0.75rem; }
.home-card h3 { font-family: var(--font-display); font-size: 1.25rem; letter-spacing: 0.06em; color: var(--white-pure); margin-bottom: 0.4rem; }
.home-card p  { font-size: 0.84rem; color: var(--steel); line-height: 1.5; }
</style>
