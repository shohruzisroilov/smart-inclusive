"use client";

import { useRouter } from "@/i18n/navigation";
import { ContentList } from "@/components/ui/ContentList";
import { type BaseContentItem } from "@/types/content";

interface BooksListClientProps {
  /** Server komponentida API dan olinadi (`getSectionContent("books", ...)`). */
  items: BaseContentItem[];
}

export function BooksListClient({ items }: BooksListClientProps) {
  const router = useRouter();

  const handleAction = (item: BaseContentItem) => {
    router.push(`/books/${item.id}`);
  };

  return (
    <div className="text-left select-none">
      <ContentList items={items} onActionClick={handleAction} />
    </div>
  );
}
