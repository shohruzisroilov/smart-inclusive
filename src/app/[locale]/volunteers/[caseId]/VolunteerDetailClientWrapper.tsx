"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeftIcon, CalendarIcon, UserIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ErrorState } from "@/components/ui/ErrorState";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { MOCK_VOLUNTEER_HUB } from "@/lib/mocks/volunteers-about";

interface VolunteerDetailClientWrapperProps {
  caseId: string;
}

export function VolunteerDetailClientWrapper({ caseId }: VolunteerDetailClientWrapperProps) {
  const router = useRouter();
  const item = MOCK_VOLUNTEER_HUB.cases.find((c) => c.id === caseId);

  if (!item) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Topilmadi"
          description="Tafsilotlar topilmadi."
          action={
            <Button onClick={() => router.push("/volunteers")}>
              Ko&apos;ngillilar ro&apos;yxatiga qaytish
            </Button>
          }
        />
      </Container>
    );
  }

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
          Ko&apos;ngillilar ro&apos;yxatiga qaytish
        </Button>
      </div>

      {/* Title */}
      <div className="space-y-4 mb-8">
        <Badge variant="accent">Muvaffaqiyat tarixi</Badge>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight leading-tight max-phone:text-2xl">
          {item.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-fg-muted font-medium pt-2 border-y border-border/40 py-3">
          <div className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            <span>
              {item.volunteerName} ({item.volunteerTitle})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            <span>{item.date}</span>
          </div>
        </div>
      </div>

      {/* Visual Showcase */}
      <div className="mb-8">
        {item.mediaType === "video" && item.mediaUrl ? (
          <VideoPlayer src={item.mediaUrl} title={item.title} />
        ) : (
          item.imageUrl && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border bg-surface-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )
        )}
      </div>

      {/* Description copy */}
      <div className="prose max-w-none text-fg-muted leading-relaxed whitespace-pre-line text-base max-phone:text-sm">
        {item.longDescription}
      </div>
    </Container>
  );
}
