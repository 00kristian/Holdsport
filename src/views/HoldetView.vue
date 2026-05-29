<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('team.title') }}</h1>
    </div>

    <div class="section-label">{{ t('team.sectionStaff') }}</div>
    <div class="members-grid">
      <MemberCard v-for="m in staff" :key="m.name" v-bind="m" />
    </div>

    <div class="section-label">{{ t('team.sectionPlayers') }}</div>
    <div class="members-grid">
      <MemberCard v-for="m in players" :key="m.name" v-bind="m" />
    </div>

    <p class="photo-hint">{{ t('team.photoHint') }}</p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MemberCard from '../components/MemberCard.vue'

const { t } = useI18n()

const staff = computed(() => [
  { name: 'William Nistrup', role: t('team.roles.headCoach'),       emoji: '🧑‍🏫' },
  { name: 'Kristian Berlin', role: t('team.roles.assistantAdmin'),  emoji: '📋' },
  { name: 'Oscar Pino',      role: t('team.roles.assistantSenior'), emoji: '🧑' },
])

const players = computed(() => [
  { name: 'Sebastian Ammitsøe',         role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Karl Beckman',               role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Julien Bedard',              role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Kristian Berlin',            role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Maxime Bettez',              role: t('team.roles.player'), emoji: '🏒' },
  { name: 'James Curliss',              role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Emil Hecht',                 role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Francesco Iannantuono',      role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Seb Jensen',                 role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Toby Keating',               role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Christian Keller',           role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Christian Lacoppidan',       role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Balder Lehmann',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Jesper Stig Malle',          role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Kim Stig Malle',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Mads Monies',                role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Benjamin Møller',            role: t('team.roles.player'), emoji: '🏒' },
  { name: 'William Nistrup',            role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Viktor Pesenti',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Oscar Pino',                 role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Michael Prencipe',           role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Elias Rasmussen',            role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Alex Shelko',                role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Simon Søgaard Heidensleben', role: t('team.roles.goalie'), emoji: '🥅' },
  { name: 'Anton Svejstrup',            role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Maksim Telelekov',           role: t('team.roles.goalie'), emoji: '🥅' },
  { name: 'Guillem Torner',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Danny Triesler',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Lauritz Trolle',             role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Toni Tuira',                 role: t('team.roles.player'), emoji: '🏒' },
  { name: 'Jannick W',                  role: t('team.roles.player'), emoji: '🏒' },
])
</script>

<style scoped>
.members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 3rem; }
.photo-hint { color: var(--muted); font-size: 0.88rem; margin-top: 1rem; }
</style>
