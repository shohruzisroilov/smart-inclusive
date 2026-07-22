"use client";

import { useRouter } from "@/i18n/navigation";
import { PagedReader } from "@/components/ui/PagedReader";
import { type KidsReadable } from "@/lib/mocks/kids-content";

interface BookReaderClientWrapperProps {
  book: KidsReadable;
}

export function BookReaderClientWrapper({ book }: BookReaderClientWrapperProps) {
  const router = useRouter();

  return (
    <PagedReader
      id={book.id}
      title={book.title}
      pages={book.pages}
      audioUrls={book.audioUrls}
      testId={book.testId}
      onBack={() => router.push("/books")}
    />
  );
}
