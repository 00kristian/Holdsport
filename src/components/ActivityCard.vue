<template>
  <div class="activity-card">
    <div class="act-date">
      <div class="act-day">{{ day }}</div>
      <div class="act-month">{{ month }}</div>
    </div>
    <div class="act-info">
      <div class="act-name">{{ activity.name || t('activity.fallbackName') }}</div>
      <div class="act-meta">
        <span v-if="timeRange">🕐 {{ timeRange }}</span>
        <span v-if="activity.place">📍 {{ activity.place }}</span>
        <span v-if="activity.attending">👥 {{ activity.attending }} {{ t('activity.attendingCount') }}</span>
      </div>
    </div>
    <span v-if="activity.eventType" :class="['badge', badgeClass]">{{ eventTypeLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  activity: { type: Object, required: true },
})

const { t, tm, locale } = useI18n()

const date  = computed(() => new Date(props.activity.start))
const day   = computed(() => date.value.getDate())
const month = computed(() => tm('activity.months')[date.value.getMonth()])

const fmtTime = (d) =>
  d.toLocaleTimeString(locale.value === 'da' ? 'da-DK' : 'en-GB', { hour: '2-digit', minute: '2-digit' })

// Show the full duration, e.g. "21:00–23:00" (falls back to just the start).
const timeRange = computed(() => {
  if (!props.activity.start) return ''
  const start = fmtTime(date.value)
  return props.activity.end ? `${start}–${fmtTime(new Date(props.activity.end))}` : start
})

// Holdsport event types come back in Danish; translate the common ones, fall
// back to the raw value for anything we don't recognise.
const eventTypeLabel = computed(() => {
  const map = tm('activity.eventTypes') || {}
  return map[props.activity.eventType] || props.activity.eventType
})
const badgeClass = computed(() => (/kamp|match|game/i.test(props.activity.eventType) ? 'badge-green' : 'badge-muted'))
</script>

<style scoped>
.activity-card {
  display: grid; grid-template-columns: 56px 1fr auto;
  gap: 1rem; align-items: center;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 1rem 1.25rem;
  transition: border-color 0.15s;
}
.activity-card:hover { border-color: var(--border2); }
.act-date { text-align: center; }
.act-day { font-family: var(--font-display); font-size: 1.75rem; line-height: 1; color: var(--blue-light); }
.act-month { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.act-name { font-family: var(--font-cond); font-weight: 700; font-size: 1rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--white); margin-bottom: 0.25rem; }
.act-meta { font-size: 0.8rem; color: var(--steel); display: flex; gap: 1rem; flex-wrap: wrap; }

@media (max-width: 480px) {
  .activity-card { grid-template-columns: 48px 1fr; grid-template-rows: auto auto; }
  .activity-card .badge { grid-column: 2; justify-self: start; margin-top: 0.25rem; }
}
</style>
