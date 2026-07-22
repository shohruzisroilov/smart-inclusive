import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { VOCABULARY_TOPICS, VOCABULARY_TESTS } from "@/lib/mocks/vocabulary";
import { VocabularyTestClientWrapper } from "./VocabularyTestClientWrapper";

interface VocabularyTestProps {
  params: Promise<{ locale: string; topicId: string }>;
}

export default async function VocabularyTestPage({ params }: VocabularyTestProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);
  const tv = await getTranslations("vocab");

  const topic = VOCABULARY_TOPICS.find((t) => t.id === topicId);
  const test = VOCABULARY_TESTS[topicId];

  if (!topic || !test) {
    notFound();
  }

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{tv("testEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">
          {tv("testTitle", { title: topic.title })}
        </h1>
      </div>

      <VocabularyTestClientWrapper
        topicId={topicId}
        topicTitle={topic.title}
        questions={test.questions}
      />
    </Container>
  );
}
