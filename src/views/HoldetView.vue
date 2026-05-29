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

const staff = [
  { name: 'William Nistrup', role: 'Cheftræner',                              emoji: '🧑‍🏫' },
  { name: 'Kristian Berlin', role: 'Assistenttræner / Holdleder / Admin',     emoji: '📋' },
  { name: 'Oscar Pino',      role: 'Assistenttræner / Senior ansvarlig',      emoji: '🧑' },
]

const players = [
  { name: 'Sebastian Ammitsøe',         role: 'Spiller', emoji: '🏒' },
  { name: 'Karl Beckman',               role: 'Spiller', emoji: '🏒' },
  { name: 'Julien Bedard',              role: 'Spiller', emoji: '🏒' },
  { name: 'Kristian Berlin',            role: 'Spiller', emoji: '🏒' },
  { name: 'Maxime Bettez',              role: 'Spiller', emoji: '🏒' },
  { name: 'James Curliss',              role: 'Spiller', emoji: '🏒' },
  { name: 'Emil Hecht',                 role: 'Spiller', emoji: '🏒' },
  { name: 'Francesco Iannantuono',      role: 'Spiller', emoji: '🏒' },
  { name: 'Seb Jensen',                 role: 'Spiller', emoji: '🏒' },
  { name: 'Toby Keating',               role: 'Spiller', emoji: '🏒' },
  { name: 'Christian Keller',           role: 'Spiller', emoji: '🏒' },
  { name: 'Christian Lacoppidan',       role: 'Spiller', emoji: '🏒' },
  { name: 'Balder Lehmann',             role: 'Spiller', emoji: '🏒' },
  { name: 'Jesper Stig Malle',          role: 'Spiller', emoji: '🏒' },
  { name: 'Kim Stig Malle',             role: 'Spiller', emoji: '🏒' },
  { name: 'Mads Monies',                role: 'Spiller', emoji: '🏒' },
  { name: 'Benjamin Møller',            role: 'Spiller', emoji: '🏒' },
  { name: 'William Nistrup',            role: 'Spiller', emoji: '🏒' },
  { name: 'Viktor Pesenti',             role: 'Spiller', emoji: '🏒' },
  { name: 'Oscar Pino',                 role: 'Spiller', emoji: '🏒' },
  { name: 'Michael Prencipe',           role: 'Spiller', emoji: '🏒' },
  { name: 'Elias Rasmussen',            role: 'Spiller', emoji: '🏒' },
  { name: 'Alex Shelko',                role: 'Spiller', emoji: '🏒' },
  { name: 'Simon Søgaard Heidensleben', role: 'Goalie',  emoji: '🥅' },
  { name: 'Anton Svejstrup',            role: 'Spiller', emoji: '🏒' },
  { name: 'Maksim Telelekov',           role: 'Goalie',  emoji: '🥅' },
  { name: 'Guillem Torner',             role: 'Spiller', emoji: '🏒' },
  { name: 'Danny Triesler',             role: 'Spiller', emoji: '🏒' },
  { name: 'Lauritz Trolle',             role: 'Spiller', emoji: '🏒' },
  { name: 'Toni Tuira',                 role: 'Spiller', emoji: '🏒' },
  { name: 'Jannick W',                  role: 'Spiller', emoji: '🏒' },
]
</script>

<style scoped>
.members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 3rem; }
.photo-hint { color: var(--muted); font-size: 0.88rem; margin-top: 1rem; }
</style>
