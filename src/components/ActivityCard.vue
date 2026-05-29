<template>
  <div class="activity-card">
    <div class="act-date">
      <div class="act-day">{{ day }}</div>
      <div class="act-month">{{ month }}</div>
    </div>
    <div class="act-info">
      <div class="act-name">{{ activity.name || 'Aktivitet' }}</div>
      <div class="act-meta">
        <span v-if="time">🕐 {{ time }}</span>
        <span v-if="activity.place">📍 {{ activity.place }}</span>
        <span v-if="activity.users_attending != null">👥 {{ activity.users_attending }}</span>
      </div>
    </div>
    <span :class="['badge', badgeClass]">{{ badgeLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  activity: { type: Object, required: true },
})

const { t, messages, locale } = useI18n()

const date  = computed(() => new Date(props.activity.starttime || props.activity.start_time || props.activity.date))
const day   = computed(() => date.value.getDate())
const month = computed(() => messages.value[locale.value].activity.months[date.value.getMonth()])
const time  = computed(() => date.value.toLocaleTimeString(locale.value === 'da' ? 'da-DK' : 'en-GB', { hour: '2-digit', minute: '2-digit' }))

const status = computed(() => props.activity.users_status || props.activity.attending_status || '')
const badgeClass = computed(() => {
  if (status.value === 'attending'  || status.value === 1) return 'badge badge-green'
  if (status.value === 'declined'   || status.value === 2) return 'badge badge-red'
  if (status.value === 'pending'    || status.value === 0) return 'badge badge-yellow'
  return 'badge badge-muted'
})
const badgeLabel = computed(() => {
  if (status.value === 'attending'  || status.value === 1) return t('activity.attending')
  if (status.value === 'declined'   || status.value === 2) return t('activity.declined')
  if (status.value === 'pending'    || status.value === 0) return t('activity.pending')
  return '–'
})
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
.badge-red { background: #2a0a0a; color: #e05060; border: 1px solid #4a1020; }
</style>
