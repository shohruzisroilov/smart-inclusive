"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface EtiquetteTestsListClientProps {
  /** Server komponentida API dan olinadi (`getTestsForSection("etiquette", ...)`). */
  items: BaseContentItem[];
}

export function EtiquetteTestsListClient({ items }: EtiquetteTestsListClientProps) {
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
