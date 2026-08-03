import { fetchContentItems, fetchTests, fetchTestById } from './services'
import { AUDIENCE_BOLALAR, AUDIENCE_OTA_ONALAR, STATE_ACTIVE } from './constants'
import type { TestDto } from './types'

/**
 * Testlarni tanlash qatlami.
 *
 * `TestFilterParams` da faqat `languageId` bor — audiensiya yoki bog'langan
 * kontent bo'yicha filtr yo'q, shuning uchun ajratish shu yerda bajariladi.
 */

function isPublic(dto: TestDto): boolean {
  return dto.stateId === STATE_ACTIVE
}

/**
 * Testda kamida bitta savol bo'lishi shart — bo'sh test saytda ochilsa,
 * vizard darhol «tugadi» holatiga tushib qolardi.
 */
function hasQuestions(dto: TestDto): boolean {
  return (dto.qustions?.length ?? 0) > 0
}

/** Bolalar bo'limidagi barcha testlar. Lug'at testlari bu ro'yxatga kirmaydi. */
export async function getKidsTests(): Promise<TestDto[]> {
  const tests = await fetchTests()
  return tests
    .filter(isPublic)
    .filter(hasQuestions)
    .filter((test) => test.audienceId === AUDIENCE_BOLALAR)
    .filter((test) => test.vocabularyTopicId == null)
}

/** «Ota-onalar uchun» testlari. */
export async function getParentsTests(): Promise<TestDto[]> {
  const tests = await fetchTests()
  return tests
    .filter(isPublic)
    .filter(hasQuestions)
    .filter((test) => test.audienceId === AUDIENCE_OTA_ONALAR)
    .filter((test) => test.vocabularyTopicId == null)
}

/**
 * Bitta bo'limga tegishli testlar (masalan «Etiket bo'yicha vaziyatli testlar»).
 *
 * Test bo'limni bevosita bilmaydi — u `contentItemId` orqali kontentga, kontent
 * esa `categoryId` orqali bo'limga bog'langan, shuning uchun bog'lanish shu
 * yerda ikki qadamda quriladi.
 */
export async function getTestsForCategories(categoryIds: readonly number[]): Promise<TestDto[]> {
  const [tests, items] = await Promise.all([fetchTests(), fetchContentItems()])

  const contentItemIds = new Set(
    items.filter((item) => categoryIds.includes(item.categoryId)).map((item) => item.id),
  )

  return tests
    .filter(isPublic)
    .filter(hasQuestions)
    .filter((test) => test.contentItemId != null && contentItemIds.has(test.contentItemId))
}

/** Lug'at mavzusiga bog'langan test — `info_test.vocabulary_topic_id`. */
export async function getVocabularyTest(topicId: number): Promise<TestDto | null> {
  if (!Number.isInteger(topicId)) return null

  const tests = await fetchTests()
  const dto = tests
    .filter(isPublic)
    .filter(hasQuestions)
    .find((test) => test.vocabularyTopicId === topicId)

  if (!dto) return null

  // Ro'yxat javobida savollar to'liq kelmasligi mumkin, shuning uchun to'liq
  // yozuv alohida olinadi.
  const full = await fetchTestById(dto.id)
  return full ?? dto
}

/** Testi bor lug'at mavzularining id to'plami — ro'yxat kartochkasidagi bayroq uchun. */
export async function getTopicIdsWithTest(): Promise<Set<number>> {
  const tests = await fetchTests()
  return new Set(
    tests
      .filter(isPublic)
      .filter(hasQuestions)
      .map((test) => test.vocabularyTopicId)
      .filter((id): id is number => id != null),
  )
}
