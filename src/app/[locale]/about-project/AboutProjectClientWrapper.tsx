"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { HeartIcon, HomeIcon } from "lucide-react";
import { SlideWizard, type SlideItem } from "@/components/ui/SlideWizard";
import { Button } from "@/components/ui/Button";

interface AboutProjectClientWrapperProps {
  /** `Slide/GetList` (ssenariy: «loyiha haqida») dan. */
  slides: SlideItem[];
}

export function AboutProjectClientWrapper({ slides }: AboutProjectClientWrapperProps) {
  const t = useTranslations("slidePages");
  const router = useRouter();

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

  if (slides.length === 0) {
    return <p className="py-12 text-center text-sm text-fg-muted">{t("empty")}</p>;
  }

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
