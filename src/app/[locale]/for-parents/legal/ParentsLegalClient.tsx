"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ParentsLegalClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("legal", ...)`). */
  items: BaseContentItem[];
}

export function ParentsLegalClient({ items }: ParentsLegalClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/legal/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
