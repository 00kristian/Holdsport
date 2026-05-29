<template>
  <main class="container page-wrap">
    <div class="page-header">
      <div class="accent-line"><span></span></div>
      <h1>{{ t('newPlayer.title') }}</h1>
      <p>{{ t('newPlayer.subtitle') }}</p>
    </div>

    <div class="info-box" style="margin-bottom: 2rem">
      <div class="label">🏒 Tip</div>
      <p>{{ t('newPlayer.tip') }}</p>
    </div>

    <!-- Steps -->
    <div class="steps">
      <div v-for="(step, i) in steps" :key="step.title" class="step">
        <div class="step-num-wrap">
          <div class="step-num">{{ i + 1 }}</div>
        </div>
        <div class="step-body">
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
          <RouterLink v-if="step.linkLabel" :to="step.linkTo" class="btn btn-ghost step-btn">
            {{ step.linkLabel }} →
          </RouterLink>
          <span v-if="step.chip" class="chip">{{ step.chip }}</span>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <h2 class="faq-heading">{{ t('newPlayer.faqHeading') }}</h2>
    <div class="faq">
      <div v-for="item in faq" :key="item.q" class="faq-item">
        <div class="faq-q">{{ item.q }}</div>
        <div class="faq-a">{{ item.a }}</div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, messages, locale } = useI18n()

const steps = computed(() => messages.value[locale.value].newPlayer.steps)
const faq   = computed(() => messages.value[locale.value].newPlayer.faq)
</script>

<style scoped>
.steps { margin-top: 2rem; }
.step { display: grid; grid-template-columns: 64px 1fr; gap: 1.5rem; padding: 1.75rem 0; border-bottom: 1px solid var(--border); }
.step:last-child { border-bottom: none; }
.step-num-wrap { display: flex; flex-direction: column; align-items: center; padding-top: 4px; }
.step-num { font-family: var(--font-display); font-size: 1.8rem; color: var(--blue-light); line-height: 1; background: var(--border2); width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--blue); }
.step-body h3 { font-family: var(--font-cond); font-size: 1.25rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 0.4rem; color: var(--white-pure); }
.step-body p { color: var(--steel); font-size: 0.9rem; line-height: 1.65; }
.step-btn { margin-top: 0.75rem; font-size: 0.82rem; padding: 0.5rem 1.25rem; }
.chip { display: inline-block; margin-top: 0.75rem; background: var(--border2); border: 1px solid var(--border2); border-radius: 99px; padding: 0.25rem 0.8rem; font-family: var(--font-cond); font-size: 0.78rem; color: var(--blue-light); letter-spacing: 0.06em; }

.faq-heading { font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.06em; margin: 3rem 0 1.25rem; color: var(--white-pure); }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q { padding: 1rem 0; font-family: var(--font-cond); font-size: 1rem; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--white); display: flex; justify-content: space-between; align-items: center; }
.faq-q::after { content: '+'; color: var(--blue-light); font-size: 1.3rem; font-family: monospace; }
.faq-a { padding: 0 0 1rem; font-size: 0.9rem; color: var(--steel); line-height: 1.65; }
</style>
