"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { XIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { CTA_NAV, MAIN_NAV, type NavItem } from "@/lib/constants/navigation";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { LanguageSwitcher } from "@/components/settings/LanguageSwitcher";
import { AccessibilityPanel } from "@/components/settings/AccessibilityPanel";
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

  const menuPortal = typeof document !== "undefined" ? document.body : null;

  if (!open || !menuPortal) return null;

  return createPortal(
    <div className="laptop:hidden">
      {/* Orqa fon. Dekorativ — ekran o'quvchidan yashiramiz. */}
      <div
        className="fixed inset-0 z-[var(--z-overlay)] bg-overlay animate-in fade-in duration-[var(--duration-base)]"
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
          "border-l border-border bg-surface shadow-2xl",
          "animate-in slide-in-from-right duration-[var(--duration-base)] ease-out"
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
            {/* Bosh sahifa (Home) */}
            <li>
              <Link
                href="/"
                onClick={onClose}
                aria-current={isActive("/") ? "page" : undefined}
                className={cn(
                  "flex items-center rounded-lg px-4 text-lg font-semibold",
                  "min-h-[var(--tap-target-min)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  isActive("/")
                    ? "bg-brand-subtle text-brand"
                    : "text-fg hover:bg-surface-muted",
                )}
              >
                {t("home")}
              </Link>
            </li>

            {MAIN_NAV.map((item) => (
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

                {/* Ostki bo'limlar akkordeoni (Bolalar / Ota-onalar). */}
                {item.children && item.children.length > 0 && (
                  <ul className="mt-1 mb-2 ml-4 border-l border-border/60 pl-3 space-y-0.5">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          aria-current={isActive(child.href) ? "page" : undefined}
                          className={cn(
                            "flex items-center rounded-lg px-4 text-base font-medium",
                            "min-h-[var(--tap-target-min)]",
                            "transition-colors duration-[var(--duration-fast)]",
                            isActive(child.href)
                              ? "bg-brand-subtle text-brand"
                              : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                          )}
                        >
                          {t(child.labelKey)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <Link
            href={CTA_NAV.href}
            onClick={onClose}
            className={buttonStyles({ size: "lg", fullWidth: true, className: "mt-6" })}
          >
            {t(CTA_NAV.labelKey)}
          </Link>
        </nav>


      </div>
    </div>,
    menuPortal
  );
}
