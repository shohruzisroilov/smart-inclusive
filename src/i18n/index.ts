import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import uz from '../../messages/uz.json'
import ru from '../../messages/ru.json'
import en from '../../messages/en.json'
import { STORAGE_KEYS } from '@/lib/storage/keys'

export type Locale = 'uz' | 'ru' | 'en'

export const defaultLocale: Locale = 'uz'

export const LOCALES: readonly Locale[] = ['uz', 'ru', 'en']

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Saqlangan til (TZ 2.1: «Tanlov brauzerda saqlanadi va keyingi tashriflarda
 * avtomatik qo'llaniladi»).
 *
 * DIQQAT: bu YAGONA MANBA emas. Til haqiqatda URL'da yashaydi (`/ru/books`) —
 * aks holda bir xil havola har xil odamda har xil tilda ochilardi. localStorage
 * faqat ZAXIRA: manzilda til ko'rsatilmagan holatda (masalan odam to'g'ridan
 * to'g'ri `/` ga kirganda) qaysi tilni ko'rsatishni hal qiladi.
 */
function loadLocale(): Locale {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.language)
    return isLocale(saved) ? saved : defaultLocale
  } catch {
    return defaultLocale
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: loadLocale(),
  fallbackLocale: defaultLocale,
  messages: {
    uz,
    ru,
    en,
  },
})

// Til qayerda o'zgarishidan qat'i nazar (header tugmasi yoki URL) saqlanadi.
watch(
  i18n.global.locale,
  (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.language, value)
    } catch {
      /* kvota to'lgan yoki private rejim — til shu sessiyada ishlayveradi */
    }
  },
  { immediate: true },
)
