"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { PARENT_VIDEOS } from "@/lib/mocks/parents-content";

export function ParentsVideosClient() {
  const router = useRouter();
  const [items] = useState<BaseContentItem[]>(PARENT_VIDEOS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/videos/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList
        items={items}
        loading={loading}
        error={error}
        onRetry={() => {}}
        onActionClick={handleAction}
        actionText="Videoni tomosha qilish"
      />
    </div>
  );
}
