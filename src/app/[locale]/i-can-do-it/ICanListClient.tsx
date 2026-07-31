"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface ICanListClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("iCanDoIt", ...)`). */
  items: BaseContentItem[];
}

export function ICanListClient({ items }: ICanListClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/i-can-do-it/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
