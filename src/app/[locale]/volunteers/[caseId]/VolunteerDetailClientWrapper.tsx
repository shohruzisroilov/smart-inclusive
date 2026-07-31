"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon, MapPinIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { type VolunteerCaseView } from "@/lib/api/mappers";

interface VolunteerDetailClientWrapperProps {
  /**
   * Server komponentida `VolunteerCase/Get/{id}` dan olinadi. «Topilmadi»
   * holatiga bu yerda emas, sahifada `notFound()` bilan ishlov beriladi.
   */
  item: VolunteerCaseView;
}

export function VolunteerDetailClientWrapper({ item }: VolunteerDetailClientWrapperProps) {
  const t = useTranslations("volunteersPage");
  const router = useRouter();

  return (
    <Container className="py-12 max-w-3xl text-left select-none">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="secondary"
          onClick={() => router.push("/volunteers")}
          className="flex items-center gap-1.5"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("backToList")}
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-4 mb-8">
        <Badge variant="accent">{t("successStory")}</Badge>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight leading-tight max-phone:text-2xl">
          {item.title}
        </h1>
        {/*
          Backend `VolunteerCaseDto` da ko'ngilli ismi va sana maydonlari YO'Q —
          faqat hudud bor, shuning uchun meta qatorida o'sha ko'rsatiladi.
        */}
        {item.region && (
          <div className="flex flex-wrap items-center gap-6 text-sm text-fg-muted font-medium pt-2 border-y border-border/40 py-3">
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4" />
              <span>
                {t("region")}: {item.region}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Showcase */}
      {item.mediaUrl && (
        <div className="mb-8">
          {item.mediaType === "video" ? (
            <VideoPlayer src={item.mediaUrl} title={item.title} />
          ) : (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border bg-surface-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {/* Description copy */}
      <div className="prose max-w-none text-fg-muted leading-relaxed whitespace-pre-line text-base max-phone:text-sm">
        {item.longDescription}
      </div>
    </Container>
  );
}
