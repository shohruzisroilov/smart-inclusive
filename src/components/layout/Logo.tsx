import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  className?: string;
  /** Yopuvchi drawer ichida ishlatilganda menyuni yopish uchun. */
  onNavigate?: () => void;
}

/**
 * Sayt logotipi + bosh sahifaga havola.
 *
 * Belgi (SVG) dekorativ → `aria-hidden`. Matn o'zi nomni bildiradi,
 * shuning uchun ekran o'quvchi uni ikki marta o'qimaydi.
 *
 * Ranglar `currentColor` va tokenlardan olinadi — rang ko'rligi rejimi
 * va qorong'i mavzuda avtomatik moslashadi.
 */
export function Logo({ className, onNavigate }: LogoProps) {
  const t = useTranslations("site");

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className={cn(
        "inline-flex items-center gap-3 rounded-md text-fg",
        "transition-opacity duration-[var(--duration-fast)] hover:opacity-80",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9 shrink-0 text-brand"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="2" width="36" height="36" rx="11" fill="currentColor" />
        <path
          d="M13 20.5c2.6 0 3.9-1.6 3.9-3.6S15.6 13.3 13 13.3M27 13.3c-2.6 0-3.9 1.6-3.9 3.6s1.3 3.6 3.9 3.6"
          stroke="var(--fg-on-brand)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="26" r="3.4" fill="var(--fg-on-brand)" />
      </svg>

      <span className="text-lg font-bold tracking-tight max-phone:sr-only">
        {t("name")}
      </span>
    </Link>
  );
}
