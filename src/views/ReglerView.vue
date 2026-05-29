<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('rules.title') }}</h1>
      <p>{{ t('rules.subtitle') }}</p>
    </div>

    <!-- Tab navigation -->
    <div class="rules-tabs">
      <button
        :class="['rtab', { active: reglerStore.activeTab === 'generelle' }]"
        @click="reglerStore.setTab('generelle')"
      >{{ t('rules.tabGeneral') }}</button>
      <button
        :class="['rtab', { active: reglerStore.activeTab === 'burger' }]"
        @click="reglerStore.setTab('burger')"
      >{{ t('rules.tabBurger') }}</button>
    </div>

    <!-- General Rules -->
    <Transition name="fade" mode="out-in">
      <div v-if="reglerStore.activeTab === 'generelle'" key="generelle">
        <ol class="rule-list">
          <RuleCard v-for="(rule, i) in generalRules" :key="rule.title" :number="i + 1" :title="rule.title" :description="rule.description" />
        </ol>
      </div>

      <!-- Burger Cup -->
      <div v-else key="burger">
        <div class="burger-header">
          <div class="burger-icon">🍔</div>
          <div>
            <h3>BURGER CUP</h3>
            <p>{{ t('rules.burgerSubtitle') }}</p>
          </div>
        </div>
        <ol class="rule-list">
          <RuleCard v-for="(rule, i) in burgerRules" :key="rule.title" :number="i + 1" :title="rule.title" :description="rule.description" />
        </ol>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useReglerStore } from '../stores/regler.js'
import RuleCard from '../components/RuleCard.vue'

const { t, messages, locale } = useI18n()
const reglerStore = useReglerStore()

const generalRules = computed(() => messages.value[locale.value].rules.general)
const burgerRules  = computed(() => messages.value[locale.value].rules.burger)
</script>

<style scoped>
.rules-tabs { display: flex; border-bottom: 2px solid var(--border2); margin-bottom: 2.5rem; }
.rtab { font-family: var(--font-cond); font-size: 0.9rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.65rem 1.4rem; cursor: pointer; background: none; border: none; color: var(--muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: color 0.15s, border-color 0.15s; }
.rtab:hover { color: var(--white); }
.rtab.active { color: var(--white-pure); border-bottom-color: var(--blue); }
.rule-list { list-style: none; padding: 0; }
.burger-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; padding: 1.25rem 1.5rem; background: var(--navy2); border: 1px solid var(--border2); border-radius: var(--radius); }
.burger-icon { font-size: 2rem; }
.burger-header h3 { font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.06em; color: var(--white-pure); }
.burger-header p { font-size: 0.84rem; color: var(--steel); }
</style>
