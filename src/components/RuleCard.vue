<template>
  <li class="rule-item">
    <div class="rule-num">{{ String(number).padStart(2, '0') }}</div>
    <div class="rule-text">
      <strong>{{ title }}</strong>
      {{ description }}
    </div>
  </li>
</template>

<script setup>
defineProps({
  number:      { type: Number, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<style scoped>
.rule-item {
  display: flex; gap: 1.25rem;
  padding: 1rem 1.25rem; margin-bottom: 0.5rem;
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); align-items: flex-start;
  list-style: none; transition: border-color 0.15s;
}
.rule-item:hover { border-color: var(--border2); }
.rule-num {
  font-family: var(--font-display);
  font-size: 1.4rem; color: var(--blue);
  min-width: 2.2rem; line-height: 1.2; opacity: 0.8;
  flex-shrink: 0;
}
.rule-text { font-size: 0.9rem; line-height: 1.6; color: var(--steel); }
.rule-text strong {
  font-family: var(--font-cond);
  font-size: 1rem; font-weight: 700;
  letter-spacing: 0.03em; text-transform: uppercase;
  color: var(--white); display: block; margin-bottom: 0.2rem;
}
</style>
