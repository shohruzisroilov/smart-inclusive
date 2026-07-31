"use client";

import { useRouter } from "@/i18n/navigation";
import { PagedReader } from "@/components/ui/PagedReader";
import { type ReadableView } from "@/lib/api/content";

interface EtiquetteReaderClientWrapperProps {
  comic: ReadableView;
}

export function EtiquetteReaderClientWrapper({ comic }: EtiquetteReaderClientWrapperProps) {
  const router = useRouter();

  return (
    <PagedReader
      id={comic.id}
      title={comic.title}
      pages={comic.pages}
      audioUrls={comic.audioUrls}
      testId={comic.testId}
      onBack={() => router.push("/etiquette")}
    />
  );
}
