import { createI18n } from 'vue-i18n'
import uz from '../../messages/uz.json'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'

export type Locale = 'uz' | 'ru' | 'en'

export const defaultLocale: Locale = 'uz'

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'uz',
  messages: {
    uz,
    ru,
    en,
  },
})
