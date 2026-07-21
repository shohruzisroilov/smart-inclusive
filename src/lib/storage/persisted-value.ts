import { getStorage } from "./safe-storage";

/**
 * Versiyalangan, tipli, buzilishga chidamli localStorage qiymati.
 *
 * Har bir yozuv "konvert" ichida saqlanadi:
 *
 *     { "v": 2, "data": { ... } }
 *
 * Bu bizga ikkita imkon beradi:
 *  1. Struktura o'zgarganda migratsiya qilish (foydalanuvchi progressi yo'qolmaydi).
 *  2. Buzilgan/eskirgan yozuvni aniqlab, fallback'ga tushish.
 *
 * Zustand store'lari `persist` middleware'ining o'z versiyalashini ishlatadi;
 * bu helper store'ga bog'liq bo'lmagan ma'lumotlar uchun.
 */

interface Envelope<T> {
  v: number;
  data: T;
}

export interface PersistedValueOptions<T> {
  /** `STORAGE_KEYS` dan olinadi. */
  key: string;
  /** Joriy schema versiyasi. Struktura o'zgarsa — oshiriladi. */
  version: number;
  /** Hech narsa saqlanmagan yoki o'qib bo'lmaganda qaytadigan qiymat. */
  fallback: T;
  /**
   * Eski versiyadan joriy versiyaga o'tkazish.
   * `null` qaytarsa — migratsiya imkonsiz, fallback ishlatiladi.
   */
  migrate?: (data: unknown, fromVersion: number) => T | null;
  /**
   * O'qilgan ma'lumot kutilgan shaklga mos ekanini tekshirish.
   * Qo'lda yozilgan guard yoki zod `safeParse` bo'lishi mumkin.
   */
  validate?: (data: unknown) => data is T;
}

export interface PersistedValue<T> {
  read(): T;
  write(value: T): boolean;
  remove(): void;
  /** Boshqa tabdagi o'zgarishni kuzatish. Tozalash funksiyasini qaytaradi. */
  subscribe(onChange: (value: T) => void): () => void;
}

function isEnvelope(value: unknown): value is Envelope<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "v" in value &&
    typeof (value as Envelope<unknown>).v === "number" &&
    "data" in value
  );
}

export function createPersistedValue<T>(
  options: PersistedValueOptions<T>,
): PersistedValue<T> {
  const { key, version, fallback, migrate, validate } = options;

  function parse(raw: string | null): T {
    if (raw === null) return fallback;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Buzilgan yozuv — tozalab, fallback'ga tushamiz.
      getStorage().removeItem(key);
      return fallback;
    }

    if (!isEnvelope(parsed)) {
      getStorage().removeItem(key);
      return fallback;
    }

    let data: unknown = parsed.data;

    if (parsed.v !== version) {
      if (!migrate) return fallback;
      const migrated = migrate(data, parsed.v);
      if (migrated === null) return fallback;
      data = migrated;
    }

    if (validate && !validate(data)) return fallback;

    return data as T;
  }

  return {
    read() {
      return parse(getStorage().getItem(key));
    },

    write(value: T) {
      const envelope: Envelope<T> = { v: version, data: value };
      try {
        return getStorage().setItem(key, JSON.stringify(envelope));
      } catch {
        // JSON.stringify sikl (circular reference) da yiqilishi mumkin.
        return false;
      }
    },

    remove() {
      getStorage().removeItem(key);
    },

    subscribe(onChange) {
      if (typeof window === "undefined") return () => {};

      const handler = (event: StorageEvent) => {
        // `storage` hodisasi FAQAT boshqa tablarda ishga tushadi — bu bizga kerak.
        if (event.key !== key) return;
        onChange(parse(event.newValue));
      };

      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    },
  };
}
