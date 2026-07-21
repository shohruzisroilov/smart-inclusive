"use client";

import { useTranslations } from "next-intl";

/** Asosiy kontent maydonining id'si — `SkipLink` shu yerga sakraydi. */
export const MAIN_CONTENT_ID = "main-content";

/**
 * "Asosiy kontentga o'tish" havolasi.
 *
 * WCAG 2.4.1 (Bypass Blocks). Klaviatura va ekran o'quvchi foydalanuvchisi
 * har bir sahifada 20+ navigatsiya havolasini bosib o'tmasligi uchun.
 *
 * Odatda ko'rinmaydi; faqat Tab bosilganda birinchi element sifatida chiqadi.
 * Shuning uchun `sr-only` emas — fokusga kelganda KO'RINISHI shart.
 */
export function SkipLink() {
  const t = useTranslations("a11y");

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="
        absolute left-4 top-4 z-[var(--z-skip-link)]
        -translate-y-[200%] focus:translate-y-0
        rounded-md bg-brand px-5 py-3 text-base font-medium text-fg-on-brand
        shadow-lg transition-transform duration-[var(--duration-fast)]
      "
    >
      {t("skipToContent")}
    </a>
  );
}
