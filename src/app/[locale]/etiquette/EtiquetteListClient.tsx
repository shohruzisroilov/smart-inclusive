"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface EtiquetteListClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("etiquette", ...)`). */
  items: BaseContentItem[];
}

export function EtiquetteListClient({ items }: EtiquetteListClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/etiquette/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
