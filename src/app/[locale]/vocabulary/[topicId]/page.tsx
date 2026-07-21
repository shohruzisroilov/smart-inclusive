import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { VOCABULARY_TOPICS, VOCABULARY_WORDS } from "@/lib/mocks/vocabulary";
import { WordSlideshowClient } from "./WordSlideshowClient";

interface VocabularyTopicProps {
  params: Promise<{ locale: string; topicId: string }>;
}

export default async function VocabularyTopicPage({ params }: VocabularyTopicProps) {
  const { locale, topicId } = await params;
  setRequestLocale(locale);

  const topic = VOCABULARY_TOPICS.find((t) => t.id === topicId);
  const words = VOCABULARY_WORDS[topicId];

  if (!topic || !words) {
    notFound();
  }

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 flex items-center justify-between select-none">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider block">Lugʻat oʻrganish</span>
          <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
            {topic.title}
          </h1>
        </div>
        <Badge variant="brand">{topic.language.toUpperCase()}</Badge>
      </div>

      <WordSlideshowClient
        topicId={topicId}
        words={words}
        hasTest={topic.hasTest}
      />
    </Container>
  );
}
