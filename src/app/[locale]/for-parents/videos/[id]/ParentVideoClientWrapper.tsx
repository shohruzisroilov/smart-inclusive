"use client";

import { useRouter } from "@/i18n/navigation";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { type ParentVideo } from "@/lib/mocks/parents-content";

interface ParentVideoClientWrapperProps {
  video: ParentVideo;
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
