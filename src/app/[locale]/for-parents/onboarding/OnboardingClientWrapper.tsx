"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { SlideWizard } from "@/components/ui/SlideWizard";
import { PARENT_ONBOARDING_SLIDES } from "@/lib/mocks/parents-content";

export function OnboardingClientWrapper() {
  const t = useTranslations("slidePages");
  const router = useRouter();
  const [slides] = useState(PARENT_ONBOARDING_SLIDES);

  const handleClose = () => {
    router.push("/for-parents");
  };

  return (
    <SlideWizard
      title={t("onboardingTitle")}
      slides={slides}
      onClose={handleClose}
    />
  );
}
