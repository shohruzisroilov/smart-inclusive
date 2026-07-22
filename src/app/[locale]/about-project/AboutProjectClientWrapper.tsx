"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { HeartIcon, HomeIcon } from "lucide-react";
import { SlideWizard } from "@/components/ui/SlideWizard";
import { Button } from "@/components/ui/Button";
import { ABOUT_PROJECT_SLIDES } from "@/lib/mocks/parents-content";

export function AboutProjectClientWrapper() {
  const t = useTranslations("slidePages");
  const router = useRouter();
  const [slides] = useState(ABOUT_PROJECT_SLIDES);

  const handleClose = () => {
    router.push("/");
  };

  // Custom action buttons for the final CTA
  const ctaActions = (
    <div className="flex flex-wrap gap-4 justify-center">
      <Button onClick={() => router.push("/volunteers")} className="flex items-center gap-2">
        <HeartIcon className="h-4 w-4 fill-current" />
        {t("becomeVolunteer")}
      </Button>
      <Button variant="secondary" onClick={() => router.push("/")} className="flex items-center gap-2">
        <HomeIcon className="h-4 w-4" />
        {t("home")}
      </Button>
    </div>
  );

  return (
    <SlideWizard
      title={t("aboutTitle")}
      slides={slides}
      onClose={handleClose}
      completionTitle={t("aboutCompletionTitle")}
      completionDescription={t("aboutCompletionDesc")}
      completionAction={ctaActions}
    />
  );
}
