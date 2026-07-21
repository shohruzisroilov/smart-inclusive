"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useSettingsHydrated } from "@/hooks/use-hydrated";
import type { ThemeMode } from "@/types/settings";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  /** `compact` — headerda ikonka; `list` — drawer/sozlamalarda matn bilan. */
  variant?: "compact" | "list";
  className?: string;
}

/**
 * Yorug' ↔ qorong'i mavzu tugmasi.
 *
 * Store'da tema `light | dark | system` bo'lishi mumkin; bu tugma esa oddiy
 * ikkilik almashtirgich — joriy ko'rinishning teskarisiga o'tkazadi.
 * `system` tanlangan bo'lsa, hozirgi OS holatiga qarab hal qilinadi.
 *
 * HYDRATION: server localStorage'ni ko'rmaydi, shuning uchun u har doim
 * standart (yorug') holatni render qiladi. Store o'qilgunча shu holatda
 * turamiz — aks holda React hydration mismatch beradi.
 */
export function ThemeToggle({ variant = "compact", className }: ThemeToggleProps) {
  const t = useTranslations("a11y");

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const hydrated = useSettingsHydrated();

  // Ekran o'quvchiga o'zgarishni e'lon qilish uchun.
  const [announcement, setAnnouncement] = useState("");

  const isDark = hydrated && resolveIsDark(theme);
  const isList = variant === "list";

  const handleToggle = () => {
    const next: ThemeMode = isDark ? "light" : "dark";
    setTheme(next);
    setAnnouncement(next === "dark" ? t("themeDark") : t("themeLight"));
  };

  // Yorug'da → oyni ko'rsatamiz (bosilsa qorong'iga); qorong'ida → quyoshni.
  const Icon = isDark ? SunIcon : MoonIcon;
  const label = isDark ? t("switchToLight") : t("switchToDark");
  // Ro'yxat variantida bosilganda qaysi rejimga o'tishini yozamiz.
  const listLabel = isDark ? t("themeLight") : t("themeDark");

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!hydrated}
        aria-pressed={isDark}
        aria-label={label}
        title={label}
        className={cn(
          "flex items-center rounded-lg text-fg",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:bg-surface-muted disabled:opacity-60",
          isList
            ? "w-full min-h-[var(--tap-target-min)] gap-3 px-4 text-base font-medium"
            : "tap-target justify-center",
          className,
        )}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        {isList && <span>{listLabel}</span>}
      </button>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  );
}

/** Joriy tema qorong'imi — `system` bo'lsa OS sozlamasiga qaraydi. */
function resolveIsDark(theme: ThemeMode): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
