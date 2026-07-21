/**
 * SSR-xavfsiz localStorage adapteri.
 *
 * Nima uchun kerak:
 *  - Server'da `window` yo'q → to'g'ridan-to'g'ri murojaat crash beradi.
 *  - Safari "Private Mode" va ba'zi korporativ siyosatlarda localStorage
 *    mavjud, lekin yozishga urinish EXCEPTION tashlaydi.
 *  - Kvota (~5MB) to'lganda `QuotaExceededError` chiqadi.
 *
 * Bu qatlam hamma holatni yutadi va hech qachon crash bermaydi.
 * localStorage ishlamasa — xotiradagi zaxira ishlatiladi (sessiya davomida
 * ilova ishlaydi, faqat qayta yuklashdan keyin saqlanmaydi).
 */

export interface SafeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): boolean;
  removeItem(key: string): void;
  /** localStorage haqiqatan ishlayaptimi (yo'qsa — xotira zaxirasi). */
  readonly isPersistent: boolean;
}

/** localStorage mavjud VA yozish mumkinligini bir marta tekshiramiz. */
function detectLocalStorage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__si_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function createMemoryStorage(): SafeStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
      return true;
    },
    removeItem: (key) => {
      map.delete(key);
    },
    isPersistent: false,
  };
}

function createLocalStorage(): SafeStorage {
  return {
    getItem: (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem: (key, value) => {
      try {
        window.localStorage.setItem(key, value);
        return true;
      } catch (error) {
        // Kvota to'lgan bo'lishi mumkin. Ilovani to'xtatmaymiz —
        // foydalanuvchi ishini davom ettira olsin.
        if (process.env.NODE_ENV !== "production") {
          console.warn("[storage] yozib bo'lmadi:", key, error);
        }
        return false;
      }
    },
    removeItem: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* jimgina o'tkazamiz */
      }
    },
    isPersistent: true,
  };
}

let cached: SafeStorage | null = null;

/**
 * Storage nusxasini qaytaradi.
 *
 * MUHIM: server'da har doim xotira zaxirasi qaytadi. Shuning uchun
 * server render natijasi HECH QACHON saqlangan qiymatga bog'liq bo'lmasligi
 * kerak — aks holda hydration mismatch chiqadi. `useHydrated()` ga qarang.
 */
export function getStorage(): SafeStorage {
  if (cached) return cached;
  cached = detectLocalStorage() ? createLocalStorage() : createMemoryStorage();
  return cached;
}

/** Faqat testlar uchun — keshni tozalaydi. */
export function resetStorageCache(): void {
  cached = null;
}
