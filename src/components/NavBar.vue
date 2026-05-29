<template>
  <nav class="nav">
    <div class="nav-inner">

      <RouterLink to="/" class="logo">
        🏒 HOLDET<em>.</em>
      </RouterLink>

      <ul class="nav-links">
        <li><RouterLink to="/">Forside</RouterLink></li>
        <li><RouterLink to="/ny-spiller">Ny Spiller</RouterLink></li>

        <!-- Regler dropdown -->
        <li class="dropdown" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
          <RouterLink to="/regler" class="dropdown-trigger">
            Regler <span class="arrow">▾</span>
          </RouterLink>
          <Transition name="dropdown-fade">
            <div v-show="dropdownOpen" class="dropdown-menu">
              <RouterLink to="/regler" @click="setReglerTab('generelle'); dropdownOpen = false">
                Generelle Regler
              </RouterLink>
              <RouterLink to="/regler" @click="setReglerTab('burger'); dropdownOpen = false">
                🍔 Burger Cup Regler
              </RouterLink>
            </div>
          </Transition>
        </li>

        <li><RouterLink to="/holdet">Holdet</RouterLink></li>
        <li><RouterLink to="/kontakt">Kontakt</RouterLink></li>
        <li><RouterLink to="/program">Program</RouterLink></li>
      </ul>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useReglerStore } from '../stores/regler.js'

const dropdownOpen = ref(false)
const reglerStore  = useReglerStore()

function setReglerTab(tab) {
  reglerStore.activeTab = tab
}
</script>

<style scoped>
.nav {
  position: sticky; top: 0; z-index: 100;
  background: var(--navy2);
  border-bottom: 2px solid var(--blue);
}
.nav-inner {
  max-width: var(--max-width); margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; height: 58px;
}
.logo {
  font-family: var(--font-display);
  font-size: 1.5rem; letter-spacing: 0.1em;
  color: var(--white-pure); text-decoration: none;
}
.logo em { color: var(--blue-light); font-style: normal; }

.nav-links { list-style: none; display: flex; align-items: center; gap: 0; }
.nav-links a, .dropdown-trigger {
  font-family: var(--font-cond);
  font-size: 0.92rem; font-weight: 600;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--steel); text-decoration: none;
  padding: 0.45rem 0.9rem; border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
  white-space: nowrap; display: flex; align-items: center; gap: 0.3rem;
  cursor: pointer;
}
.nav-links a:hover, .dropdown-trigger:hover { color: var(--white); background: var(--border2); }
.nav-links a.router-link-active { color: var(--white-pure); }

.arrow { font-size: 0.65rem; opacity: 0.6; }

/* Dropdown */
.dropdown { position: relative; }
.dropdown-menu {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: var(--navy2); border: 1px solid var(--border2);
  border-top: 2px solid var(--blue);
  border-radius: 0 0 var(--radius) var(--radius);
  padding: 0.35rem; min-width: 210px;
  box-shadow: 0 12px 40px #00000080;
}
.dropdown-menu a {
  display: block; padding: 0.55rem 0.75rem;
  border-radius: var(--radius-sm); font-size: 0.88rem;
  background: none !important;
}
.dropdown-menu a:hover { background: var(--border) !important; }

/* Dropdown transition */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-fade-enter-from { opacity: 0; transform: translateY(-4px); }
.dropdown-fade-leave-to   { opacity: 0; }

@media (max-width: 640px) {
  .nav-links a, .dropdown-trigger { font-size: 0.78rem; padding: 0.4rem 0.5rem; }
}
</style>
