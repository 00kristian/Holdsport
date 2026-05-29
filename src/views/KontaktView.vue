<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>KONTAKT</h1>
      <p>Find de rette at kontakte.</p>
    </div>

    <div class="contact-grid">
      <div v-for="person in contacts" :key="person.name" class="contact-card">
        <h3>{{ person.name }}</h3>
        <div class="contact-role">{{ person.role }}</div>
        <div class="contact-line">📱 <a :href="`tel:${person.phone}`">{{ person.phone }}</a></div>
        <div class="contact-line">✉️ <a :href="`mailto:${person.email}`">{{ person.email }}</a></div>
      </div>
    </div>

    <div class="info-box" style="margin-top: 2.5rem">
      <div class="label">Info</div>
      <p>Brug primært Holdsport-appen til daglig kommunikation. For praktiske spørgsmål — skriv til holdlederen.</p>
    </div>
  </main>
</template>

<script setup>
const contacts = [
  { name: 'William Nistrup', role: 'Cheftræner',                             phone: '41424242',               email: 'william.nistrup@gmail.com' },
  { name: 'Kristian Berlin', role: 'Assistenttræner / Holdleder / Admin',    phone: '28299303',               email: 'kristianberlin1@hotmail.dk' },
  { name: 'Oscar Pino',      role: 'Assistenttræner / Senior ansvarlig',     phone: '25480117',               email: 'oscarpino@hotmail.dk' },
]
</script>

<style scoped>
.contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
.contact-card { background: var(--navy2); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; }
.contact-card h3 { font-family: var(--font-cond); font-size: 1.1rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--white); margin-bottom: 0.2rem; }
.contact-role { font-size: 0.75rem; color: var(--blue-light); text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 1rem; }
.contact-line { display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: var(--steel); margin-top: 0.4rem; }
.contact-line a { color: var(--blue-light); text-decoration: none; }
.contact-line a:hover { text-decoration: underline; }
</style>
