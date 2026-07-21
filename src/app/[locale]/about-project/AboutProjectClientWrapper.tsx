"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { HeartIcon, HomeIcon } from "lucide-react";
import { SlideWizard } from "@/components/ui/SlideWizard";
import { Button } from "@/components/ui/Button";
import { ABOUT_PROJECT_SLIDES } from "@/lib/mocks/parents-content";

export function AboutProjectClientWrapper() {
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
        Ko&apos;ngilli bo&apos;lish
      </Button>
      <Button variant="secondary" onClick={() => router.push("/")} className="flex items-center gap-2">
        <HomeIcon className="h-4 w-4" />
        Bosh sahifa
      </Button>
    </div>
  );

  return (
    <SlideWizard
      title="Loyiha haqida taqdimot"
      slides={slides}
      onClose={handleClose}
      completionTitle="Smart Inclusive loyihasi bilan tanishganingiz uchun tashakkur!"
      completionDescription="Bizning maqsadimiz har bir bola uchun ta'lim jarayonini teng darajada inklyuziv qilishdir. Bizga qo'shiling — ko'ngilli bo'ling yoki loyihani keng targ'ib qiling."
      completionAction={ctaActions}
    />
  );
}
