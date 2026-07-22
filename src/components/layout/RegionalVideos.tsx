"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PlayIcon, MapPinIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Link } from "@/i18n/navigation";

interface RegionalVideo {
  id: string;
  title: string;
  region: string;
  description: string;
  videoUrl: string;
  thumbnailColor: string; // vector placeholder background color
}

export function RegionalVideos() {
  const t = useTranslations("home");
  const tp = useTranslations("player");
  const tc = useTranslations("common");
  const [activeVideo, setActiveVideo] = useState<RegionalVideo | null>(null);

  const REGIONAL_VIDEOS: RegionalVideo[] = [
    {
      id: "story-tashkent",
      title: t("story1Title"),
      region: t("story1Region"),
      description: t("story1Desc"),
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailColor: "from-brand/20 to-brand/40",
    },
    {
      id: "story-samarkand",
      title: t("story2Title"),
      region: t("story2Region"),
      description: t("story2Desc"),
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnailColor: "from-accent/20 to-accent/40",
    },
    {
      id: "story-fergana",
      title: t("story3Title"),
      region: t("story3Region"),
      description: t("story3Desc"),
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailColor: "from-status-info/20 to-status-info/40",
    },
  ];

  return (
    <section className="py-16 bg-surface" aria-labelledby="videos-heading">
      <Container>
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10 border-b border-border/50 pb-6">
          <div>
            <h2 id="videos-heading" className="text-3xl font-extrabold text-fg font-display tracking-tight max-phone:text-2xl">
              {t("videosHeading")}
            </h2>
            <p className="mt-2 text-base text-fg-muted max-w-xl">
              {t("videosDesc")}
            </p>
          </div>
          <Link href="/volunteers" className={cn(buttonStyles({ variant: "secondary", size: "md" }), "max-phone:w-full")}>
            {t("videosAll")}
          </Link>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
          {REGIONAL_VIDEOS.map((video) => (
            <Card key={video.id} className="h-full flex flex-col">
              {/* Thumbnail Container */}
              <div
                className={cn(
                  "relative aspect-video w-full rounded-t-xl bg-gradient-to-br flex items-center justify-center cursor-pointer overflow-hidden group select-none",
                  video.thumbnailColor
                )}
                onClick={() => setActiveVideo(video)}
              >
                {/* SVG Backdrop styling */}
                <div className="absolute inset-0 bg-surface-inverse/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Map Badge */}
                <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-fg flex items-center gap-1 shadow-sm">
                  <MapPinIcon className="h-3.5 w-3.5 text-brand" />
                  {video.region}
                </div>

                {/* Big Accessible Play Button overlay */}
                <button
                  type="button"
                  aria-label={t("watchVideo", { title: video.title })}
                  className={cn(
                    "tap-target w-14 h-14 rounded-full bg-surface/90 text-brand flex items-center justify-center shadow-md",
                    "transition-all duration-[var(--duration-base)] group-hover:scale-110 group-hover:bg-brand group-hover:text-fg-on-brand",
                    "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
                  )}
                >
                  <PlayIcon className="h-6 w-6 fill-current" aria-hidden="true" />
                </button>
              </div>

              {/* Card Meta Content */}
              <CardHeader className="border-none pb-0 pt-5">
                <h3 className="text-lg font-bold text-fg font-display">
                  {video.title}
                </h3>
              </CardHeader>
              <CardContent className="pt-2 text-sm text-fg-muted leading-relaxed">
                {video.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>

      {/* Dynamic Accessible Portal Video Modal */}
      <Modal
        isOpen={activeVideo !== null}
        onClose={() => setActiveVideo(null)}
        title={activeVideo?.title}
        className="max-w-4xl w-[95vw]"
      >
        {activeVideo && (
          <div className="space-y-4">
            {/* HTML5 video element with standard controls */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-border shadow-md flex items-center justify-center">
              {activeVideo.videoUrl ? (
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  aria-label={activeVideo.title}
                >
                  {tp("unsupported")}
                </video>
              ) : (
                <div className="text-center p-6 text-fg-muted/60 space-y-2">
                  <PlayIcon className="h-12 w-12 mx-auto opacity-35" />
                  <p className="text-base font-semibold">{tp("unavailable")}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="secondary" size="md" onClick={() => setActiveVideo(null)}>
                {tc("close")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// Quick fallback helper
import { cn } from "@/lib/utils/cn";
import { buttonStyles } from "@/components/ui/Button";
