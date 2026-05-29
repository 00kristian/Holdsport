<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('program.title') }}</h1>
      <p>{{ t('program.subtitle') }}</p>
    </div>

    <div v-if="events.length" class="activity-list">
      <ActivityCard v-for="activity in events" :key="activity.id" :activity="activity" />
    </div>
    <div v-else class="empty-state">{{ t('program.empty') }}</div>

    <p v-if="updatedLabel" class="updated">{{ t('program.updated') }} {{ updatedLabel }}</p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import program from '../data/program.json'
import ActivityCard from '../components/ActivityCard.vue'

const { t, locale } = useI18n()

// Only show activities that haven't already finished.
const events = computed(() => {
  const now = Date.now()
  return program.events.filter((e) => !e.end || new Date(e.end).getTime() >= now)
})

const updatedLabel = computed(() => {
  if (!program.generatedAt) return ''
  return new Date(program.generatedAt).toLocaleString(locale.value === 'da' ? 'da-DK' : 'en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
})
</script>

<style scoped>
.activity-list { display: flex; flex-direction: column; gap: 0.5rem; }
.empty-state { color: var(--muted); padding: 2rem 0; font-size: 0.9rem; }
.updated { margin-top: 1.5rem; color: var(--muted); font-size: 0.78rem; }
</style>
