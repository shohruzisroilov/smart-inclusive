import { cache } from "react";
import { STATE_ACTIVE } from "./constants";
import { toFileUrl } from "./files";
import {
  toVocabularyTopicView,
  toVocabularyWordViews,
  type VocabularyTopicView,
  type VocabularyWordView,
} from "./mappers";
import { fetchVocabularyTopic, fetchVocabularyTopics, fetchTest, fetchTests } from "./services";
import type { TestDto, VocabularyTopicDto } from "./types";

/**
 * Lug'at bo'limi.
 *
 * Backendda mavzu va uning so'zlari BITTA javobda keladi
 * (`VocabularyTopicDto.vocabularyWords`), shuning uchun so'zlar uchun alohida
 * uch chaqirilmaydi.
 */

function isPublic(dto: VocabularyTopicDto): boolean {
  return dto.stateId === STATE_ACTIVE;
}

/** Testi bor mavzular — ro'yxat kartochkasidagi «test bor» bayrog'i uchun. */
const topicIdsWithTest = cache(async (): Promise<Set<number>> => {
  const tests = await fetchTests();

  return new Set(
    tests
      .filter((test) => test.stateId === STATE_ACTIVE)
      .filter((test) => (test.qustions?.length ?? 0) > 0)
      .map((test) => test.vocabularyTopicId)
      .filter((id): id is number => id != null),
  );
});

export const getVocabularyTopics = cache(async (): Promise<VocabularyTopicView[]> => {
  const [topics, withTest] = await Promise.all([fetchVocabularyTopics(), topicIdsWithTest()]);

  return topics
    .filter(isPublic)
    // So'zi yo'q mavzu saytda bo'sh slaydshou ochardi.
    .filter((topic) => (topic.vocabularyWords?.length ?? 0) > 0)
    .map((topic) => toVocabularyTopicView(topic, withTest));
});

export interface VocabularyTopicDetail {
  topic: VocabularyTopicView;
  words: VocabularyWordView[];
}

export const getVocabularyTopicDetail = cache(
  async (topicId: string): Promise<VocabularyTopicDetail | null> => {
    const numericId = Number(topicId);
    if (!Number.isInteger(numericId)) return null;

    const [dto, withTest] = await Promise.all([
      fetchVocabularyTopic(numericId),
      topicIdsWithTest(),
    ]);

    if (!dto || !isPublic(dto)) return null;

    const words = toVocabularyWordViews(dto);
    if (words.length === 0) return null;

    return { topic: toVocabularyTopicView(dto, withTest), words };
  },
);

// ---------------------------------------------------------------------------
// Lug'at testi
// ---------------------------------------------------------------------------

/**
 * Lug'at testi savolining shakli — «so'z aytiladi, rasm tanlanadi».
 *
 * Umumiy `TestModel` dan farqi shunda: variantlar matn emas, RASM. Backendda bu
 * farq `TestAnswerOptionDto.imageUrl` + `imageCaption` orqali ifodalanadi.
 */
export interface VocabularyTestQuestionView {
  id: string;
  questionWord: string;
  options: { imageUrl: string; label: string }[];
  correctOptionIndex: number;
}

export interface VocabularyTestView {
  topicId: string;
  topicTitle: string;
  questions: VocabularyTestQuestionView[];
}

export const getVocabularyTest = cache(
  async (topicId: string): Promise<VocabularyTestView | null> => {
    const numericTopicId = Number(topicId);
    if (!Number.isInteger(numericTopicId)) return null;

    const [detail, tests] = await Promise.all([
      getVocabularyTopicDetail(topicId),
      fetchTests(),
    ]);
    if (!detail) return null;

    const summary = tests
      .filter((test) => test.stateId === STATE_ACTIVE)
      .find((test) => test.vocabularyTopicId === numericTopicId);
    if (!summary) return null;

    // Ro'yxat javobida savollar to'liq bo'lmasligi mumkin — to'liq yozuv olinadi.
    const dto = (await fetchTest(summary.id)) ?? summary;
    const questions = toVocabularyQuestions(dto);
    if (questions.length === 0) return null;

    return { topicId, topicTitle: detail.topic.title, questions };
  },
);

function toVocabularyQuestions(dto: TestDto): VocabularyTestQuestionView[] {
  return [...(dto.qustions ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((question) => {
      const options = [...(question.answerOptions ?? [])].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );

      return {
        id: String(question.id),
        questionWord: question.text ?? "",
        options: options.map((option) => ({
          imageUrl: toFileUrl(option.imageUrl) ?? "",
          // Javobdan keyin ko'rsatiladigan izoh; `imageCaption` bo'sh bo'lsa
          // oddiy matn ishlatiladi.
          label: option.imageCaption ?? option.text ?? "",
        })),
        correctOptionIndex: options.findIndex((option) => option.isCorrect),
      };
    })
    // Rasmi yo'q variantli savol o'yin sifatida ma'nosiz — o'tkazib yuboriladi.
    .filter((question) => question.options.every((option) => option.imageUrl !== ""));
}
