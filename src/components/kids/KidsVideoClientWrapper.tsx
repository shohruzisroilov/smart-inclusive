"use client";

import { useRouter } from "@/i18n/navigation";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

interface KidsVideoClientWrapperProps {
  /**
   * Minimal shakl: pleyerga faqat manba va sarlavha kerak. Chaqiruvchi sahifa
   * `videoUrl` ning MAVJUDLIGINI oldindan tekshiradi (`youtube_url` bo'sh
   * kontent uchun sahifa 404 beradi).
   */
  video: { title: string; videoUrl: string };
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
