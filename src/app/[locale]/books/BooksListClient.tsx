"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";
import { BOOKS } from "@/lib/mocks/kids-content";

export function BooksListClient() {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/books/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList
        items={BOOKS}
        onActionClick={handleAction}
      />
    </div>
  );
}
