"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SlideWizard, type SlideItem } from "@/components/ui/SlideWizard";

interface PresentationClientWrapperProps {
  /** `Slide/GetList` (ssenariy: «platforma taqdimoti») dan. */
  slides: SlideItem[];
}

export function PresentationClientWrapper({ slides }: PresentationClientWrapperProps) {
  const t = useTranslations("slidePages");
  const router = useRouter();

  const handleClose = () => {
    router.push("/for-parents");
  };

  if (slides.length === 0) {
    return <p className="py-12 text-center text-sm text-fg-muted">{t("empty")}</p>;
  }

  return <SlideWizard title={t("presentationTitle")} slides={slides} onClose={handleClose} />;
}
