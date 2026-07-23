"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { MenuIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CTA_NAV, KIDS_NAV, PARENTS_NAV, SECTIONS_NAV } from "@/lib/constants/navigation";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import { AccessibilityPanel } from "@/components/settings/AccessibilityPanel";
import { cn } from "@/lib/utils/cn";

/**
 * Sayt sarlavhasi.
 *
 * PLANSHET-FIRST QARORI:
 *   Asosiy qurilma — planshet (768–1024px). 7 ta yuqori darajali bo'lim
 *   + til + rang sozlamasi + CTA gorizontal qatorga sig'maydi.
 *   Shuning uchun:
 *     - base (planshetgacha va planshet) → gamburger + yon panel;
 *     - `desktop:` (≥1280px)            → gorizontal navigatsiya.
 *
 *   Gorizontal qator faqat ≥1280px'da ochiladi, chunki 7 ta bo'lim +
 *   til + sozlama + CTA 1024–1279px oralig'ida bitta qatorga sig'maydi
 *   (aks holda ikkinchi qatorga tushib ketardi). Katta matn o'lchamida
 *   esa `flex-wrap` zaxira sifatida ishlaydi.
 */
export function Header() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-header)]",
        "border-b border-border bg-surface/95 backdrop-blur-sm",
      )}
    >
      <Container className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 min-h-[var(--header-height)] max-phone:min-h-[var(--header-height-compact)] py-2">
        {/* --- Chap tomon: logo + "Bosh sahifa" + "Bo'limlar" (desktop) --- */}
        <div className="flex flex-wrap items-center gap-2 desktop:gap-8">
          <Logo />

          {/* Bosh sahifa havolasi + barcha bo'limlar dropdown'i — faqat desktop. */}
          <nav
            aria-label={tHeader("mainNavigation")}
            className="hidden desktop:flex desktop:flex-wrap desktop:items-center desktop:gap-1"
          >
            <Link
              href="/"
              aria-current={isHome ? "page" : undefined}
              className={cn(
                "flex items-center whitespace-nowrap rounded-lg px-3 text-base font-semibold",
                "min-h-[var(--tap-target-min)]",
                "transition-colors duration-[var(--duration-fast)]",
                isHome
                  ? "bg-brand-subtle text-brand"
                  : "text-fg hover:bg-surface-muted",
              )}
            >
              {t("home")}
            </Link>

            <NavDropdown label={t("kids")} items={KIDS_NAV} />
            <NavDropdown label={t("parents")} items={PARENTS_NAV} />
            <NavDropdown label={tHeader("more")} items={SECTIONS_NAV} />
          </nav>
        </div>

        {/* --- O'ng tomon --- */}
        <div className="flex items-center gap-2 max-phone:gap-1.5">
          <div className="hidden desktop:flex desktop:items-center desktop:gap-3">
            <AccessibilityPanel />
            <LanguageSwitcher />
            <Link href={CTA_NAV.href} className={buttonStyles({ size: "sm" })}>
              {t(CTA_NAV.labelKey)}
            </Link>
          </div>

          {/* --- Mobil maxsus imkoniyatlar va til tanlash --- */}
          <div className="flex items-center gap-2 max-phone:gap-1 desktop:hidden">
            <AccessibilityPanel />
            <LanguageSwitcher className="max-phone:[&_a]:min-w-[32px] max-phone:[&_a]:px-1.5 max-phone:[&_a]:text-xs max-phone:[&_ul]:gap-0.5" />
          </div>

          {/* --- Gamburger: desktopgacha --- */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            className={cn(
              "tap-target flex items-center justify-center rounded-lg desktop:hidden",
              "text-fg transition-colors duration-[var(--duration-fast)]",
              "hover:bg-surface-muted",
            )}
          >
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">{tHeader("openMenu")}</span>
          </button>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
