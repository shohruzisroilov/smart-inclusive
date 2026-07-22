"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { ETIQUETTE_COMICS } from "@/lib/mocks/kids-content";

export function EtiquetteListClient() {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/etiquette/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList
        items={ETIQUETTE_COMICS}
        onActionClick={handleAction}
      />
    </div>
  );
}
