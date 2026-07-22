"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings-store";

/**
 * Store holatini `<html>` atributlariga sinxronlaydi.
 *
 * `ThemeScript` sozlamani BIR MARTA, sahifa ochilishida qo'llaydi.
 * Bu komponent esa foydalanuvchi sozlamani O'ZGARTIRGANDA qo'llaydi.
 * Ikkalasi bir xil atributlar bilan ishlaydi.
 *
 * Hech narsa render qilmaydi.
 */
export function SettingsSync() {
  const theme = useSettingsStore((s) => s.theme);
  const fontScale = useSettingsStore((s) => s.fontScale);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const dyslexicFont = useSettingsStore((s) => s.dyslexicFont);

  // --- Mavzu (tizim sozlamasini ham kuzatavi) ---
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const resolved = theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.setAttribute("data-theme", resolved);
    };

    apply();

    // "system" tanlangan bo'lsa, OS mavzusi o'zgarishiga darhol javob beramiz.
    if (theme !== "system") return;
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  // --- Shrift o'lchami ---
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(fontScale));
  }, [fontScale]);

  // --- Harakatni kamaytirish ---
  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion === true) {
      root.setAttribute("data-reduced-motion", "true");
    } else {
      // `null` — tizim sozlamasi hal qiladi (CSS media query orqali).
      root.removeAttribute("data-reduced-motion");
    }
  }, [reducedMotion]);

  // --- Disleksiya rejimi ---
  useEffect(() => {
    const root = document.documentElement;
    if (dyslexicFont) {
      root.setAttribute("data-dyslexic", "true");
    } else {
      root.removeAttribute("data-dyslexic");
    }
  }, [dyslexicFont]);

  return null;
}
