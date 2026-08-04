/**
 * localStorage kalitlari — yagona manba.
 *
 * Format: `si:<domain>`
 *
 * Versiya KALITDA emas, QIYMAT ichida saqlanadi (`{ version, state }`).
 * Sabab: kalitda bo'lsa, migratsiya "eski kalitni o'qib, yangisiga yozish"ga
 * aylanadi va eski yozuvlar axlat bo'lib qoladi. Qiymat ichida bo'lsa —
 * bitta kalit, toza migratsiya zanjiri.
 */

export const STORAGE_PREFIX = 'si'

export const STORAGE_KEYS = {
  /** Interfeys sozlamalari: mavzu, shrift o'lchami, disleksiya rejimi. */
  settings: `${STORAGE_PREFIX}:settings`,
  /**
   * Interfeys tili va rang ko'rligi rejimi — TZ 13.5 da nomlari aniq
   * belgilangan, shuning uchun umumiy `si:settings` obyektiga qo'shilmay,
   * alohida kalitlarda saqlanadi.
   */
  language: 'si_language',
  colorblindMode: 'si_colorblind_mode',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * SOZLAMALARNI tiklash.
 *
 * Progress kalitlari (`si_progress_viewed`, `si_bookmarks`, `si_test_results`)
 * ataylab tegilmaydi: xatcho'p va test natijalari sozlama emas, foydalanuvchi
 * mehnati — mavzuni tiklash ularni yo'q qilmasligi kerak.
 */
export function clearAllAppStorage(): void {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(`${STORAGE_PREFIX}:`)) {
        window.localStorage.removeItem(key)
      }
    }
    window.localStorage.removeItem(STORAGE_KEYS.language)
    window.localStorage.removeItem(STORAGE_KEYS.colorblindMode)
  } catch {
    /* jimgina o'tkazamiz */
  }
}
