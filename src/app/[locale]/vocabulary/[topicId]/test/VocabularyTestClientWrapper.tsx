"use client";

import { useRouter } from "@/i18n/navigation";
import { VocabularyTestWizard } from "@/components/wizards/VocabularyTestWizard";
import { type VocabularyTestQuestionView } from "@/lib/api/vocabulary";

interface VocabularyTestClientWrapperProps {
  topicId: string;
  topicTitle: string;
  questions: VocabularyTestQuestionView[];
}

export function VocabularyTestClientWrapper({
  topicId,
  topicTitle,
  questions,
}: VocabularyTestClientWrapperProps) {
  const router = useRouter();

  return (
    <VocabularyTestWizard
      topicId={topicId}
      topicTitle={topicTitle}
      questions={questions}
      onClose={() => router.push("/vocabulary")}
    />
  );
}
