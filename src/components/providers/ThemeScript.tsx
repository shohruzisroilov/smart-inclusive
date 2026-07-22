import { STORAGE_KEYS } from "@/lib/storage";

/**
 * Bloklovchi inline skript — `<head>` ichida, birinchi bo'yashdan OLDIN ishlaydi.
 *
 * MUAMMO: sozlamalar localStorage'da. Agar ularni React effect'ida qo'llasak,
 * foydalanuvchi avval OQ (standart) sahifani ko'radi, keyin u qorong'iga
 * "sakraydi". Bu FOUC (Flash of Unstyled Content).
 *
 * YECHIM: React'gacha, sinxron ishlaydigan kichik skript.
 *
 * Skript zustand `persist` yozgan formatni o'qiydi: `{ state, version }`.
 * Har qanday xato jimgina yutiladi — sozlama qo'llanmasa ham sahifa ochiladi.
 */
export function ThemeScript() {
  const script = `
(function(){
  try {
    var root = document.documentElement;
    var raw = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.settings)});
    var s = {};
    if (raw) { var p = JSON.parse(raw); s = (p && p.state) || {}; }

    var theme = s.theme || "light";
    if (theme === "system") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-theme", theme);

    if (typeof s.fontScale === "number" && s.fontScale !== 1) {
      root.style.setProperty("--font-scale", String(s.fontScale));
    }

    if (s.reducedMotion === true) {
      root.setAttribute("data-reduced-motion", "true");
    }

    if (s.dyslexicFont === true) {
      root.setAttribute("data-dyslexic", "true");
    }
  } catch (e) {}
})();
`.trim();

  return (
    <script
      // Skript statik va foydalanuvchi kiritmasidan qurilmaydi —
      // yagona interpolyatsiya `JSON.stringify` bilan escape qilingan konstanta.
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
