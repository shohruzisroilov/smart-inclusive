/**
 * Backend DTO'larining 1:1 TypeScript nusxasi.
 *
 * Manba: `back/SmartInklyuziv.Application/Services/*​/DTOs/*.cs`. Maydon nomlari
 * backend JSON'i bilan bir xil (camelCase — ASP.NET standart siyosati), shuning
 * uchun bu yerda qayta nomlash YO'Q. Saytning ichki ko'rinish modellariga
 * o'tkazish `lib/api/mappers.ts` da, bitta joyda bajariladi.
 */

/** `RequestParameters` — barcha `GetList` so'rovlarining umumiy tanasi. */
export interface RequestParameters {
  page?: number;
  pageSize?: number;
  search?: string | null;
  sortBy?: "ASC" | "DESC";
}

/** `PaginatedResult<T>` — `GetList` javobi. */
export interface PaginatedResult<T> {
  page: number;
  pageSize: number;
  total: number;
  rows: T[];
}

// ---------------------------------------------------------------------------
// ContentItem
// ---------------------------------------------------------------------------

export interface ContentItemDto {
  id: number;
  typeId: number;
  type?: string | null;
  categoryId: number;
  category?: string | null;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  description?: string | null;
  author?: string | null;
  /** `DateOnly` — JSON'da "2026-07-21" ko'rinishidagi satr. */
  publishedDate?: string | null;
  contentStatusId: number;
  contentStatus?: string | null;
  audienceId: number;
  audience?: string | null;
  coverImageUrl?: string | null;
  pdfFileUrl?: string | null;
  isAdaptedForInclusive?: boolean | null;
  pages?: number | null;
  youtubeUrl?: string | null;
  transcriptText?: string | null;
  fullText?: string | null;
  articleCategoryId?: number | null;
  articleCategory?: string | null;
  stateId: number;
  state?: string | null;
}

export type ContentItemFilterParams = RequestParameters;

// ---------------------------------------------------------------------------
// BookPage / ComicPage — kitob va komiks sahifalari
// ---------------------------------------------------------------------------

/** `BookPageDto` va `ComicPageDto` faqat matn maydonining nomi bilan farq qiladi. */
interface PageDtoBase {
  id: number;
  contentItemId: number;
  contentItemTitle?: string | null;
  pageNumber: number;
  imageUrl: string;
  audioUrlUz?: string | null;
  audioUrlRu?: string | null;
  audioUrlEn?: string | null;
  audioGenerationStatusIdUz: number;
  audioGenerationStatusIdRu: number;
  audioGenerationStatusIdEn: number;
  audioGenerationStatusUz?: string | null;
  audioGenerationStatusRu?: string | null;
  audioGenerationStatusEn?: string | null;
  stateId: number;
  state?: string | null;
}

export interface BookPageDto extends PageDtoBase {
  text?: string | null;
}

export interface ComicPageDto extends PageDtoBase {
  script?: string | null;
}

export type BookPageFilterParams = RequestParameters;
export type ComicPageFilterParams = RequestParameters;

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

export interface TestAnswerOptionDto {
  id: number;
  questionId: number;
  optionTypeId: number;
  optionType?: string | null;
  text?: string | null;
  imageUrl?: string | null;
  imageCaption?: string | null;
  isCorrect: boolean;
  sortOrder: number;
}

export interface TestQuestionDto {
  id: number;
  testId: number;
  typeId: number;
  type?: string | null;
  text?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  answerOptions: TestAnswerOptionDto[];
}

export interface TestDto {
  id: number;
  languageId: number;
  language?: string | null;
  title: string;
  audienceId: number;
  audience?: string | null;
  contentItemId?: number | null;
  contentItem?: string | null;
  vocabularyTopicId?: number | null;
  vocabularyTopic?: string | null;
  stateId: number;
  state?: string | null;
  /**
   * DIQQAT — backendda maydon nomi `Qustions` (imlo xatosi bilan), ya'ni JSON'da
   * ham `qustions` bo'lib keladi. Bu yerda ataylab xuddi shunday yozilgan;
   * to'g'rilangan nom `mappers.ts` da beriladi.
   */
  qustions: TestQuestionDto[];
}

export interface TestFilterParams extends RequestParameters {
  languageId?: number | null;
}

// ---------------------------------------------------------------------------
// VocabularyTopic
// ---------------------------------------------------------------------------

export interface VocabularyWordDto {
  id: number;
  topicId: number;
  word: string;
  imageUrl?: string | null;
  audioUrlUz?: string | null;
  audioUrlRu?: string | null;
  audioUrlEn?: string | null;
  audioGenerationStatusIdUz: number;
  audioGenerationStatusIdRu: number;
  audioGenerationStatusIdEn: number;
  audioGenerationStatusUz?: string | null;
  audioGenerationStatusRu?: string | null;
  audioGenerationStatusEn?: string | null;
  sortOrder: number;
}

export interface VocabularyTopicDto {
  id: number;
  title: string;
  languageId: number;
  language?: string | null;
  stateId: number;
  state?: string | null;
  vocabularyWords: VocabularyWordDto[];
}

export interface VocabularyTopicFilterParams extends RequestParameters {
  languageId?: number | null;
  organizationId?: number | null;
}

// ---------------------------------------------------------------------------
// Slide — vizard/taqdimot slaydlari
// ---------------------------------------------------------------------------

export interface SlideDto {
  id: number;
  scenarioId: number;
  scenario?: string | null;
  title: string;
  content?: string | null;
  imageUrl?: string | null;
  languageId: number;
  language?: string | null;
  sortOrder: number;
  stateId: number;
  state?: string | null;
}

export interface SlideFilterParams extends RequestParameters {
  scenarioId?: number | null;
  languageId?: number | null;
}

// ---------------------------------------------------------------------------
// VolunteerCase
// ---------------------------------------------------------------------------

export interface VolunteerCaseDto {
  id: number;
  title: string;
  description: string;
  mediaUrl?: string | null;
  sortOrder: number;
  regionId: number;
  region?: string | null;
  stateId: number;
  state?: string | null;
}

export type VolunteerCaseFilterParams = RequestParameters;

// ---------------------------------------------------------------------------
// PlatformStat — «ishonch raqamlari»
// ---------------------------------------------------------------------------

export interface PlatformStatDto {
  id: number;
  metricKey: string;
  value: number;
  label?: string | null;
  stateId: number;
  state?: string | null;
}

export type PlatformStatFilterParams = RequestParameters;

// ---------------------------------------------------------------------------
// Formalar (POST) — saytdan yuboriladigan yagona ma'lumotlar
// ---------------------------------------------------------------------------

export interface ContactRequestDto {
  id: number;
  fullName: string;
  phone: string;
  message: string;
  responseNote?: string | null;
  statusId: number;
  status?: string | null;
  stateId: number;
  state?: string | null;
}

export interface VolunteerApplicationDto {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  age?: number | null;
  message?: string | null;
  adminComment?: string | null;
  regionId: number;
  region?: string | null;
  statusId: number;
  status?: string | null;
  stateId: number;
  state?: string | null;
}

// ---------------------------------------------------------------------------
// SelectList
// ---------------------------------------------------------------------------

/**
 * `AsSelectList()` natijasi. E'tibor bering: kalit `value`, `id` EMAS
 * (adminkada ham shu shakl tasdiqlangan).
 */
export interface SelectListItemDto {
  value: number;
  text: string;
  code?: string | null;
}
