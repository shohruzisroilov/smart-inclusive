"use client";

import { useEffect } from "react";

/**
 * Drawer/modal ochiq bo'lganda orqadagi sahifa skroll bo'lishini to'xtatadi.
 *
 * Planshet va mobil qurilmalarda bu ayniqsa muhim: aks holda drawer ichida
 * barmoq bilan surganda orqadagi sahifa siljiydi ("scroll chaining").
 *
 * Skrollbar yo'qolganda layout sakramasligi uchun uning kengligi
 * `padding-right` bilan qoplanadi.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [locked]);
}
