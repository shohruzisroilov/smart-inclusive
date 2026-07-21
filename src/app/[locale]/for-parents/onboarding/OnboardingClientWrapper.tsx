"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { SlideWizard } from "@/components/ui/SlideWizard";
import { PARENT_ONBOARDING_SLIDES } from "@/lib/mocks/parents-content";

export function OnboardingClientWrapper() {
  const router = useRouter();
  const [slides] = useState(PARENT_ONBOARDING_SLIDES);

  const handleClose = () => {
    router.push("/for-parents");
  };

  return (
    <SlideWizard
      title="Ota-onalar o'qitish vizardi"
      slides={slides}
      onClose={handleClose}
    />
  );
}
