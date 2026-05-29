<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>HOLDET</h1>
    </div>

    <div class="section-label">Trænere &amp; Stab</div>
    <div class="members-grid">
      <MemberCard v-for="m in staff" :key="m.name" v-bind="m" />
    </div>

    <div class="section-label">Spillertruppen</div>
    <div class="members-grid">
      <MemberCard v-for="m in players" :key="m.name" v-bind="m" />
    </div>

    <p class="photo-hint">Vil du have et profilbillede herinde? Send et billede til trænerstaben.</p>
  </main>
</template>

<script setup>
import MemberCard from '../components/MemberCard.vue'

// Replace with real names and optionally add image: '/images/navn.jpg'
const staff = [
  { name: 'Træner Navn',    role: 'Cheftræner',       emoji: '🧑‍🏫' },
  { name: 'Assistent Navn', role: 'Assistenttræner',  emoji: '🧑' },
  { name: 'Holdleder Navn', role: 'Holdleder',        emoji: '📋' },
]

const players = [
  { name: 'Spiller 1', role: 'Kaptajn', emoji: '🏒' },
  { name: 'Spiller 2', role: 'Spiller', emoji: '🏒' },
  { name: 'Spiller 3', role: 'Spiller', emoji: '🏒' },
  { name: 'Spiller 4', role: 'Keeper',  emoji: '🥅' },
  { name: 'Spiller 5', role: 'Spiller', emoji: '🏒' },
  { name: 'Spiller 6', role: 'Spiller', emoji: '🏒' },
]
</script>

<style scoped>
.members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 3rem; }
.photo-hint { color: var(--muted); font-size: 0.88rem; margin-top: 1rem; }
</style>
