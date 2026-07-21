"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el.getClientRects().length > 0,
  );
}

/**
 * Modal/drawer ichida fokusni ushlab turadi.
 *
 * WCAG 2.1.2 (No Keyboard Trap) va 2.4.3 (Focus Order) talabi:
 *  - ochilganda fokus ichkariga o'tadi;
 *  - Tab / Shift+Tab ichkarida aylanadi, orqadagi sahifaga chiqmaydi;
 *  - Escape yopadi;
 *  - yopilganda fokus OCHGAN tugmaga qaytadi.
 *
 * Oxirgi nuqta ko'pincha unutiladi va ekran o'quvchi foydalanuvchisini
 * sahifa boshiga uloqtiradi.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
): void {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Fokusni ichkariga olib kiramiz.
    const initial = getFocusable(container)[0] ?? container;
    initial.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const activeEl = document.activeElement;

      if (event.shiftKey && activeEl === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Fokusni ochgan elementga qaytaramiz.
      previouslyFocused?.focus?.();
    };
  }, [active, containerRef, onEscape]);
}
