<template>
  <nav class="nav">
    <div class="nav-inner">

      <RouterLink to="/" class="logo" @click="menuOpen = false">
        🏒 KSF<em> 2.Div</em>
      </RouterLink>

      <!-- Desktop nav links -->
      <ul class="nav-links">
        <li><RouterLink to="/">{{ t('nav.home') }}</RouterLink></li>
        <li><RouterLink to="/ny-spiller">{{ t('nav.newPlayer') }}</RouterLink></li>

        <li class="dropdown" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
          <RouterLink to="/regler" class="dropdown-trigger">
            {{ t('nav.rules') }} <span class="arrow">▾</span>
          </RouterLink>
          <Transition name="dropdown-fade">
            <div v-show="dropdownOpen" class="dropdown-menu">
              <RouterLink to="/regler" @click="setReglerTab('generelle'); dropdownOpen = false">
                {{ t('nav.generalRules') }}
              </RouterLink>
              <RouterLink to="/regler" @click="setReglerTab('burger'); dropdownOpen = false">
                {{ t('nav.burgerCupRules') }}
              </RouterLink>
            </div>
          </Transition>
        </li>

        <li><RouterLink to="/holdet">{{ t('nav.team') }}</RouterLink></li>
        <li><RouterLink to="/kontakt">{{ t('nav.contact') }}</RouterLink></li>
        <li><RouterLink to="/program">{{ t('nav.schedule') }}</RouterLink></li>
        <li><RouterLink to="/burger-cup">{{ t('nav.burgerCup') }}</RouterLink></li>
        <li><RouterLink to="/fremmoede">{{ t('nav.leaderboard') }}</RouterLink></li>
      </ul>

      <!-- Right side: lang switcher + hamburger -->
      <div class="nav-right">
        <div class="lang-switcher">
          <button :class="['lang-btn', { active: locale === 'da' }]" @click="setLocale('da')" title="Dansk">🇩🇰</button>
          <button :class="['lang-btn', { active: locale === 'en' }]" @click="setLocale('en')" title="English">🇬🇧</button>
        </div>
        <button class="hamburger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-slide">
      <div v-show="menuOpen" class="mobile-menu">
        <ul class="mobile-links">
          <li><RouterLink to="/"           @click="menuOpen = false">{{ t('nav.home') }}</RouterLink></li>
          <li><RouterLink to="/ny-spiller" @click="menuOpen = false">{{ t('nav.newPlayer') }}</RouterLink></li>
          <li class="mobile-sub-label">{{ t('nav.rules') }}</li>
          <li class="mobile-sub"><RouterLink to="/regler" @click="setReglerTab('generelle'); menuOpen = false">{{ t('nav.generalRules') }}</RouterLink></li>
          <li class="mobile-sub"><RouterLink to="/regler" @click="setReglerTab('burger'); menuOpen = false">{{ t('nav.burgerCupRules') }}</RouterLink></li>
          <li><RouterLink to="/holdet"  @click="menuOpen = false">{{ t('nav.team') }}</RouterLink></li>
          <li><RouterLink to="/kontakt" @click="menuOpen = false">{{ t('nav.contact') }}</RouterLink></li>
          <li><RouterLink to="/program" @click="menuOpen = false">{{ t('nav.schedule') }}</RouterLink></li>
          <li><RouterLink to="/burger-cup" @click="menuOpen = false">{{ t('nav.burgerCup') }}</RouterLink></li>
          <li><RouterLink to="/fremmoede" @click="menuOpen = false">{{ t('nav.leaderboard') }}</RouterLink></li>
        </ul>
        <div class="mobile-lang">
          <button :class="['mobile-lang-btn', { active: locale === 'da' }]" @click="setLocale('da'); menuOpen = false">🇩🇰 Dansk</button>
          <button :class="['mobile-lang-btn', { active: locale === 'en' }]" @click="setLocale('en'); menuOpen = false">🇬🇧 English</button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReglerStore } from '../stores/regler.js'

const { t, locale } = useI18n()
const dropdownOpen = ref(false)
const menuOpen     = ref(false)
const reglerStore  = useReglerStore()

function setReglerTab(tab) { reglerStore.activeTab = tab }
function setLocale(lang)   { locale.value = lang; localStorage.setItem('lang', lang) }
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
  padding: 0 1.5rem; height: 58px;
}
.logo {
  font-family: var(--font-display);
  font-size: 1.5rem; letter-spacing: 0.1em;
  color: var(--white-pure); text-decoration: none; flex-shrink: 0;
}
.logo em { color: var(--blue-light); font-style: normal; }

/* Desktop nav */
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

.dropdown { position: relative; }
.dropdown-menu {
  position: absolute; top: calc(100% + 6px); left: 0;
  background: var(--navy2); border: 1px solid var(--border2);
  border-top: 2px solid var(--blue);
  border-radius: 0 0 var(--radius) var(--radius);
  padding: 0.35rem; min-width: 210px;
  box-shadow: 0 12px 40px #00000080;
}
.dropdown-menu a { display: block; padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); font-size: 0.88rem; background: none !important; }
.dropdown-menu a:hover { background: var(--border) !important; }

.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.dropdown-fade-enter-from { opacity: 0; transform: translateY(-4px); }
.dropdown-fade-leave-to   { opacity: 0; }

/* Right side */
.nav-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

/* Lang switcher */
.lang-switcher { display: flex; gap: 0.25rem; }
.lang-btn {
  background: none; border: 1px solid transparent;
  border-radius: var(--radius-sm); padding: 0.2rem 0.4rem;
  font-size: 1.2rem; cursor: pointer; line-height: 1;
  opacity: 0.45; transition: opacity 0.15s, border-color 0.15s;
}
.lang-btn:hover { opacity: 0.8; }
.lang-btn.active { opacity: 1; border-color: var(--border2); }

/* Hamburger — hidden on desktop */
.hamburger {
  display: none;
  flex-direction: column; justify-content: center; align-items: center;
  gap: 5px; width: 36px; height: 36px;
  background: none; border: none; cursor: pointer; padding: 4px;
  border-radius: var(--radius-sm);
}
.hamburger span {
  display: block; width: 22px; height: 2px;
  background: var(--steel); border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  background: var(--navy2);
  border-top: 1px solid var(--border);
  border-bottom: 2px solid var(--blue);
  padding: 0.75rem 1.5rem 1.25rem;
}
.mobile-links { list-style: none; }
.mobile-links li { border-bottom: 1px solid var(--border); }
.mobile-links li:last-child { border-bottom: none; }
.mobile-links a {
  display: block; padding: 0.85rem 0;
  font-family: var(--font-cond); font-size: 1rem; font-weight: 600;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--steel); text-decoration: none;
}
.mobile-links a:hover, .mobile-links a.router-link-active { color: var(--white-pure); }
.mobile-sub-label {
  padding: 0.7rem 0 0.2rem;
  font-family: var(--font-cond); font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted);
}
.mobile-sub a { padding-left: 0.75rem; font-size: 0.9rem; color: var(--muted); }
.mobile-sub a:hover { color: var(--white); }

.mobile-lang { display: flex; gap: 0.75rem; margin-top: 1rem; }
.mobile-lang-btn {
  flex: 1; background: var(--border); border: 1px solid var(--border2);
  border-radius: var(--radius-sm); padding: 0.6rem; cursor: pointer;
  font-family: var(--font-cond); font-size: 0.85rem; font-weight: 600;
  letter-spacing: 0.06em; color: var(--steel);
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
}
.mobile-lang-btn.active { border-color: var(--blue); color: var(--white-pure); background: var(--border2); }

.mobile-slide-enter-active, .mobile-slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.mobile-slide-enter-from { opacity: 0; transform: translateY(-8px); }
.mobile-slide-leave-to   { opacity: 0; }

/* Responsive breakpoint */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .lang-switcher { display: none; } /* shown in mobile menu instead */
}
</style>
