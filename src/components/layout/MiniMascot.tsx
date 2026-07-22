"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { XIcon, SparklesIcon } from "lucide-react";
import { useSettingsStore, selectReducedMotion } from "@/stores/settings-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

/**
 * Mini-personaj (TZ 12.2) — sof dekorativ element.
 *
 *  - Ekran burchagida qat'iy pozitsiya, kontent/tugmalarni to'smaydi.
 *  - Desktop: kursor tomon «qaraydi» (ko'z qorachig'i harakati).
 *  - Planshet/telefon: teginishda qisqa sakrash reaksiyasi.
 *  - Yig'ilishi mumkin; holat localStorage'da (`si:mascot`) saqlanadi.
 *  - Biznes-mantiqsiz: syujet/holat yo'q.
 *  - `reducedMotion` yoqilganda idle animatsiya o'chadi.
 */

const STORAGE_KEY = "si:mascot";

export function MiniMascot() {
  const t = useTranslations("mascot");
  const hydrated = useHydrated();
  const reducedMotion = useSettingsStore(selectReducedMotion);
  const prefersReduced = reducedMotion === true;

  const [collapsed, setCollapsed] = useState(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [reacting, setReacting] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage'dan yig'ilgan holatni o'qish.
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const persistCollapsed = useCallback((value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {}
  }, []);

  // Kursorga qarash (faqat kengaytirilgan ko'rinishda).
  useEffect(() => {
    if (collapsed) return;
    const onMove = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const dist = 3; // qorachiq siljishi (px)
      setPupil({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [collapsed]);

  useEffect(() => {
    return () => {
      if (reactTimer.current) clearTimeout(reactTimer.current);
    };
  }, []);

  const triggerReaction = useCallback(() => {
    setReacting(true);
    if (reactTimer.current) clearTimeout(reactTimer.current);
    reactTimer.current = setTimeout(() => setReacting(false), 600);
  }, []);

  // SSR'da render qilmaymiz — localStorage holatiga bog'liq.
  if (!hydrated) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => persistCollapsed(false)}
        className={cn(
          "fixed bottom-4 right-4 z-[var(--z-header)] flex h-11 w-11 items-center justify-center rounded-full",
          "border border-border bg-surface text-brand shadow-lg transition-transform hover:scale-105 active:scale-95",
          "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]",
        )}
        aria-label={t("show")}
      >
        <SparklesIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 right-4 z-[var(--z-header)] select-none"
      aria-hidden="true"
    >
      <div className="relative">
        {/* Yig'ish tugmasi */}
        <button
          type="button"
          onClick={() => persistCollapsed(true)}
          className={cn(
            "absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full",
            "border border-border bg-surface text-fg-muted shadow-sm transition-colors hover:text-fg hover:bg-surface-muted",
            "focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]",
          )}
          aria-label={t("hide")}
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>

        {/* Personaj */}
        <button
          type="button"
          onClick={triggerReaction}
          className={cn(
            "block rounded-full focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]",
            !prefersReduced && "animate-mascot-idle",
            reacting && "animate-mascot-pop",
          )}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            className="drop-shadow-lg"
            role="img"
          >
            {/* Tana */}
            <circle cx="36" cy="36" r="30" className="fill-brand" />
            <circle cx="36" cy="36" r="30" className="fill-none stroke-brand-hover" strokeWidth="2" />
            {/* Yuz */}
            <circle cx="36" cy="34" r="20" className="fill-surface" />
            {/* Ko'zlar (oq) */}
            <circle cx="29" cy="32" r="5" className="fill-white stroke-border" strokeWidth="0.5" />
            <circle cx="43" cy="32" r="5" className="fill-white stroke-border" strokeWidth="0.5" />
            {/* Qorachiqlar — kursorga ergashadi */}
            <circle cx={29 + pupil.x} cy={32 + pupil.y} r="2.4" className="fill-fg" />
            <circle cx={43 + pupil.x} cy={32 + pupil.y} r="2.4" className="fill-fg" />
            {/* Tabassum */}
            <path
              d="M28 42 Q36 49 44 42"
              className="fill-none stroke-brand"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Yonoqlar */}
            <circle cx="24" cy="40" r="2.5" className="fill-accent/40" />
            <circle cx="48" cy="40" r="2.5" className="fill-accent/40" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes mascotIdle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-2deg); }
        }
        @keyframes mascotPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.15) rotate(6deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .animate-mascot-idle { animation: mascotIdle 3.2s ease-in-out infinite; }
        .animate-mascot-pop { animation: mascotPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
}
