"use client";

import { useRouter } from "@/i18n/navigation";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
interface ParentVideoClientWrapperProps {
  /** Pleyerga faqat manba va sarlavha kerak — sahifa `videoUrl` ni tekshiradi. */
  video: { title: string; videoUrl: string };
}

export function ParentVideoClientWrapper({ video }: ParentVideoClientWrapperProps) {
  const router = useRouter();

  return (
    <VideoPlayer
      src={video.videoUrl}
      title={video.title}
      onBack={() => router.push("/for-parents/videos")}
    />
  );
}
