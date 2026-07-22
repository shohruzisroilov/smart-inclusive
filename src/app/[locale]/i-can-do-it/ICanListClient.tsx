"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { I_CAN_VIDEOS } from "@/lib/mocks/kids-content";

export function ICanListClient() {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/i-can-do-it/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList
        items={I_CAN_VIDEOS}
        onActionClick={handleAction}
      />
    </div>
  );
}
