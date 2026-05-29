<template>
  <footer class="footer">
    <div class="container">
      HOLDET · {{ new Date().getFullYear() }}
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--navy2);
  border-top: 1px solid var(--border);
  padding: 1.5rem 2rem;
  text-align: center;
  font-family: var(--font-cond);
  font-size: 0.8rem; letter-spacing: 0.08em;
  color: var(--muted); text-transform: uppercase;
}
</style>
