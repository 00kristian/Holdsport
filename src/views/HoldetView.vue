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
import roster from '../data/roster.json'

const { t } = useI18n()

// Roster is generated from the Holdsport API (scripts/fetch-roster.mjs) and
// already filtered + sorted by name. Here we just resolve the role label.
const toMember = (m) => ({ name: m.name, role: t(`team.roles.${m.roleKey}`), emoji: m.emoji })

const staff = computed(() => roster.staff.map(toMember))
const players = computed(() => roster.players.map(toMember))
</script>

<style scoped>
.members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; margin-bottom: 3rem; }
.photo-hint { color: var(--muted); font-size: 0.88rem; margin-top: 1rem; }
</style>
