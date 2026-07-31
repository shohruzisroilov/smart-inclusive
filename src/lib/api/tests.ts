import { cache } from "react";
import { type BaseContentItem } from "@/types/content";
import { type TestModel } from "@/types/test";
import { AUDIENCE_BOLALAR, AUDIENCE_OTA_ONALAR, STATE_ACTIVE } from "./constants";
import { testToContentItem, toTestModel } from "./mappers";
import { fetchContentItems, fetchTest, fetchTests } from "./services";
import { SECTION_CATEGORIES, type SectionKey } from "./content";
import type { TestDto } from "./types";

/**
 * Testlarni tanlash qatlami.
 *
 * `TestFilterParams` da faqat `languageId` bor — audiensiya yoki bog'langan
 * kontent bo'yicha filtr yo'q, shuning uchun ajratish shu yerda bajariladi.
 */

function isPublic(dto: TestDto): boolean {
  return dto.stateId === STATE_ACTIVE;
}

/**
 * Testda kamida bitta savol bo'lishi shart — bo'sh test saytda ochilsa,
 * vizard darhol «tugadi» holatiga tushib qolardi.
 */
function hasQuestions(dto: TestDto): boolean {
  return (dto.qustions?.length ?? 0) > 0;
}

/** Bolalar bo'limidagi barcha testlar. Lug'at testlari bu ro'yxatga kirmaydi. */
export const getKidsTests = cache(async (): Promise<BaseContentItem[]> => {
  const tests = await fetchTests();

  return tests
    .filter(isPublic)
    .filter(hasQuestions)
    .filter((test) => test.audienceId === AUDIENCE_BOLALAR)
    .filter((test) => test.vocabularyTopicId == null)
    .map((test) => testToContentItem(test, false));
});

/** «Ota-onalar uchun» testlari. */
export const getParentsTests = cache(async (): Promise<BaseContentItem[]> => {
  const tests = await fetchTests();

  return tests
    .filter(isPublic)
    .filter(hasQuestions)
    .filter((test) => test.audienceId === AUDIENCE_OTA_ONALAR)
    .filter((test) => test.vocabularyTopicId == null)
    .map((test) => testToContentItem(test, true));
});

/**
 * Bitta bo'limga tegishli testlar (masalan «Etiket bo'yicha vaziyatli testlar»).
 *
 * Test bo'limni bevosita bilmaydi — u `content_item_id` orqali kontentga,
 * kontent esa `category_id` orqali bo'limga bog'langan, shuning uchun bog'lanish
 * shu yerda ikki qadamda quriladi.
 */
export const getTestsForSection = cache(
  async (section: SectionKey): Promise<BaseContentItem[]> => {
    const [tests, items] = await Promise.all([fetchTests(), fetchContentItems()]);

    const categoryIds: readonly number[] = SECTION_CATEGORIES[section];
    const contentItemIds = new Set(
      items.filter((item) => categoryIds.includes(item.categoryId)).map((item) => item.id),
    );

    return tests
      .filter(isPublic)
      .filter(hasQuestions)
      .filter((test) => test.contentItemId != null && contentItemIds.has(test.contentItemId))
      .map((test) => testToContentItem(test, false));
  },
);

/**
 * Vizard uchun to'liq test modeli.
 *
 * Ro'yxat uchi savollarni ham qaytaradi, lekin bitta test uchun `Get/{id}` ni
 * chaqirish arzonroq va aniqroq — ro'yxat sahifalangan bo'lishi mumkin.
 */
export const getTestModel = cache(async (id: string): Promise<TestModel | null> => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return null;

  const dto = await fetchTest(numericId);
  if (!dto || !isPublic(dto) || !hasQuestions(dto)) return null;

  return toTestModel(dto);
});

/** Lug'at mavzusiga bog'langan test — `info_test.vocabulary_topic_id`. */
export const getVocabularyTest = cache(async (topicId: string): Promise<TestModel | null> => {
  const numericTopicId = Number(topicId);
  if (!Number.isInteger(numericTopicId)) return null;

  const tests = await fetchTests();
  const dto = tests
    .filter(isPublic)
    .filter(hasQuestions)
    .find((test) => test.vocabularyTopicId === numericTopicId);

  if (!dto) return null;

  // Ro'yxat javobida savollar to'liq kelmasligi mumkin, shuning uchun to'liq
  // yozuv alohida olinadi.
  const full = await fetchTest(dto.id);
  return full ? toTestModel(full) : toTestModel(dto);
});

/** Testi bor lug'at mavzularining id to'plami — ro'yxat kartochkasidagi bayroq uchun. */
export const getTopicIdsWithTest = cache(async (): Promise<Set<number>> => {
  const tests = await fetchTests();

  return new Set(
    tests
      .filter(isPublic)
      .filter(hasQuestions)
      .map((test) => test.vocabularyTopicId)
      .filter((id): id is number => id != null),
  );
});
