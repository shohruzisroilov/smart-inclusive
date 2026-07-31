"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ParentsVideosClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("parentVideos", ...)`). */
  items: BaseContentItem[];
}

export function ParentsVideosClient({ items }: ParentsVideosClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/videos/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
