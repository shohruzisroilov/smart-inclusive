"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ParentsArticlesClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("articles", ...)`). */
  items: BaseContentItem[];
}

export function ParentsArticlesClient({ items }: ParentsArticlesClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/articles/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
