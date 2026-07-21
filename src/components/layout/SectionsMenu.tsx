"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { MAIN_NAV } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * "Bo'limlar" ochiladigan menyusi (faqat laptop navigatsiyasi uchun).
 *
 * Barcha yuqori darajali bo'limlar bitta tugma ostiga yig'iladi — header
 * tinchroq ko'rinadi. Mobil qurilmada bu ishlatilmaydi (u yerda gamburger
 * yon paneli bor).
 *
 * QULAYLIK (WAI-ARIA "Disclosure Navigation" naqshi — menyu emas, havolalar):
 *  - tugma `aria-expanded` + `aria-controls` bilan panelni boshqaradi;
 *  - Escape yopadi va fokusni tugmaga qaytaradi;
 *  - tashqariga bosish yoki fokus chiqishi yopadi;
 *  - ↓/↑, Home/End bilan bandlar orasida yurish mumkin;
 *  - havolalar haqiqiy `<a>` — JS'siz ham (panel ochiq bo'lmasa-da) mazmun bor.
 */
export function SectionsMenu() {
  const t = useTranslations("nav");
  const tHeader = useTranslations("header");
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
  const anyActive = MAIN_NAV.some((item) => isActive(item.href));

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

  const items = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);

  const openAndFocusFirst = () => {
    setOpen(true);
    // Panel render bo'lgach birinchi bandga fokus.
    requestAnimationFrame(() => items()[0]?.focus());
  };

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openAndFocusFirst();
    }
  };

  // Panel ichida ↓/↑, Home/End bilan yurish.
  const handleListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const links = items();
    if (links.length === 0) return;
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        links[(current + 1) % links.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        links[(current - 1 + links.length) % links.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        links[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        links[links.length - 1]?.focus();
        break;
    }
  };

  // Fokus panel/tugmadan tashqariga chiqsa (masalan Tab bilan) — yopamiz.
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
        {tHeader("sections")}
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
            "animate-in fade-in slide-in-from-top-1 duration-[var(--duration-fast)]",
          )}
        >
          <nav aria-label={tHeader("mainNavigation")}>
            <ul ref={listRef} className="space-y-0.5" onKeyDown={handleListKeyDown}>
              {MAIN_NAV.map((item) => (
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
