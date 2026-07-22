"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { type NavItem } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

interface NavDropdownProps {
  /** Tugma yorlig'i — allaqachon tarjima qilingan matn. */
  label: string;
  /** Ochilganda ko'rsatiladigan havolalar. */
  items: NavItem[];
}

/**
 * Bitta ochiladigan navigatsiya menyusi (faqat laptop uchun).
 *
 * Header'da bir nechta marta ishlatiladi: "Bolalar uchun", "Ota-onalar uchun"
 * va qolgan bo'limlar uchun alohida-alohida.
 *
 * QULAYLIK (WAI-ARIA "Disclosure Navigation" naqshi — menyu emas, havolalar):
 *  - tugma `aria-expanded` + `aria-controls` bilan panelni boshqaradi;
 *  - Escape yopadi va fokusni tugmaga qaytaradi;
 *  - tashqariga bosish yoki fokus chiqishi yopadi;
 *  - ↓/↑, Home/End bilan bandlar orasida yurish mumkin.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const menuId = useId();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Ochiq bo'limlardan biri joriy sahifami — tugmani ham faol ko'rsatamiz.
  const anyActive = items.some((item) => isActive(item.href));

  // Sahifa almashganda menyu ochiq qolib ketmasin.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Tashqariga bosish va Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const links = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);

  const openAndFocusFirst = () => {
    setOpen(true);
    requestAnimationFrame(() => links()[0]?.focus());
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocusFirst();
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const all = links();
    if (all.length === 0) return;
    const current = all.indexOf(document.activeElement as HTMLAnchorElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        all[(current + 1) % all.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        all[(current - 1 + all.length) % all.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        all[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        all[all.length - 1]?.focus();
        break;
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleButtonKeyDown}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-base font-semibold",
          "min-h-[var(--tap-target-min)]",
          "transition-colors duration-[var(--duration-fast)]",
          open || anyActive
            ? "bg-brand-subtle text-brand"
            : "text-fg hover:bg-surface-muted",
        )}
      >
        {label}
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 transition-transform duration-[var(--duration-base)]",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          className={cn(
            "absolute left-0 top-[calc(100%+0.5rem)] z-[var(--z-header)] min-w-[15rem]",
            "rounded-xl border border-border bg-surface p-2 shadow-lg",
            "max-h-[calc(100dvh-var(--header-height)-1.5rem)] overflow-y-auto overscroll-contain",
            "animate-in fade-in slide-in-from-top-1 duration-[var(--duration-fast)]",
          )}
        >
          <nav aria-label={label}>
            <ul ref={listRef} className="space-y-0.5" onKeyDown={handleListKeyDown}>
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-base font-bold",
                      "min-h-[var(--tap-target-min)]",
                      "transition-colors duration-[var(--duration-fast)]",
                      isActive(item.href)
                        ? "bg-brand-subtle text-brand"
                        : "text-fg-muted hover:bg-surface-muted hover:text-fg",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
