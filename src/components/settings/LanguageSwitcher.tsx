"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LOCALES,
  LOCALE_HTML_LANG,
  LOCALE_LABELS,
  LOCALE_SHORT_LABELS,
  type Locale,
} from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

interface LanguageSwitcherProps {
  /** `segmented` — headerda ixcham; `list` — drawer ichida to'liq. */
  variant?: "segmented" | "list";
  className?: string;
  onNavigate?: () => void;
}

/**
 * Interfeys tilini almashtirish.
 *
 * NIMA UCHUN DROPDOWN EMAS, HAVOLALAR:
 *  - haqiqiy `<a>` — JS yuklanmasa ham ishlaydi;
 *  - qidiruv tizimi tarjimalarni ko'radi (SEO);
 *  - klaviatura va ekran o'quvchi uchun qo'shimcha kod kerak emas —
 *    popup uchun roving tabindex, Escape, focus trap yozish shart emas;
 *  - 3 ta til uchun dropdown ortiqcha murakkablik.
 *
 * `locale` propi bilan next-intl bir xil sahifaning boshqa tildagi
 * manzilini quradi va `NEXT_LOCALE` cookie'sini yangilaydi.
 */
export function LanguageSwitcher({
  variant = "segmented",
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const t = useTranslations("a11y");
  const activeLocale = useLocale() as Locale;

  // Til prefiksisiz joriy yo'l — `/kids/books` ko'rinishida.
  // ESLATMA: query parametrlari saqlanmaydi. Filtrli ro'yxatlar
  // qo'shilganda `useSearchParams` bilan kengaytirish kerak bo'ladi.
  const pathname = usePathname();

  const isList = variant === "list";

  return (
    <nav aria-label={t("language")} className={className}>
      <ul
        className={cn(
          "flex items-center",
          isList ? "flex-col gap-2" : "gap-1 rounded-lg bg-surface-muted p-1",
        )}
      >
        {LOCALES.map((locale) => {
          const isActive = locale === activeLocale;

          return (
            <li key={locale} className={isList ? "w-full" : undefined}>
              <Link
                href={pathname}
                locale={locale}
                lang={LOCALE_HTML_LANG[locale]}
                hrefLang={LOCALE_HTML_LANG[locale]}
                onClick={onNavigate}
                // Joriy tilni ekran o'quvchiga bildiradi.
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center justify-center rounded-md font-medium",
                  "transition-colors duration-[var(--duration-fast)]",
                  isList
                    ? "min-h-[var(--tap-target-min)] w-full px-4 py-3 text-base"
                    : "h-9 min-w-[36px] px-2.5 text-sm",
                  isActive
                    ? "bg-brand text-fg-on-brand"
                    : "text-fg-muted hover:bg-surface hover:text-fg",
                )}
              >
                {/*
                  Ixcham variantda "UZ" ko'rinadi, lekin ekran o'quvchi
                  to'liq nomni o'qishi kerak.
                */}
                <span aria-hidden={!isList}>
                  {isList ? LOCALE_LABELS[locale] : LOCALE_SHORT_LABELS[locale]}
                </span>
                {!isList && <span className="sr-only">{LOCALE_LABELS[locale]}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
