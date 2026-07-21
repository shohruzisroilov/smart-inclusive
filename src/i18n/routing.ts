import { defineRouting } from "next-intl/routing";

/**
 * Interfeys tillari.
 *
 * MUHIM: bu ro'yxat FAQAT interfeys (UI) tilini bildiradi.
 * Kontent tili (dars, kitob, maqola tili) undan mustaqil va
 * `src/lib/content-language` qatlamida boshqariladi.
 */
export const LOCALES = ["uz", "ru", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "uz";

/** `<html lang>` va `Accept-Language` uchun to'liq BCP-47 teglari. */
export const LOCALE_HTML_LANG: Record<Locale, string> = {
  uz: "uz-Latn-UZ",
  ru: "ru-RU",
  en: "en-US",
};

/** Til almashtirgichda ko'rsatiladigan nomlar — har biri o'z tilida. */
export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

/** Ixcham ko'rinish uchun (masalan mobil menyuda). */
export const LOCALE_SHORT_LABELS: Record<Locale, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // Har doim prefiks: /uz, /ru, /en.
  // Bu canonical URL'larni bir xil qiladi va SEO'da dublikatning oldini oladi.
  localePrefix: "always",
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
