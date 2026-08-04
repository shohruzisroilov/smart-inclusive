import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { STORAGE_KEYS, clearAllAppStorage } from '@/lib/storage/keys'
import {
  DEFAULT_SETTINGS,
  isFontScale,
  isThemeMode,
  type AppSettings,
  type FontScale,
  type ThemeMode,
} from '@/types/settings'

/** Schema versiyasi. Struktura o'zgarganda oshiriladi. */
export const SETTINGS_VERSION = 1

/**
 * localStorage'dan o'qish.
 *
 * Qo'lda tahrirlangan yoki buzilgan qiymatdan himoya: har bir maydon alohida
 * tekshiriladi, yaroqsizi standartga tushadi. Noma'lum versiya — to'liq reset.
 */
function loadSettings(): AppSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings)
    if (!raw) return { ...DEFAULT_SETTINGS }

    const parsed = JSON.parse(raw) as { version?: number; state?: Partial<AppSettings> }
    if (parsed.version !== SETTINGS_VERSION) return { ...DEFAULT_SETTINGS }

    const incoming = parsed.state ?? {}
    return {
      theme: isThemeMode(incoming.theme) ? incoming.theme : DEFAULT_SETTINGS.theme,
      fontScale: isFontScale(incoming.fontScale)
        ? incoming.fontScale
        : DEFAULT_SETTINGS.fontScale,
      reducedMotion:
        typeof incoming.reducedMotion === 'boolean' || incoming.reducedMotion === null
          ? incoming.reducedMotion
          : DEFAULT_SETTINGS.reducedMotion,
      dyslexicFont:
        typeof incoming.dyslexicFont === 'boolean'
          ? incoming.dyslexicFont
          : DEFAULT_SETTINGS.dyslexicFont,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/** `index.html` dagi anti-FOUC skript o'qiydigan formatda yozamiz. */
function saveSettings(state: AppSettings): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.settings,
      JSON.stringify({ version: SETTINGS_VERSION, state }),
    )
  } catch {
    /* kvota to'lgan yoki private rejim — sozlama shu sessiyada ishlayveradi */
  }
}

/**
 * Rang ko'rligi rejimi — TZ 13.5 bo'yicha ALOHIDA kalitda (`si_colorblind_mode`),
 * umumiy sozlamalar obyektida emas.
 */
function loadColorblind(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.colorblindMode) === 'true'
  } catch {
    return false
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const initial = loadSettings()

  const theme = ref<ThemeMode>(initial.theme)
  const fontScale = ref<FontScale>(initial.fontScale)
  const reducedMotion = ref<boolean | null>(initial.reducedMotion)
  const dyslexicFont = ref<boolean>(initial.dyslexicFont)
  const colorblind = ref<boolean>(loadColorblind())

  const darkMedia = window.matchMedia('(prefers-color-scheme: dark)')

  /** Mavzu — `system` bo'lsa OS sozlamasiga qarab hal qilinadi. */
  function applyTheme() {
    const resolved = theme.value === 'system' ? (darkMedia.matches ? 'dark' : 'light') : theme.value
    document.documentElement.setAttribute('data-theme', resolved)
  }

  // "system" tanlangan bo'lsa OS mavzusi o'zgarishiga darhol javob beramiz.
  darkMedia.addEventListener('change', () => {
    if (theme.value === 'system') applyTheme()
  })

  function applyAll() {
    const root = document.documentElement

    applyTheme()
    root.style.setProperty('--font-scale', String(fontScale.value))

    // `null` — tizim sozlamasi hal qiladi (CSS media query orqali).
    if (reducedMotion.value === true) root.setAttribute('data-reduced-motion', 'true')
    else root.removeAttribute('data-reduced-motion')

    if (dyslexicFont.value) root.setAttribute('data-dyslexic', 'true')
    else root.removeAttribute('data-dyslexic')

    // Mavzudan mustaqil qatlam — `tokens.css` dagi 5-bo'limga qarang.
    if (colorblind.value) root.setAttribute('data-colorblind', 'true')
    else root.removeAttribute('data-colorblind')
  }

  watch(colorblind, (on) => {
    applyAll()
    try {
      window.localStorage.setItem(STORAGE_KEYS.colorblindMode, String(on))
    } catch {
      /* kvota to'lgan yoki private rejim — sozlama shu sessiyada ishlayveradi */
    }
  })

  watch([theme, fontScale, reducedMotion, dyslexicFont], () => {
    applyAll()
    saveSettings({
      theme: theme.value,
      fontScale: fontScale.value,
      reducedMotion: reducedMotion.value,
      dyslexicFont: dyslexicFont.value,
    })
  })

  /** Joriy ko'rinish qorong'imi — `system` bo'lsa OS sozlamasiga qaraydi. */
  function isDark(): boolean {
    if (theme.value === 'dark') return true
    if (theme.value === 'light') return false
    if (theme.value === 'system') return darkMedia.matches
    // high-contrast va monochrome — qorong'i deb hisoblanmaydi.
    return false
  }

  function toggleTheme() {
    theme.value = isDark() ? 'light' : 'dark'
  }

  function toggleColorblind() {
    colorblind.value = !colorblind.value
  }

  function reset() {
    clearAllAppStorage()
    theme.value = DEFAULT_SETTINGS.theme
    fontScale.value = DEFAULT_SETTINGS.fontScale
    reducedMotion.value = DEFAULT_SETTINGS.reducedMotion
    dyslexicFont.value = DEFAULT_SETTINGS.dyslexicFont
    colorblind.value = false
  }

  // Anti-FOUC skript sahifa ochilishida allaqachon qo'llagan, lekin u
  // localStorage buzilgan bo'lsa jim o'tib ketadi — bu yerda tasdiqlaymiz.
  applyAll()

  return {
    theme,
    fontScale,
    reducedMotion,
    dyslexicFont,
    colorblind,
    isDark,
    toggleTheme,
    toggleColorblind,
    reset,
  }
})
