"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ParentsTestsClientProps {
  /** Server komponentida API dan olinadi (`getParentsTests()`). */
  items: BaseContentItem[];
}

export function ParentsTestsClient({ items }: ParentsTestsClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/tests/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
