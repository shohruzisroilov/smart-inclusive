"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { ETIQUETTE_TEST_ITEMS } from "@/lib/mocks/kids-content";

export function EtiquetteTestsListClient() {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/tests/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList
        items={ETIQUETTE_TEST_ITEMS}
        onActionClick={handleAction}
      />
    </div>
  );
}
