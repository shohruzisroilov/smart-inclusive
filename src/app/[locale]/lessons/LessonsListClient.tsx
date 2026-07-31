"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface LessonsListClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("lessons", ...)`). */
  items: BaseContentItem[];
}

export function LessonsListClient({ items }: LessonsListClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/lessons/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
