/**
 * localStorage kalitlari — yagona manba.
 *
 * Format: `si:<domain>`
 *
 * Versiya KALITDA emas, QIYMAT ichida saqlanadi (`{ v, data }`).
 * Sabab: kalitda bo'lsa, migratsiya "eski kalitni o'qib, yangisiga yozish"ga
 * aylanadi va eski yozuvlar axlat bo'lib qoladi. Qiymat ichida bo'lsa —
 * bitta kalit, toza migratsiya zanjiri.
 */

export const STORAGE_PREFIX = "si";

export const STORAGE_KEYS = {
  /** Interfeys sozlamalari: til, rang ko'rligi, mavzu, shrift o'lchami. */
  settings: `${STORAGE_PREFIX}:settings`,
  /** Dars/kitob/test progressi. (Keyingi bosqichda) */
  progress: `${STORAGE_PREFIX}:progress`,
  /** Audio/video ijro pozitsiyalari. (Keyingi bosqichda) */
  media: `${STORAGE_PREFIX}:media`,
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** Barcha Smart Inclusive kalitlarini o'chirish (sozlamalarni tiklash uchun). */
export function clearAllAppStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(window.localStorage);
    for (const key of keys) {
      if (key.startsWith(`${STORAGE_PREFIX}:`)) {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    /* jimgina o'tkazamiz */
  }
}
