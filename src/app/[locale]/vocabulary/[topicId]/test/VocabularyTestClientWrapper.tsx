"use client";

import { useRouter } from "@/i18n/navigation";
import { VocabularyTestWizard } from "@/components/wizards/VocabularyTestWizard";
import { type VocabularyTestQuestion } from "@/lib/mocks/vocabulary";

interface VocabularyTestClientWrapperProps {
  topicId: string;
  topicTitle: string;
  questions: VocabularyTestQuestion[];
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
