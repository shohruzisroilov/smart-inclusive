import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { VocabularyListClient } from "./VocabularyListClient";
import { LanguagesIcon } from "lucide-react";

interface VocabularyIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function VocabularyIndexPage({ params }: VocabularyIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("vocab");

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl flex items-center gap-2">
          <LanguagesIcon className="h-8 w-8 text-brand" />
          {t("title")}
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {t("subtitle")}
        </p>
      </div>

      <VocabularyListClient />
    </Container>
  );
}
