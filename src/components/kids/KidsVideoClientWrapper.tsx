"use client";

import { useRouter } from "@/i18n/navigation";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { type KidsVideo } from "@/lib/mocks/kids-content";

interface KidsVideoClientWrapperProps {
  video: KidsVideo;
  /** Ro'yxatga qaytish yo'li (masalan "/lessons"). */
  backHref: string;
}

export function KidsVideoClientWrapper({ video, backHref }: KidsVideoClientWrapperProps) {
  const router = useRouter();

  return (
    <VideoPlayer
      src={video.videoUrl}
      title={video.title}
      onBack={() => router.push(backHref)}
    />
  );
}
