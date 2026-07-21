"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { PARENT_TESTS_ITEMS } from "@/lib/mocks/parents-content";

export function ParentsTestsClient() {
  const router = useRouter();
  const [items] = useState<BaseContentItem[]>(PARENT_TESTS_ITEMS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const handleAction = (item: BaseContentItem) => {
    router.push(`/for-parents/tests/${item.id}`);
  };

  return (
    <div className="space-y-6 text-left select-none">
      <ContentList
        items={items}
        loading={loading}
        error={error}
        onRetry={() => {}}
        onActionClick={handleAction}
        actionText="Testni boshlash"
      />
    </div>
  );
}
