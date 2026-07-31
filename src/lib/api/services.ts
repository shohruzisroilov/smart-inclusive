import { cache } from "react";
import { apiGet, apiPost, safeItem, safeList, DEFAULT_REVALIDATE } from "./client";
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
} from "./types";
import {
  CONTACT_REQUEST_STATUS_NEW,
  STATE_ACTIVE,
  VOLUNTEER_APPLICATION_STATUS_NEW,
} from "./constants";

/**
 * Backend uchlarining tipli o'ramchilari.
 *
 * MUHIM — backendning ro'yxat filtrlari juda tor: `ContentItemFilterParams` da
 * faqat `search`/`page`/`pageSize`/`sortBy` bor, `typeId`/`categoryId`/
 * `audienceId` bo'yicha filtr YO'Q. Shu sababli sayt bo'limlari ro'yxatni bitta
 * katta sahifa qilib olib, kerakli kategoriyani TypeScript tomonda ajratadi
 * (`content.ts` ga qarang). Kontent hajmi o'sganda backendga filtr qo'shilishi
 * kerak — quyidagi `LIST_PAGE_SIZE` shunda kamaytiriladi.
 */
export const LIST_PAGE_SIZE = 200;

/**
 * `react.cache` — bitta render davomida bir xil so'rov takrorlanmasligi uchun.
 * Next `POST` javoblarini keshlamagani sababli bu ayniqsa muhim: sahifa va
 * uning `generateMetadata` si bir xil ro'yxatni so'rasa, bekendga bitta so'rov
 * ketadi.
 */

// ---------------------------------------------------------------------------
// ContentItem
// ---------------------------------------------------------------------------

export const fetchContentItems = cache(async (): Promise<ContentItemDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<ContentItemDto>>(
      "/ContentItem/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "DESC" },
      { revalidate: DEFAULT_REVALIDATE, tags: ["content"] },
    ),
    "ContentItem/GetList",
  );
  return result?.rows ?? [];
});

export const fetchContentItem = cache(async (id: number): Promise<ContentItemDto | null> => {
  return safeItem(
    apiGet<ContentItemDto>(`/ContentItem/Get/${id}`, { tags: ["content"] }),
    `ContentItem/Get/${id}`,
  );
});

// ---------------------------------------------------------------------------
// BookPage / ComicPage
// ---------------------------------------------------------------------------

/**
 * Sahifa uchlarida `contentItemId` bo'yicha filtr YO'Q (`BookPageFilterParams`
 * bo'sh), shuning uchun hammasi olinib, kerakli kitobniki ajratiladi.
 */
export const fetchBookPages = cache(async (): Promise<BookPageDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<BookPageDto>>(
      "/BookPage/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC" },
      { tags: ["content"] },
    ),
    "BookPage/GetList",
  );
  return result?.rows ?? [];
});

/**
 * DIQQAT: `ComicPageController` da `[AllowAnonymous]` YO'Q — `BookPage` dan
 * farqli o'laroq, bu uch tizimga kirishni talab qiladi va saytdan 401 qaytaradi.
 * `safeItem` tufayli sahifa qulamaydi, lekin komiks sahifalari BO'SH keladi.
 * Backendda `GetList`/`Get` ochilishi kerak.
 */
export const fetchComicPages = cache(async (): Promise<ComicPageDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<ComicPageDto>>(
      "/ComicPage/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC" },
      { tags: ["content"] },
    ),
    "ComicPage/GetList (ochiq emas — backendda [AllowAnonymous] kerak)",
  );
  return result?.rows ?? [];
});

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

export const fetchTests = cache(async (languageId?: number): Promise<TestDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<TestDto>>(
      "/Test/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC", languageId: languageId ?? null },
      { tags: ["tests"] },
    ),
    "Test/GetList",
  );
  return result?.rows ?? [];
});

export const fetchTest = cache(async (id: number): Promise<TestDto | null> => {
  return safeItem(apiGet<TestDto>(`/Test/Get/${id}`, { tags: ["tests"] }), `Test/Get/${id}`);
});

// ---------------------------------------------------------------------------
// VocabularyTopic
// ---------------------------------------------------------------------------

export const fetchVocabularyTopics = cache(
  async (languageId?: number): Promise<VocabularyTopicDto[]> => {
    const result = await safeItem(
      apiPost<PaginatedResult<VocabularyTopicDto>>(
        "/VocabularyTopic/GetList",
        { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC", languageId: languageId ?? null },
        { tags: ["vocabulary"] },
      ),
      "VocabularyTopic/GetList",
    );
    return result?.rows ?? [];
  },
);

export const fetchVocabularyTopic = cache(
  async (id: number): Promise<VocabularyTopicDto | null> => {
    return safeItem(
      apiGet<VocabularyTopicDto>(`/VocabularyTopic/Get/${id}`, { tags: ["vocabulary"] }),
      `VocabularyTopic/Get/${id}`,
    );
  },
);

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

/**
 * DIQQAT: `SlideController` da ham `[AllowAnonymous]` YO'Q. Onboarding vizardi,
 * platforma taqdimoti va «Loyiha haqida» slaydlari shu uchdan keladi, ya'ni
 * backend ochilmaguncha bu uchta sahifa bo'sh bo'ladi.
 */
export const fetchSlides = cache(
  async (scenarioId: number, languageId: number): Promise<SlideDto[]> => {
    const result = await safeItem(
      apiPost<PaginatedResult<SlideDto>>(
        "/Slide/GetList",
        { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC", scenarioId, languageId },
        { tags: ["slides"] },
      ),
      `Slide/GetList scenario=${scenarioId} (ochiq emas — backendda [AllowAnonymous] kerak)`,
    );
    return result?.rows ?? [];
  },
);

// ---------------------------------------------------------------------------
// VolunteerCase
// ---------------------------------------------------------------------------

export const fetchVolunteerCases = cache(async (): Promise<VolunteerCaseDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<VolunteerCaseDto>>(
      "/VolunteerCase/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC" },
      { tags: ["volunteers"] },
    ),
    "VolunteerCase/GetList",
  );
  return result?.rows ?? [];
});

export const fetchVolunteerCase = cache(async (id: number): Promise<VolunteerCaseDto | null> => {
  return safeItem(
    apiGet<VolunteerCaseDto>(`/VolunteerCase/Get/${id}`, { tags: ["volunteers"] }),
    `VolunteerCase/Get/${id}`,
  );
});

// ---------------------------------------------------------------------------
// PlatformStat
// ---------------------------------------------------------------------------

export const fetchPlatformStats = cache(async (): Promise<PlatformStatDto[]> => {
  const result = await safeItem(
    apiPost<PaginatedResult<PlatformStatDto>>(
      "/PlatformStat/GetList",
      { page: 1, pageSize: LIST_PAGE_SIZE, sortBy: "ASC" },
      { tags: ["stats"] },
    ),
    "PlatformStat/GetList",
  );
  return result?.rows ?? [];
});

// ---------------------------------------------------------------------------
// SelectList — formalarga kerak bo'lgan ochiq ro'yxatlar
// ---------------------------------------------------------------------------

/** Faqat `[AllowAnonymous]` bo'lgan ro'yxatlar sayt uchun ishlatiladi. */
export const fetchSelectList = cache(
  async (name: string, pathParam?: number): Promise<SelectListItemDto[]> => {
    const path =
      pathParam === undefined
        ? `/SelectList/${name}SelectList`
        : `/SelectList/${name}SelectList/${pathParam}`;

    return safeList(
      apiGet<SelectListItemDto[]>(path, { revalidate: 3600, tags: ["select-lists"] }),
      path,
    );
  },
);

/** Ko'ngilli arizasi formasidagi viloyat tanlagichi uchun. `1` — O'zbekiston. */
export const fetchRegions = cache((countryId = 1) => fetchSelectList("Region", countryId));

// ---------------------------------------------------------------------------
// Formalar (POST) — server action'lardan chaqiriladi
// ---------------------------------------------------------------------------

export interface ContactRequestInput {
  fullName: string;
  phone: string;
  message: string;
}

/**
 * `ContactRequestController.Create` — `[AllowAnonymous]`.
 *
 * DTO'ning nullable BO'LMAGAN maydonlari (`statusId`, `stateId`) to'ldirib
 * yuboriladi: bo'sh ketsa backend 400 beradi. `id` — 0 (yangi yozuv).
 */
export async function createContactRequest(input: ContactRequestInput): Promise<number> {
  const dto: ContactRequestDto = {
    id: 0,
    fullName: input.fullName,
    phone: input.phone,
    message: input.message,
    responseNote: null,
    statusId: CONTACT_REQUEST_STATUS_NEW,
    stateId: STATE_ACTIVE,
  };

  return apiPost<number>("/ContactRequest/Create", dto, { revalidate: 0 });
}

export interface VolunteerApplicationInput {
  fullName: string;
  phone: string;
  email?: string | null;
  age?: number | null;
  message?: string | null;
  regionId: number;
}

/** `VolunteerApplicationController.Create` — `[AllowAnonymous]`. */
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
  };

  return apiPost<number>("/VolunteerApplication/Create", dto, { revalidate: 0 });
}
