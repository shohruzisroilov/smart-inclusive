"use client";

import { useSyncExternalStore } from "react";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Komponent brauzerda hydrate bo'lganini bildiradi.
 *
 * NIMA UCHUN KERAK — bu loyihaning eng ko'p bug beradigan nuqtasi:
 *
 *   Server localStorage'ni ko'rmaydi → "0% bajarilgan" deb render qiladi.
 *   Client localStorage'ni ko'radi   → "60% bajarilgan" deb hydrate qiladi.
 *   React: "Hydration failed" xatosi.
 *
 * QOIDA: localStorage'ga bog'liq HAR QANDAY UI shu hook orqali himoyalanadi.
 *
 *   const hydrated = useHydrated();
 *   if (!hydrated) return <ProgressSkeleton />;
 *   return <Progress value={progress} />;
 *
 * IMPLEMENTATSIYA: `useEffect` + `setState` emas, `useSyncExternalStore`.
 * Sabab — `getServerSnapshot` server'da `false`, `getSnapshot` client'da
 * `true` qaytaradi. Bu React'ning hydration uchun rasmiy mexanizmi:
 * kaskadli qayta render bo'lmaydi va React 19 lint qoidasi buzilmaydi.
 */

/** Hech qachon o'zgarmaydigan manba — obuna kerak emas. */
const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );
}

/**
 * Sozlamalar store'i localStorage'dan o'qib bo'lganini bildiradi.
 *
 * `useHydrated` dan farqi: bu zustand `persist` middleware'ining haqiqiy
 * holatini kuzatadi, ya'ni qiymatlar allaqachon saqlangan holatdan kelgan.
 */
const subscribeToSettingsHydration = (onChange: () => void) =>
  useSettingsStore.persist.onFinishHydration(onChange);

const getSettingsHydrated = () => useSettingsStore.persist.hasHydrated();

export function useSettingsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToSettingsHydration,
    getSettingsHydrated,
    getServerSnapshot,
  );
}
