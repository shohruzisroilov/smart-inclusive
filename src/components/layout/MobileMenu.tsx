"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CTA_NAV, MAIN_NAV, type NavItem } from "@/lib/constants/navigation";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/** Havola joriy sahifagami — `/kids` `/kids/books` uchun ham faol. */
function useIsActive() {
  const pathname = usePathname();

  return useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );
}

/**
 * Ichki bo'limli navigatsiya elementi (Bolalar / Ota-onalar).
 *
 * Disclosure patterni: tugma `aria-expanded` va `aria-controls` bilan
 * ochiladigan ro'yxatni boshqaradi. Bo'lim ichida joriy sahifa bo'lsa,
 * u boshlang'ich holatda ochiq turadi.
 */
function NavGroup({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const t = useTranslations("nav");
  const isActive = useIsActive();
  const panelId = useId();
  const [expanded, setExpanded] = useState(() => isActive(item.href));

  return (
    <li>
      <div className="flex items-stretch gap-1">
        {/* Bo'lim bosh sahifasiga o'tish — havola bo'lib qoladi. */}
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={cn(
            "flex flex-1 items-center rounded-lg px-4 text-lg font-semibold",
            "min-h-[var(--tap-target-min)]",
            "transition-colors duration-[var(--duration-fast)]",
            isActive(item.href)
              ? "bg-brand-subtle text-brand"
              : "text-fg hover:bg-surface-muted",
          )}
        >
          {t(item.labelKey)}
        </Link>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={cn(
            "tap-target flex items-center justify-center rounded-lg",
            "text-fg-muted transition-colors duration-[var(--duration-fast)]",
            "hover:bg-surface-muted hover:text-fg",
          )}
        >
          <ChevronDownIcon
            className={cn(
              "h-5 w-5 transition-transform duration-[var(--duration-base)]",
              expanded && "rotate-180",
            )}
            aria-hidden="true"
          />
          {/* Tugmaning maqsadi ekran o'quvchiga aniq bo'lishi uchun. */}
          <span className="sr-only">{t(item.labelKey)}</span>
        </button>
      </div>

      <ul id={panelId} hidden={!expanded} className="mt-1 space-y-0.5 pl-4">
        {item.children?.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href}
              onClick={onNavigate}
              aria-current={isActive(child.href) ? "page" : undefined}
              className={cn(
                "flex items-center rounded-lg px-4 text-base",
                "min-h-[var(--tap-target-min)]",
                "transition-colors duration-[var(--duration-fast)]",
                isActive(child.href)
                  ? "bg-brand-subtle font-medium text-brand"
                  : "text-fg-muted hover:bg-surface-muted hover:text-fg",
              )}
            >
              {t(child.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Yon panel navigatsiyasi — planshet va telefon uchun asosiy menyu.
 *
 * Qulaylik jihatlari:
 *  - `role="dialog"` + `aria-modal` → ekran o'quvchi orqadagi kontentni o'qimaydi;
 *  - fokus panel ichida ushlanadi, yopilganda ochgan tugmaga qaytadi;
 *  - Escape yopadi;
 *  - orqa fon skrolli bloklanadi;
 *  - har bir element ≥44px.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
  const panelRef = useRef<HTMLDivElement>(null);
  const isActive = useIsActive();
  const titleId = useId();

  useFocusTrap(open, panelRef, onClose);
  useBodyScrollLock(open);

  // Sahifa almashganda menyu ochiq qolib ketmasin.
  const pathname = usePathname();
  useEffect(() => {
    if (open) onClose();
    // Faqat pathname o'zgarishiga reaksiya — `open` va `onClose` qasddan yo'q.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="laptop:hidden">
      {/* Orqa fon. Dekorativ — ekran o'quvchidan yashiramiz. */}
      <div
        className="fixed inset-0 z-[var(--z-overlay)] bg-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed inset-y-0 right-0 z-[var(--z-drawer)]",
          "flex w-[min(24rem,88vw)] flex-col",
          "border-l border-border bg-surface shadow-lg",
        )}
      >
        {/* --- Panel sarlavhasi --- */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-base font-semibold text-fg-muted">
            {tHeader("mainNavigation")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className={cn(
              "tap-target flex items-center justify-center rounded-lg",
              "text-fg-muted transition-colors duration-[var(--duration-fast)]",
              "hover:bg-surface-muted hover:text-fg",
            )}
          >
            <XIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">{tHeader("closeMenu")}</span>
          </button>
        </div>

        {/* --- Navigatsiya --- */}
        <nav
          aria-label={tHeader("mainNavigation")}
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-4"
        >
          <ul className="space-y-1">
            {MAIN_NAV.map((item) =>
              item.children ? (
                <NavGroup key={item.href} item={item} onNavigate={onClose} />
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-lg px-4 text-lg font-semibold",
                      "min-h-[var(--tap-target-min)]",
                      "transition-colors duration-[var(--duration-fast)]",
                      isActive(item.href)
                        ? "bg-brand-subtle text-brand"
                        : "text-fg hover:bg-surface-muted",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <Link
            href={CTA_NAV.href}
            onClick={onClose}
            className={buttonStyles({ size: "lg", fullWidth: true, className: "mt-6" })}
          >
            {t(CTA_NAV.labelKey)}
          </Link>
        </nav>

        {/* --- Sozlamalar --- */}
        <div className="space-y-4 border-t border-border px-4 py-4">
          <ThemeToggle variant="list" />
          <LanguageSwitcher variant="list" onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
