import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  FOOTER_NAV,
  KIDS_NAV,
  PARENTS_NAV,
  type NavItem,
} from "@/lib/constants/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";

interface FooterColumnProps {
  titleKey: string;
  items: NavItem[];
}

function FooterColumn({ titleKey, items }: FooterColumnProps) {
  const t = useTranslations("nav");

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
        {t(titleKey)}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
                inline-flex min-h-[var(--tap-target-min)] items-center
                text-base text-fg-muted
                transition-colors duration-[var(--duration-fast)]
                hover:text-brand
              "
            >
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sayt pastki qismi.
 *
 * Server Component — interaktivlik yo'q.
 *
 * QULAYLIK QARORLARI:
 *  - `<footer>` + `role` kerak emas: semantik teg o'zi landmark beradi.
 *  - Har bir ustun `<h3>` bilan nomlanadi → ekran o'quvchi sarlavhalar
 *    ro'yxati orqali tez harakatlanadi.
 *  - Havolalar ≥44px balandlikda — planshetda barmoq bilan bosish qulay.
 *  - "Qulaylik bayonoti" havolasi majburiy: platformaning qulaylik
 *    darajasi va aloqa yo'li shu yerda hujjatlashtiriladi.
 */
export function Footer() {
  const t = useTranslations("footer");
  const tSite = useTranslations("site");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface-subtle">
      <Container className="py-12">
        <div className="grid grid-cols-1 phone:grid-cols-2 tablet:grid-cols-4 gap-10">
          {/* --- Brend --- */}
          <div className="laptop:col-span-1">
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
              {t("description")}
            </p>
          </div>

          {/* --- Bo'limlar --- */}
          <FooterColumn titleKey="kids" items={KIDS_NAV} />
          <FooterColumn titleKey="parents" items={PARENTS_NAV} />
          <FooterColumn titleKey="aboutProject" items={FOOTER_NAV} />
        </div>

        {/* --- Pastki qator --- */}
        <div
          className="
            mt-10 flex flex-wrap items-center justify-between gap-4
            border-t border-border pt-6
          "
        >
          <p className="text-sm text-fg-subtle">
            © {year} {tSite("name")}. {t("rights")}
          </p>

          <Link
            href="/accessibility"
            className="
              inline-flex min-h-[var(--tap-target-min)] items-center
              text-sm text-fg-muted underline underline-offset-4
              transition-colors duration-[var(--duration-fast)]
              hover:text-brand
            "
          >
            {t("accessibilityStatement")}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
