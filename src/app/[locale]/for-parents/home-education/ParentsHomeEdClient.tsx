"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ParentsHomeEdClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("homeEducation", ...)`). */
  items: BaseContentItem[];
}

export function ParentsHomeEdClient({ items }: ParentsHomeEdClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/home-education/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
