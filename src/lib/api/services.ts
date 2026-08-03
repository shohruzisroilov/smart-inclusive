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
  STATE_ACTIVE,
  VOLUNTEER_APPLICATION_STATUS_NEW,
} from './constants'

export const LIST_PAGE_SIZE = 200

async function safeApiCall<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.warn('[api failure]', error)
    return fallback
  }
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
  return result?.rows ?? []
}

export async function fetchContentItemById(id: number): Promise<ContentItemDto | null> {
  return safeApiCall(apiGet<ContentItemDto>(`/ContentItem/Get/${id}`), null)
}

export async function fetchBookPages(contentItemId: number): Promise<BookPageDto[]> {
  const list = await safeApiCall(apiGet<BookPageDto[]>(`/BookPage/GetList/${contentItemId}`), [])
  return Array.isArray(list) ? list : []
}

export async function fetchComicPages(contentItemId: number): Promise<ComicPageDto[]> {
  const list = await safeApiCall(apiGet<ComicPageDto[]>(`/ComicPage/GetList/${contentItemId}`), [])
  return Array.isArray(list) ? list : []
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

export async function fetchWizardSlides(scenarioId: number): Promise<SlideDto[]> {
  const list = await safeApiCall(apiGet<SlideDto[]>(`/WizardSlide/GetList/${scenarioId}`), [])
  return Array.isArray(list) ? list : []
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
  return result?.rows ?? []
}

export async function fetchVocabularyTopicById(id: number): Promise<VocabularyTopicDto | null> {
  return safeApiCall(apiGet<VocabularyTopicDto>(`/VocabularyTopic/Get/${id}`), null)
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
  return result?.rows ?? []
}

export async function fetchVolunteerCaseById(id: number): Promise<VolunteerCaseDto | null> {
  return safeApiCall(apiGet<VolunteerCaseDto>(`/VolunteerCase/Get/${id}`), null)
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
  return result?.rows ?? []
}

export async function fetchTestById(id: number): Promise<TestDto | null> {
  return safeApiCall(apiGet<TestDto>(`/Test/Get/${id}`), null)
}

// ---------------------------------------------------------------------------
// SelectList (Regions)
// ---------------------------------------------------------------------------

export async function fetchRegions(): Promise<SelectListItemDto[]> {
  const list = await safeApiCall(apiGet<SelectListItemDto[]>('/SelectList/Region'), [])
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
