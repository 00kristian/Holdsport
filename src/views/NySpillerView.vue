<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>NY SPILLER</h1>
      <p>Velkommen til holdet! Gå trinene igennem og du er klar på under 5 minutter.</p>
    </div>

    <div class="info-box" style="margin-bottom: 2rem">
      <div class="label">🏒 Tip</div>
      <p>Gå trinene igennem i rækkefølge — så er du klar til første træning.</p>
    </div>

    <!-- Steps -->
    <div class="steps">
      <div v-for="step in steps" :key="step.number" class="step">
        <div class="step-num-wrap">
          <div class="step-num">{{ step.number }}</div>
        </div>
        <div class="step-body">
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
          <RouterLink v-if="step.link" :to="step.link.to" class="btn btn-ghost step-btn">
            {{ step.link.label }} →
          </RouterLink>
          <span v-if="step.chip" class="chip">{{ step.chip }}</span>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <h2 class="faq-heading">FAQ</h2>
    <div class="faq">
      <div v-for="item in faq" :key="item.q" class="faq-item">
        <div class="faq-q">{{ item.q }}</div>
        <div class="faq-a">{{ item.a }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const steps = [
  {
    number: 1,
    title: 'Download Holdsport',
    description: 'Al kommunikation, tilmelding til træning og kampe foregår via Holdsport-appen. Download den og opret dig med din holdmail.',
    chip: 'App Store · Google Play',
  },
  {
    number: 2,
    title: 'Meld dig til træning',
    description: 'Find den næste træning i appen og meld dig til. Husk altid at melde afbud i god tid. Forventet fremmøde: minimum 75%.',
  },
  {
    number: 3,
    title: 'Læs reglerne',
    description: 'Vi har generelle holdregler og Burger Cup regler. Alle forventes at kende begge sæt.',
    link: { to: '/regler', label: 'Gå til Regler' },
  },
  {
    number: 4,
    title: 'Udstyr',
    description: 'Du medbringer selv fodboldstøvler og benskinner. Holdtrøjer udleveres af trænerstaben. Mangler der noget — kontakt holdlederen.',
  },
  {
    number: 5,
    title: 'Mød holdet',
    description: 'Se hvem der er på holdet og hvem du kan kontakte.',
    link: { to: '/holdet', label: 'Se Holdet' },
  },
]

const faq = [
  { q: 'Hvad sker der hvis jeg ikke kan møde op?', a: 'Meld afbud i Holdsport-appen hurtigst muligt. Gentagne udeblivelser uden afbud kan medføre en snak med holdledelsen.' },
  { q: 'Hvad er Burger Cup?', a: 'Holdets interne turnering med egne regler — læs dem under Regler → Burger Cup.' },
  { q: 'Hvornår er der træning?', a: 'Tjek Holdsport-appen eller Program-siden her på sitet.' },
  { q: 'Hvem kontakter jeg med spørgsmål?', a: 'Se Kontakt-siden. Ved akutte ting, skriv direkte til holdlederen i Holdsport.' },
]
</script>

<style scoped>
.steps { margin-top: 2rem; }
.step { display: grid; grid-template-columns: 64px 1fr; gap: 1.5rem; padding: 1.75rem 0; border-bottom: 1px solid var(--border); }
.step:last-child { border-bottom: none; }
.step-num-wrap { display: flex; flex-direction: column; align-items: center; padding-top: 4px; }
.step-num { font-family: var(--font-display); font-size: 1.8rem; color: var(--blue-light); line-height: 1; background: var(--border2); width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--blue); }
.step-body h3 { font-family: var(--font-cond); font-size: 1.25rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 0.4rem; color: var(--white-pure); }
.step-body p { color: var(--steel); font-size: 0.9rem; line-height: 1.65; }
.step-btn { margin-top: 0.75rem; font-size: 0.82rem; padding: 0.5rem 1.25rem; }
.chip { display: inline-block; margin-top: 0.75rem; background: var(--border2); border: 1px solid var(--border2); border-radius: 99px; padding: 0.25rem 0.8rem; font-family: var(--font-cond); font-size: 0.78rem; color: var(--blue-light); letter-spacing: 0.06em; }

.faq-heading { font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.06em; margin: 3rem 0 1.25rem; color: var(--white-pure); }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q { padding: 1rem 0; font-family: var(--font-cond); font-size: 1rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--white); display: flex; justify-content: space-between; align-items: center; }
.faq-q::after { content: '+'; color: var(--blue-light); font-size: 1.3rem; font-family: monospace; }
.faq-a { padding: 0 0 1rem; font-size: 0.9rem; color: var(--steel); line-height: 1.65; }
</style>
