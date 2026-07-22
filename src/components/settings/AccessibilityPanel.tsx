"use client";

import { useState, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { 
  Sliders, 
  SunIcon, 
  MoonIcon, 
  EyeIcon, 
  PaletteIcon, 
  HelpCircleIcon,
  XIcon
} from "lucide-react";
import { useSettingsStore } from "@/stores/settings-store";
import { useSettingsHydrated } from "@/hooks/use-hydrated";
import { FONT_SCALES, type FontScale } from "@/types/settings";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
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
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

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

  // Focus trap inside the drawer
  useFocusTrap(isOpen, drawerRef, handleClose);
  
  // Body scroll lock when open
  useBodyScrollLock(isOpen);

  // Portal target in browser body
  const drawerPortal = typeof document !== "undefined" ? document.body : null;

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

      {isOpen && hydrated && drawerPortal && createPortal(
        <div className="fixed inset-0 z-[var(--z-overlay)] flex justify-end">
          {/* Backdrop (Dark overlay behind drawer) */}
          <div
            className="fixed inset-0 bg-overlay animate-in fade-in duration-[var(--duration-base)]"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Drawer Panel - Wide side drawer with big accessible padding and child-friendly design */}
          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "relative z-[var(--z-drawer)] h-full w-[min(34rem,95vw)] flex flex-col bg-surface border-l border-border p-6 md:p-8 shadow-xl",
              "animate-in slide-in-from-right duration-[var(--duration-slow)] ease-out"
            )}
          >
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4">
              <h2 id={titleId} className="text-xl md:text-2xl font-black text-fg font-display">
                {t("accessibilitySettings")}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "tap-target flex items-center justify-center rounded-lg text-fg-muted",
                  "transition-colors duration-[var(--duration-fast)]",
                  "hover:bg-surface-muted hover:text-fg",
                  "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
                )}
              >
                <XIcon className="h-6 w-6" aria-hidden="true" />
                <span className="sr-only">Yopish</span>
              </button>
            </div>

            {/* Scrollable controls container */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-8">
              
              {/* --- 1. MAVZULAR (Themes) - Big Tap Targets for Children --- */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-fg-muted uppercase tracking-wider flex items-center gap-2">
                  <PaletteIcon className="h-4 w-4 text-brand" aria-hidden="true" />
                  {t("theme")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Light */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-4.5 rounded-xl border-2 text-base font-bold transition-all duration-[var(--duration-fast)]",
                      theme === "light"
                        ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                        : "border-border hover:bg-surface-muted text-fg"
                    )}
                  >
                    <SunIcon className="h-5 w-5" aria-hidden="true" />
                    <span>{t("themeLight")}</span>
                  </button>

                  {/* Dark */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-4.5 rounded-xl border-2 text-base font-bold transition-all duration-[var(--duration-fast)]",
                      theme === "dark"
                        ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                        : "border-border hover:bg-surface-muted text-fg"
                    )}
                  >
                    <MoonIcon className="h-5 w-5" aria-hidden="true" />
                    <span>{t("themeDark")}</span>
                  </button>

                  {/* High Contrast */}
                  <button
                    type="button"
                    onClick={() => setTheme("high-contrast")}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-4.5 rounded-xl border-2 text-base font-bold transition-all duration-[var(--duration-fast)]",
                      theme === "high-contrast"
                        ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                        : "border-border hover:bg-surface-muted text-fg"
                    )}
                  >
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                    <span>{t("themeHighContrast")}</span>
                  </button>

                  {/* Monochrome */}
                  <button
                    type="button"
                    onClick={() => setTheme("monochrome")}
                    className={cn(
                      "flex items-center justify-center gap-3 px-4 py-4.5 rounded-xl border-2 text-base font-bold transition-all duration-[var(--duration-fast)]",
                      theme === "monochrome"
                        ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                        : "border-border hover:bg-surface-muted text-fg"
                    )}
                  >
                    <PaletteIcon className="h-5 w-5" aria-hidden="true" />
                    <span>{t("themeMonochrome")}</span>
                  </button>
                </div>
              </div>

              {/* --- 2. MATN O'LCHAMI (Font Scale) - Spaced and Wide Grid --- */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-fg-muted uppercase tracking-wider flex items-center gap-2">
                    <span className="text-xl font-black">A</span>
                    <span>{t("fontScale")}</span>
                  </h3>
                  <span className="text-lg font-black text-brand">
                    {Math.round(fontScale * 100)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {FONT_SCALES.map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setFontScale(scale)}
                      className={cn(
                        "flex flex-col items-center justify-center py-4.5 rounded-xl border-2 text-sm font-black transition-all duration-[var(--duration-fast)]",
                        fontScale === scale
                          ? "border-brand bg-brand-subtle text-brand ring-2 ring-brand/35"
                          : "border-border hover:bg-surface-muted text-fg"
                      )}
                    >
                      <span style={{ fontSize: `${Math.min(1.4, scale)}rem` }} className="h-7 flex items-center mb-1">A</span>
                      <span>{Math.round(scale * 100)}%</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* --- 3. DYSLEXIA REJIMI --- */}
              <div className="flex items-center justify-between border-t border-border/50 pt-5">
                <div className="space-y-1 max-w-[75%]">
                  <label htmlFor="dyslexia-toggle-drawer" className="text-base font-bold text-fg block select-none">
                    {t("dyslexiaMode")}
                  </label>
                  <span className="text-xs text-fg-muted block">
                    Disleksiyasi bor bolalar uchun maxsus shrift, kengaytirilgan intervallar va osonroq o'qish qoidalari.
                  </span>
                </div>
                <button
                  id="dyslexia-toggle-drawer"
                  type="button"
                  role="switch"
                  aria-checked={dyslexicFont}
                  onClick={() => setDyslexicFont(!dyslexicFont)}
                  className={cn(
                    "relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                    dyslexicFont ? "bg-brand" : "bg-surface-muted"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      dyslexicFont ? "translate-x-7" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              {/* --- 4. REDUCED MOTION --- */}
              <div className="flex items-center justify-between border-t border-border/50 pt-5">
                <div className="space-y-1 max-w-[75%]">
                  <label htmlFor="motion-toggle-drawer" className="text-base font-bold text-fg block select-none">
                    {t("reducedMotion")}
                  </label>
                  <span className="text-xs text-fg-muted block">
                    Saytdagi tez animatsiyalar, miltillashlar va harakatlarni kamaytiradi (ADHD/autizm uchun tavsiya etiladi).
                  </span>
                </div>
                <button
                  id="motion-toggle-drawer"
                  type="button"
                  role="switch"
                  aria-checked={!!reducedMotion}
                  onClick={() => setReducedMotion(reducedMotion ? null : true)}
                  className={cn(
                    "relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
                    reducedMotion ? "bg-brand" : "bg-surface-muted"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      reducedMotion ? "translate-x-7" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* --- 5. SCREEN READER INFO --- */}
          <div className="bg-surface-muted rounded-2xl p-5 flex gap-4 border border-border/50 mt-6">
            <HelpCircleIcon className="h-6 w-6 text-brand shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-fg uppercase tracking-wider">
                Screen Reader mosligi
              </h4>
              <p className="text-xs text-fg-muted leading-relaxed">
                {t("screenReaderInfo")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    drawerPortal
  )}
    </>
  );
}
