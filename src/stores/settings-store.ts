"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS, zustandStorage } from "@/lib/storage";
import {
  DEFAULT_SETTINGS,
  isFontScale,
  isThemeMode,
  type AppSettings,
  type FontScale,
  type ThemeMode,
} from "@/types/settings";

/** Schema versiyasi. Struktura o'zgarganda oshiriladi + `migrate` yoziladi. */
export const SETTINGS_VERSION = 1;

interface SettingsActions {
  setTheme: (theme: ThemeMode) => void;
  setFontScale: (scale: FontScale) => void;
  setReducedMotion: (value: boolean | null) => void;
  setDyslexicFont: (value: boolean) => void;
  reset: () => void;
}

export type SettingsStore = AppSettings & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setDyslexicFont: (dyslexicFont) => set({ dyslexicFont }),
      reset: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: STORAGE_KEYS.settings,
      version: SETTINGS_VERSION,
      storage: createJSONStorage(() => zustandStorage),

      // Faqat ma'lumot saqlanadi, funksiyalar emas.
      partialize: (state): AppSettings => ({
        theme: state.theme,
        fontScale: state.fontScale,
        reducedMotion: state.reducedMotion,
        dyslexicFont: state.dyslexicFont,
      }),

      /**
       * Eski versiyadan o'tkazish.
       * Hozircha v1 — migratsiya yo'q, lekin zanjir shu yerda o'sadi.
       */
      migrate: (persisted, fromVersion) => {
        if (fromVersion === SETTINGS_VERSION) return persisted as AppSettings;
        // Noma'lum eski versiya — xavfsiz standart holatga qaytamiz.
        return { ...DEFAULT_SETTINGS };
      },

      /**
       * Qo'lda tahrirlangan yoki buzilgan localStorage'dan himoya.
       * Har bir maydon alohida tekshiriladi; yaroqsizi standartga tushadi.
       */
      merge: (persisted, current) => {
        const incoming = (persisted ?? {}) as Partial<AppSettings>;
        return {
          ...current,
          theme: isThemeMode(incoming.theme) ? incoming.theme : DEFAULT_SETTINGS.theme,
          fontScale: isFontScale(incoming.fontScale)
            ? incoming.fontScale
            : DEFAULT_SETTINGS.fontScale,
          reducedMotion:
            typeof incoming.reducedMotion === "boolean" || incoming.reducedMotion === null
              ? incoming.reducedMotion
              : DEFAULT_SETTINGS.reducedMotion,
          dyslexicFont:
            typeof incoming.dyslexicFont === "boolean"
              ? incoming.dyslexicFont
              : DEFAULT_SETTINGS.dyslexicFont,
        };
      },
    },
  ),
);

/** Selector'lar — keraksiz re-render'ning oldini oladi. */
export const selectTheme = (s: SettingsStore) => s.theme;
export const selectFontScale = (s: SettingsStore) => s.fontScale;
export const selectReducedMotion = (s: SettingsStore) => s.reducedMotion;
export const selectDyslexicFont = (s: SettingsStore) => s.dyslexicFont;
