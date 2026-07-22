"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PhoneIcon, CopyIcon, CheckIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TRUST_PHONE_DISPLAY, TRUST_PHONE_HREF } from "@/lib/constants/contact";
import { cn } from "@/lib/utils/cn";

/**
 * Yuqori ishonch paneli (header ustida) — TZ 3.1.
 *
 * Xatti-harakat:
 *  - Desktop (nozik ko'rsatkich, ≥1024px): bosish → raqamni buferga nusxalash,
 *    «Nusxalandi» tasdig'i bilan.
 *  - Planshet/telefon: bosish → `tel:` orqali raqam terish.
 *
 * Qurilma turi mount'dan keyin aniqlanadi (SSR mos kelishi uchun boshlang'ich
 * holat — call rejimi, keyin desktopda copy'ga o'tadi).
 */
export function TrustBar() {
  const t = useTranslations("trustLine");
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Nozik ko'rsatkichli (sichqoncha) va keng ekran → copy rejimi.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    setCanCopy(finePointer && wide && !!navigator.clipboard);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!canCopy) return; // tel: havolasi tabiiy ishlaydi
      e.preventDefault();
      navigator.clipboard
        .writeText(TRUST_PHONE_DISPLAY)
        .then(() => {
          setCopied(true);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopied(false), 1800);
        })
        .catch(() => {});
    },
    [canCopy],
  );

  return (
    <div className="border-b border-border bg-brand text-fg-on-brand select-none">
      <Container className="flex items-center justify-center gap-2 py-1.5 text-sm">
        <span className="max-phone:hidden font-medium opacity-90">{t("label")}</span>
        <a
          href={`tel:${TRUST_PHONE_HREF}`}
          onClick={handleClick}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-bold tabular-nums",
            "transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white",
          )}
          aria-label={
            canCopy
              ? t("copyHint", { phone: TRUST_PHONE_DISPLAY })
              : t("callHint", { phone: TRUST_PHONE_DISPLAY })
          }
        >
          <PhoneIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {TRUST_PHONE_DISPLAY}
          {canCopy &&
            (copied ? (
              <CheckIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <CopyIcon className="h-4 w-4 shrink-0 opacity-60 group-hover:opacity-100" aria-hidden="true" />
            ))}
        </a>
        {copied && (
          <span role="status" className="text-xs font-semibold">
            {t("copied")}
          </span>
        )}
      </Container>
    </div>
  );
}
