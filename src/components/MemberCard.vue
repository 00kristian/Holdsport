<template>
  <div class="member-card">
    <div class="avatar">
      <img v-if="image" :src="image" :alt="name" />
      <span v-else>{{ emoji }}</span>
    </div>
    <div class="member-name">{{ name }}</div>
    <div class="member-role">{{ role }}</div>
  </div>
</template>

<script setup>
defineProps({
  name:  { type: String,  required: true },
  role:  { type: String,  required: true },
  image: { type: String,  default: null },
  emoji: { type: String,  default: '🏒' },
})
</script>

<style scoped>
.member-card {
  background: var(--navy2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 1.25rem 1rem;
  text-align: center; transition: border-color 0.15s, transform 0.15s;
}
.member-card:hover { border-color: var(--border2); transform: translateY(-2px); }
.avatar {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--border2); margin: 0 auto 0.75rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; border: 2px solid var(--border2);
  overflow: hidden;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-name {
  font-family: var(--font-cond); font-weight: 700;
  font-size: 0.95rem; letter-spacing: 0.03em;
  color: var(--white); margin-bottom: 0.2rem;
}
.member-role {
  font-size: 0.72rem; color: var(--blue-light);
  text-transform: uppercase; letter-spacing: 0.08em;
}
</style>
