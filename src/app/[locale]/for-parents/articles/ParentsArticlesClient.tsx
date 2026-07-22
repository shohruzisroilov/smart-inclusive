"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { PARENT_PLATFORM_ARTICLES } from "@/lib/mocks/parents-content";

export function ParentsArticlesClient() {
  const router = useRouter();
  const [items] = useState<BaseContentItem[]>(PARENT_PLATFORM_ARTICLES);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/articles/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList
        items={items}
        loading={loading}
        error={error}
        onRetry={() => {}}
        onActionClick={handleAction}
      />
    </div>
  );
}
