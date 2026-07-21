/**
 * Global interfeys sozlamalari tiplari.
 *
 * DIQQAT: interfeys TILI bu yerda YO'Q.
 * Til URL'da (`/uz/...`) va next-intl cookie'sida saqlanadi — u yagona manba.
 * Ikkinchi nusxani store'da saqlash desinxronizatsiyaga olib keladi.
 */

export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

/** Shrift kattalashtirish koeffitsienti (WCAG 1.4.4 — 200% gacha). */
export const FONT_SCALES = [1, 1.125, 1.25, 1.5] as const;
export type FontScale = (typeof FONT_SCALES)[number];

export interface AppSettings {
  theme: ThemeMode;
  fontScale: FontScale;
  /** `null` = tizim sozlamasiga ergashadi. */
  reducedMotion: boolean | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  // Standart — yorug' rejim. Foydalanuvchi xohlasa "system"/"dark" ga o'tkaza oladi.
  theme: "light",
  fontScale: 1,
  reducedMotion: null,
};

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === "string" && (THEME_MODES as readonly string[]).includes(value)
  );
}

export function isFontScale(value: unknown): value is FontScale {
  return typeof value === "number" && (FONT_SCALES as readonly number[]).includes(value);
}
