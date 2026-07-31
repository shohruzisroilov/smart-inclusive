"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface TestsListClientProps {
  /** Server komponentida API dan olinadi (`getKidsTests(...)`). */
  items: BaseContentItem[];
}

export function TestsListClient({ items }: TestsListClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/tests/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
