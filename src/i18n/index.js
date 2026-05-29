import { createI18n } from 'vue-i18n'
import da from './da.js'
import en from './en.js'

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'da',
  fallbackLocale: 'da',
  messages: { da, en },
})
