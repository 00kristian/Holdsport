<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>REGLER</h1>
      <p>Generelle holdregler og Burger Cup regler.</p>
    </div>

    <!-- Tab navigation -->
    <div class="rules-tabs">
      <button
        :class="['rtab', { active: reglerStore.activeTab === 'generelle' }]"
        @click="reglerStore.setTab('generelle')"
      >Generelle Regler</button>
      <button
        :class="['rtab', { active: reglerStore.activeTab === 'burger' }]"
        @click="reglerStore.setTab('burger')"
      >🍔 Burger Cup</button>
    </div>

    <!-- Generelle Regler -->
    <Transition name="fade" mode="out-in">
      <div v-if="reglerStore.activeTab === 'generelle'" key="generelle">
        <ol class="rule-list">
          <RuleCard v-for="(rule, i) in generelleRegler" :key="rule.title" :number="i + 1" :title="rule.title" :description="rule.description" />
        </ol>
      </div>

      <!-- Burger Cup -->
      <div v-else key="burger">
        <div class="burger-header">
          <div class="burger-icon">🍔</div>
          <div>
            <h3>BURGER CUP</h3>
            <p>Holdets interne turnering — egne regler gælder.</p>
          </div>
        </div>
        <ol class="rule-list">
          <RuleCard v-for="(rule, i) in burgerRegler" :key="rule.title" :number="i + 1" :title="rule.title" :description="rule.description" />
        </ol>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { useReglerStore } from '../stores/regler.js'
import RuleCard from '../components/RuleCard.vue'

// Reading from Pinia store — tab state persists even if you navigate away and back
const reglerStore = useReglerStore()

const generelleRegler = [
  { title: 'Fremmøde',        description: 'Mød til tiden til træning og kampe. Meld altid afbud via Holdsport. Forventet fremmøde er min. 75% over sæsonen.' },
  { title: 'Respekt',         description: 'Respekter holdkammerater, trænere og modstandere — på og uden for banen.' },
  { title: 'Udstyr',          description: 'Hold dit udstyr i orden. Kontakt træneren hvis der mangler noget.' },
  { title: 'Sociale medier',  description: 'Del ikke billeder eller video af andre uden samtykke.' },
  { title: 'Kommunikation',   description: 'Holdets kommunikation foregår primært via Holdsport. Tjek appen jævnligt.' },
  { title: 'Opførsel',        description: 'Nultolerance over for diskrimination, mobning eller chikane.' },
]

const burgerRegler = [
  { title: 'Format',     description: 'Burger Cup spilles som intern turnering. Format og runder aftales ved sæsonstart.' },
  { title: 'Tilmelding', description: 'Alle spillere er automatisk med. Afmelding senest 48 timer før første runde.' },
  { title: 'Regler',     description: 'Normale regler med eventuelle justeringer fra trænerstaben.' },
  { title: 'Præmie',     description: 'Vinderen køber burger til resten af holdet. Det er ikke til diskussion.' },
  { title: 'Tvister',    description: 'Trænerstabens afgørelse er endelig.' },
]
</script>

<style scoped>
.rules-tabs { display: flex; border-bottom: 2px solid var(--border2); margin-bottom: 2.5rem; }
.rtab { font-family: var(--font-cond); font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.65rem 1.4rem; cursor: pointer; background: none; border: none; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: color 0.15s, border-color 0.15s; }
.rtab:hover { color: var(--white); }
.rtab.active { color: var(--white-pure); border-bottom-color: var(--blue); }
.rule-list { list-style: none; padding: 0; }
.burger-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 1.25rem 1.5rem; background: var(--navy2); border: 1px solid var(--border2); border-radius: var(--radius); }
.burger-icon { font-size: 2rem; }
.burger-header h3 { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.06em; color: var(--white-pure); }
.burger-header p { font-size: 0.84rem; color: var(--steel); }
</style>
