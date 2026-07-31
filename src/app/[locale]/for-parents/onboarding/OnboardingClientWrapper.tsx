"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SlideWizard, type SlideItem } from "@/components/ui/SlideWizard";

interface OnboardingClientWrapperProps {
  /** `Slide/GetList` (ssenariy: «ota-onalarni o'qitish vizardi») dan. */
  slides: SlideItem[];
}

export function OnboardingClientWrapper({ slides }: OnboardingClientWrapperProps) {
  const t = useTranslations("slidePages");
  const router = useRouter();

  const handleClose = () => {
    router.push("/for-parents");
  };

  // Bo'sh vizard boshqarib bo'lmaydigan holat — o'rniga tushunarli xabar.
  if (slides.length === 0) {
    return <p className="py-12 text-center text-sm text-fg-muted">{t("empty")}</p>;
  }

  return <SlideWizard title={t("onboardingTitle")} slides={slides} onClose={handleClose} />;
}
