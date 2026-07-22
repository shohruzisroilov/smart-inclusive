"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { 
  Sliders, 
  SunIcon, 
  MoonIcon, 
  EyeIcon, 
  PaletteIcon, 
  HelpCircleIcon
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useSettingsHydrated } from "@/hooks/use-hydrated";
import { FONT_SCALES, THEME_MODES, type FontScale, type ThemeMode } from "@/types/settings";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils/cn";

interface AccessibilityPanelProps {
  /** `compact` — headerda ikonka; `list` — drawer/sozlamalarda matn bilan. */
  variant?: "compact" | "list";
  className?: string;
}

export function AccessibilityPanel({ variant = "compact", className }: AccessibilityPanelProps) {
  const t = useTranslations("a11y");
  const hydrated = useSettingsHydrated();
  const [isOpen, setIsOpen] = useState(false);

  const theme = useSettingsStore((s) => s.theme);
  const fontScale = useSettingsStore((s) => s.fontScale);
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const dyslexicFont = useSettingsStore((s) => s.dyslexicFont);

  const setTheme = useSettingsStore((s) => s.setTheme);
  const setFontScale = useSettingsStore((s) => s.setFontScale);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);
  const setDyslexicFont = useSettingsStore((s) => s.setDyslexicFont);

  const isList = variant === "list";

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={!hydrated}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={t("accessibilitySettings")}
        title={t("accessibilitySettings")}
        className={cn(
          "flex items-center rounded-lg text-fg focus-visible:ring-2 focus-visible:ring-focus",
          "transition-colors duration-[var(--duration-fast)]",
          "hover:bg-surface-muted disabled:opacity-60",
          isList
            ? "w-full min-h-[var(--tap-target-min)] gap-3 px-4 text-base font-medium"
            : "tap-target justify-center",
          className
        )}
      >
        <Sliders className="h-5 w-5 shrink-0" aria-hidden="true" />
        {isList && <span>{t("accessibilitySettings")}</span>}
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={t("accessibilitySettings")}
        className="max-w-md"
      >
        <div className="space-y-6">
          {/* --- 1. MAVZULAR (Themes) --- */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" aria-hidden="true" />
              {t("theme")}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {/* Light */}
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  theme === "light"
                    ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                    : "border-border hover:bg-surface-muted text-fg"
                )}
              >
                <SunIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t("themeLight")}</span>
              </button>

              {/* Dark */}
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  theme === "dark"
                    ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                    : "border-border hover:bg-surface-muted text-fg"
                )}
              >
                <MoonIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t("themeDark")}</span>
              </button>

              {/* High Contrast */}
              <button
                type="button"
                onClick={() => setTheme("high-contrast")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  theme === "high-contrast"
                    ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                    : "border-border hover:bg-surface-muted text-fg"
                )}
              >
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t("themeHighContrast")}</span>
              </button>

              {/* Monochrome */}
              <button
                type="button"
                onClick={() => setTheme("monochrome")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-[var(--duration-fast)]",
                  theme === "monochrome"
                    ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                    : "border-border hover:bg-surface-muted text-fg"
                )}
              >
                <PaletteIcon className="h-4 w-4" aria-hidden="true" />
                <span>{t("themeMonochrome")}</span>
              </button>
            </div>
          </div>

          {/* --- 2. MATN O'LCHAMI (Font Scale) --- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-fg-muted uppercase tracking-wider flex items-center gap-2">
                <span className="text-lg font-bold">A</span>
                <span>{t("fontScale")}</span>
              </h3>
              <span className="text-sm font-medium text-brand">
                {Math.round(fontScale * 100)}%
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1">
              {FONT_SCALES.map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setFontScale(scale)}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 rounded-lg border text-xs font-semibold transition-all duration-[var(--duration-fast)]",
                    fontScale === scale
                      ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                      : "border-border hover:bg-surface-muted text-fg"
                  )}
                >
                  <span style={{ fontSize: `${Math.min(1.3, scale)}rem` }} className="h-6 flex items-center">A</span>
                  <span>{Math.round(scale * 100)}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* --- 3. DYSLEXIA REJIMI --- */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <div className="space-y-0.5">
              <label htmlFor="dyslexia-toggle" className="text-sm font-semibold text-fg block">
                {t("dyslexiaMode")}
              </label>
              <span className="text-xs text-fg-muted">
                Disleksiyasi bor bolalar uchun maxsus font va intervallar.
              </span>
            </div>
            <button
              id="dyslexia-toggle"
              type="button"
              role="switch"
              aria-checked={dyslexicFont}
              onClick={() => setDyslexicFont(!dyslexicFont)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                dyslexicFont ? "bg-brand" : "bg-surface-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  dyslexicFont ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* --- 4. REDUCED MOTION --- */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <div className="space-y-0.5">
              <label htmlFor="motion-toggle" className="text-sm font-semibold text-fg block">
                {t("reducedMotion")}
              </label>
              <span className="text-xs text-fg-muted">
                Saytdagi tez animatsiyalar va harakatlarni kamaytirish.
              </span>
            </div>
            <button
              id="motion-toggle"
              type="button"
              role="switch"
              aria-checked={!!reducedMotion}
              onClick={() => setReducedMotion(reducedMotion ? null : true)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                reducedMotion ? "bg-brand" : "bg-surface-muted"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  reducedMotion ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* --- 5. SCREEN READER INFO --- */}
          <div className="bg-surface-muted rounded-xl p-4 flex gap-3 border border-border/50 mt-4">
            <HelpCircleIcon className="h-5 w-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-fg-muted uppercase tracking-wider">
                Screen Reader
              </h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                {t("screenReaderInfo")}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
