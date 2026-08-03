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
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/** Barcha Smart Inclusive kalitlarini o'chirish (sozlamalarni tiklash uchun). */
export function clearAllAppStorage(): void {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith(`${STORAGE_PREFIX}:`)) {
        window.localStorage.removeItem(key)
      }
    }
  } catch {
    /* jimgina o'tkazamiz */
  }
}
