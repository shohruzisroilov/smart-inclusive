import { apiGet, apiPost } from './http'
import type {
  BookPageDto,
  ContactRequestDto,
  ContentItemDto,
  PaginatedResult,
  PlatformStatDto,
  SelectListItemDto,
  TestDto,
  VocabularyTopicDto,
  VolunteerApplicationDto,
  VolunteerCaseDto,
} from './types'
import {
  CONTACT_REQUEST_STATUS_NEW,
  CONTENT_STATUS_PUBLISHED,
  COUNTRY_UZBEKISTAN,
  STATE_ACTIVE,
  VOLUNTEER_APPLICATION_STATUS_NEW,
} from './constants'
import { normalizeMedia } from './files'

export const LIST_PAGE_SIZE = 200

/**
 * Kitob/komiks sahifalari uchun alohida, kattaroq limit — bekend `contentItemId`
 * bo'yicha filtrlay olmagani uchun butun ro'yxat olinadi.
 */
export const PAGE_LIST_SIZE = 1000

async function safeApiCall<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.warn('[api failure]', error)
    return fallback
  }
}

/**
 * Media maydonlarini yozuvlar ro'yxatida normalizatsiya qiladi.
 * Sabab va tafsilotlar — `files.ts`.
 */
function normalizeList<T>(items: T[]): T[] {
  return items.map((item) => normalizeMedia(item))
}

/**
 * Faqat yoqilgan yozuvlar. Bekend `GetList` javobida o'chirilgan (`stateId != 1`)
 * yozuvlarni ham qaytaradi — adminkada ular "Passive" ko'rinadi va saytga
 * chiqmasligi kerak.
 */
function activeOnly<T extends { stateId: number }>(items: T[]): T[] {
  return items.filter((item) => item.stateId === STATE_ACTIVE)
}

/**
 * Saytda kontent KO'RINISHINING yagona sharti (`constants.ts`, `enum_content_status`).
 *
 * Bekendda bunday filtr YO'Q — `ContentItemFilterParams` faqat `page/pageSize/search`
 * beradi, ya'ni `GetList` qoralama va moderatsiya kutayotgan yozuvlarni ham
 * qaytaradi. Ular shu yerda kesilmasa, adminkada hali tayyor bo'lmagan material
 * saytda ochiq turadi.
 */
function isPublished(item: ContentItemDto): boolean {
  return item.contentStatusId === CONTENT_STATUS_PUBLISHED && item.stateId === STATE_ACTIVE
}

/** Lug'at mavzusi ichidagi so'zlarning rasm/audio maydonlari ham yo'l saqlaydi. */
function normalizeTopic(topic: VocabularyTopicDto | null): VocabularyTopicDto | null {
  if (!topic) return null
  topic.vocabularyWords = normalizeList(topic.vocabularyWords ?? [])
  return topic
}

/** Savol va javob variantlarining rasmlari ham yo'l saqlaydi. */
function normalizeTest(test: TestDto | null): TestDto | null {
  if (!test) return null
  for (const question of test.qustions ?? []) {
    normalizeMedia(question)
    question.answerOptions = normalizeList(question.answerOptions ?? [])
  }
  return test
}

// ---------------------------------------------------------------------------
// ContentItem
// ---------------------------------------------------------------------------

export async function fetchContentItems(): Promise<ContentItemDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<ContentItemDto>>('/ContentItem/GetList', {
      page: 1,
      pageSize: LIST_PAGE_SIZE,
      sortBy: 'DESC',
    }),
    null,
  )
  return normalizeList((result?.rows ?? []).filter(isPublished))
}

/**
 * Bitta yozuv. E'lon qilinmagan yozuv uchun `null` qaytadi — ro'yxatda
 * ko'rinmaydigan material to'g'ridan-to'g'ri havola orqali ham ochilmasligi
 * kerak, aks holda qoralama URL'i bilan tarqalib ketardi.
 */
export async function fetchContentItemById(id: number): Promise<ContentItemDto | null> {
  const item = await safeApiCall(apiGet<ContentItemDto>(`/ContentItem/Get/${id}`), null)
  if (!item || !isPublished(item)) return null
  return normalizeMedia(item)
}

/**
 * DIQQAT — `BookPageFilterParams` va `ComicPageFilterParams` da `contentItemId`
 * maydoni YO'Q (`Search` faqat sarlavha va matn bo'yicha qidiradi), shuning
 * uchun bekend sahifalarni kontent bo'yicha filtrlab bera olmaydi. Ro'yxat
 * to'liq olinadi va shu yerda ajratiladi.
 */
export async function fetchBookPages(contentItemId: number): Promise<BookPageDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<BookPageDto>>('/BookPage/GetList', {
      page: 1,
      pageSize: PAGE_LIST_SIZE,
      sortBy: 'ASC',
    }),
    null,
  )
  return normalizeList(
    activeOnly(result?.rows ?? [])
      .filter((page) => page.contentItemId === contentItemId)
      .sort((a, b) => a.pageNumber - b.pageNumber),
  )
}

/*
 * KOMIKS SAHIFALARI — bu yerda ataylab YO'Q.
 *
 * `ComicPageController` da `[AllowAnonymous]` yo'q, ya'ni `/ComicPage/GetList`
 * saytga har doim 401 qaytaradi. Sahifama-sahifa komiks o'quvchisi shu sababli
 * olib tashlandi; komikslar `pdfFileUrl` orqali o'qiladi (`PdfReader.vue`).
 * Bekendga `[AllowAnonymous]` qo'shilsa, `fetchBookPages` ning aynan nusxasini
 * qaytarish kifoya.
 */

// ---------------------------------------------------------------------------
// PlatformStat
// ---------------------------------------------------------------------------

/** Bosh sahifadagi «ishonch raqamlari». Bo'sh bo'lsa blok umuman chizilmaydi. */
export async function fetchPlatformStats(): Promise<PlatformStatDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<PlatformStatDto>>('/PlatformStat/GetList', {
      page: 1,
      pageSize: 50,
    }),
    null,
  )
  return activeOnly(result?.rows ?? [])
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export async function fetchVocabularyTopics(): Promise<VocabularyTopicDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<VocabularyTopicDto>>('/VocabularyTopic/GetList', {
      page: 1,
      pageSize: 100,
    }),
    null,
  )
  return activeOnly(result?.rows ?? []).map((topic) => normalizeTopic(topic)!)
}

export async function fetchVocabularyTopicById(id: number): Promise<VocabularyTopicDto | null> {
  return normalizeTopic(
    await safeApiCall(apiGet<VocabularyTopicDto>(`/VocabularyTopic/Get/${id}`), null),
  )
}

// ---------------------------------------------------------------------------
// Volunteers
// ---------------------------------------------------------------------------

export async function fetchVolunteerCases(): Promise<VolunteerCaseDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<VolunteerCaseDto>>('/VolunteerCase/GetList', {
      page: 1,
      pageSize: 100,
    }),
    null,
  )
  return normalizeList(activeOnly(result?.rows ?? []).sort((a, b) => a.sortOrder - b.sortOrder))
}

export async function fetchVolunteerCaseById(id: number): Promise<VolunteerCaseDto | null> {
  return normalizeMedia(await safeApiCall(apiGet<VolunteerCaseDto>(`/VolunteerCase/Get/${id}`), null))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

export async function fetchTests(): Promise<TestDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<TestDto>>('/Test/GetList', {
      page: 1,
      pageSize: 100,
    }),
    null,
  )
  return (result?.rows ?? []).map((test) => normalizeTest(test)!)
}

export async function fetchTestById(id: number): Promise<TestDto | null> {
  return normalizeTest(await safeApiCall(apiGet<TestDto>(`/Test/Get/${id}`), null))
}

// ---------------------------------------------------------------------------
// SelectList (Regions)
// ---------------------------------------------------------------------------

/**
 * DIQQAT — to'g'ri uch `/SelectList/RegionSelectList/{countryId}`, `/SelectList/Region`
 * emas. `countryId` majburiy yo'l parametri.
 */
export async function fetchRegions(
  countryId: number = COUNTRY_UZBEKISTAN,
): Promise<SelectListItemDto[]> {
  const list = await safeApiCall(
    apiGet<SelectListItemDto[]>(`/SelectList/RegionSelectList/${countryId}`),
    [],
  )
  return Array.isArray(list) ? list : []
}

// ---------------------------------------------------------------------------
// Write Endpoints
// ---------------------------------------------------------------------------

export interface ContactRequestInput {
  fullName: string;
  phone: string;
  message: string;
}

export async function createContactRequest(input: ContactRequestInput): Promise<number> {
  const dto: ContactRequestDto = {
    id: 0,
    fullName: input.fullName,
    phone: input.phone,
    message: input.message,
    responseNote: null,
    statusId: CONTACT_REQUEST_STATUS_NEW,
    stateId: STATE_ACTIVE,
  }

  return apiPost<number>('/ContactRequest/Create', dto)
}

export interface VolunteerApplicationInput {
  fullName: string;
  phone: string;
  regionId: number;
  email?: string | null;
  age?: number | null;
  message?: string | null;
}

export async function createVolunteerApplication(
  input: VolunteerApplicationInput,
): Promise<number> {
  const dto: VolunteerApplicationDto = {
    id: 0,
    fullName: input.fullName,
    phone: input.phone,
    email: input.email ?? null,
    age: input.age ?? null,
    message: input.message ?? null,
    adminComment: null,
    regionId: input.regionId,
    statusId: VOLUNTEER_APPLICATION_STATUS_NEW,
    stateId: STATE_ACTIVE,
  }

  return apiPost<number>('/VolunteerApplication/Create', dto)
}
