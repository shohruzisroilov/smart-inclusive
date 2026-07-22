"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { LESSON_VIDEOS } from "@/lib/mocks/kids-content";

export function LessonsListClient() {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/lessons/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList
        items={LESSON_VIDEOS}
        onActionClick={handleAction}
      />
    </div>
  );
}
