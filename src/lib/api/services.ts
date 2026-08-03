import { apiGet, apiPost } from './http'
import type {
  BookPageDto,
  ComicPageDto,
  ContactRequestDto,
  ContentItemDto,
  PaginatedResult,
  PlatformStatDto,
  SelectListItemDto,
  SlideDto,
  TestDto,
  VocabularyTopicDto,
  VolunteerApplicationDto,
  VolunteerCaseDto,
} from './types'
import {
  CONTACT_REQUEST_STATUS_NEW,
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
  return normalizeList(result?.rows ?? [])
}

export async function fetchContentItemById(id: number): Promise<ContentItemDto | null> {
  return normalizeMedia(await safeApiCall(apiGet<ContentItemDto>(`/ContentItem/Get/${id}`), null))
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
    (result?.rows ?? [])
      .filter((page) => page.contentItemId === contentItemId)
      .sort((a, b) => a.pageNumber - b.pageNumber),
  )
}

/**
 * `ComicPageController` da `[AllowAnonymous]` YO'Q — jonli API bu so'rovga 401
 * qaytaradi va komiks sahifalari bo'sh chiqadi. Bekendga `[AllowAnonymous]`
 * qo'shilishi kerak (`BookPage` va `ContentItem` da bor).
 */
export async function fetchComicPages(contentItemId: number): Promise<ComicPageDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<ComicPageDto>>('/ComicPage/GetList', {
      page: 1,
      pageSize: PAGE_LIST_SIZE,
      sortBy: 'ASC',
    }),
    null,
  )
  return normalizeList(
    (result?.rows ?? [])
      .filter((page) => page.contentItemId === contentItemId)
      .sort((a, b) => a.pageNumber - b.pageNumber),
  )
}

// ---------------------------------------------------------------------------
// PlatformStat & Slides
// ---------------------------------------------------------------------------

export async function fetchPlatformStats(): Promise<PlatformStatDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<PlatformStatDto>>('/PlatformStat/GetList', {
      page: 1,
      pageSize: 50,
    }),
    null,
  )
  return result?.rows ?? []
}

/**
 * DIQQAT — `WizardSlide` degan kontroller bekendda YO'Q; to'g'ri uch `/Slide`.
 * `SlideFilterParams` da `ScenarioId` bor, ya'ni filtr server tomonda ishlaydi.
 *
 * Lekin `SlideController` da `[AllowAnonymous]` YO'Q — jonli API 401 qaytaradi
 * va vizard slaydlari bo'sh chiqadi. Bekendga `[AllowAnonymous]` kerak.
 */
export async function fetchWizardSlides(scenarioId: number): Promise<SlideDto[]> {
  const result = await safeApiCall(
    apiPost<PaginatedResult<SlideDto>>('/Slide/GetList', {
      page: 1,
      pageSize: LIST_PAGE_SIZE,
      sortBy: 'ASC',
      scenarioId,
    }),
    null,
  )
  return normalizeList((result?.rows ?? []).filter((slide) => slide.stateId === STATE_ACTIVE))
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
  return (result?.rows ?? []).map((topic) => normalizeTopic(topic)!)
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
  return normalizeList(result?.rows ?? [])
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
