import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getVocabularyTest } from "@/lib/api/vocabulary";
import { VocabularyTestClientWrapper } from "./VocabularyTestClientWrapper";

interface VocabularyTestProps {
  params: Promise<{ locale: string; topicId: string }>;
}

export default async function VocabularyTestPage({ params }: VocabularyTestProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);
  const tv = await getTranslations("vocab");

  const test = await getVocabularyTest(topicId);
  if (!test) {
    notFound();
  }

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{tv("testEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">
          {tv("testTitle", { title: test.topicTitle })}
        </h1>
      </div>

      <VocabularyTestClientWrapper
        topicId={topicId}
        topicTitle={test.topicTitle}
        questions={test.questions}
      />
    </Container>
  );
}
