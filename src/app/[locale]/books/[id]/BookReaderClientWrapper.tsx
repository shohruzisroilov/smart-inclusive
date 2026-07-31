"use client";

import { useRouter } from "@/i18n/navigation";
import { PagedReader } from "@/components/ui/PagedReader";
import { type ReadableView } from "@/lib/api/content";

interface BookReaderClientWrapperProps {
  book: ReadableView;
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
