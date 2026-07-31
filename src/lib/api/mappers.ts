import { type BaseContentItem, type ContentLanguage, type ContentType } from "@/types/content";
import { type TestModel, type TestQuestion } from "@/types/test";
import { type ReaderPage } from "@/components/ui/PagedReader";
import {
  AUDIO_STATUS_SUCCESS,
  CONTENT_CATEGORY_DARSLAR,
  CONTENT_CATEGORY_ETIKET,
  CONTENT_CATEGORY_KUTUBXONA,
  CONTENT_CATEGORY_MEN_QILA_OLAMAN,
  CONTENT_CATEGORY_OTA_ONALAR_VIDEO,
  CONTENT_TYPE_VIDEO,
  TEST_TYPE_IMAGE,
} from "./constants";
import { toFileUrl } from "./files";
import type {
  BookPageDto,
  ComicPageDto,
  ContentItemDto,
  PlatformStatDto,
  SlideDto,
  TestDto,
  VocabularyTopicDto,
  VocabularyWordDto,
  VolunteerCaseDto,
} from "./types";

/**
 * Backend DTO -> saytning mavjud ko'rinish modellari.
 *
 * Bu qatlamning maqsadi — UI komponentlarini O'ZGARTIRMASLIK. Ular ilgari
 * `lib/mocks/*` dagi shakllar bilan ishlagan; shu shakllar saqlanib qoladi,
 * faqat manba mock o'rniga API bo'ladi.
 */

// ---------------------------------------------------------------------------
// Til yordamchilari
// ---------------------------------------------------------------------------

/** Interfeys tili — `ContentItem` sarlavhasining qaysi ustuni olinishini hal qiladi. */
export function titleOf(dto: ContentItemDto, locale: string): string {
  switch (locale) {
    case "ru":
      return dto.titleRu || dto.titleUz || dto.titleEn;
    case "en":
      return dto.titleEn || dto.titleUz || dto.titleRu;
    default:
      return dto.titleUz || dto.titleRu || dto.titleEn;
  }
}

/**
 * Backendda audio uch tilda alohida maydonda va har biri o'z holatiga ega.
 * FAQAT `SUCCESS` bo'lgan audio pleyerga beriladi — aks holda foydalanuvchi
 * hali yasalmagan yoki xato bilan tugagan faylni bosgan bo'lardi.
 *
 * Har bir maydon papkasiga qarab ochiladigan URL ga aylantiriladi; papka uchun
 * `DownloadFile` uchi bo'lmasa (`BookPages`, `ComicPages`, `VocabularyWordAudio`)
 * — `undefined`, ya'ni o'sha til pleyerda nofaol ko'rinadi.
 */
interface AudioSource {
  audioUrlUz?: string | null;
  audioUrlRu?: string | null;
  audioUrlEn?: string | null;
  audioGenerationStatusIdUz: number;
  audioGenerationStatusIdRu: number;
  audioGenerationStatusIdEn: number;
}

export function audioUrlsOf(source: AudioSource): { uz?: string; ru?: string; en?: string } {
  const pick = (url: string | null | undefined, statusId: number): string | undefined => {
    if (statusId !== AUDIO_STATUS_SUCCESS) return undefined;
    return toFileUrl(url) ?? undefined;
  };

  const urls = {
    uz: pick(source.audioUrlUz, source.audioGenerationStatusIdUz),
    ru: pick(source.audioUrlRu, source.audioGenerationStatusIdRu),
    en: pick(source.audioUrlEn, source.audioGenerationStatusIdEn),
  };

  // Bo'sh kalitlarni olib tashlaymiz — `PagedReader` mavjud kalitlar bo'yicha
  // tugmalarni faollashtiradi.
  return Object.fromEntries(Object.entries(urls).filter(([, value]) => value));
}

// ---------------------------------------------------------------------------
// ContentItem -> BaseContentItem
// ---------------------------------------------------------------------------

/**
 * `enum_content_category` -> saytdagi kartochka turi.
 *
 * Sayt `type` ni faqat kartochka ikonkasi va ko'rinishi uchun ishlatadi
 * (`ContentCard.tsx`), shuning uchun maqola tipidagi kategoriyalar
 * (uyda ta'lim, psixologiya, ta'lim, huquqiy) mock'lardagi kelishuvga mos
 * ravishda `"lessons"` ga tushadi.
 */
const CONTENT_TYPE_BY_CATEGORY: Record<number, ContentType> = {
  [CONTENT_CATEGORY_ETIKET]: "etiquette",
  [CONTENT_CATEGORY_MEN_QILA_OLAMAN]: "i-can",
  [CONTENT_CATEGORY_DARSLAR]: "lessons",
  [CONTENT_CATEGORY_KUTUBXONA]: "books",
  [CONTENT_CATEGORY_OTA_ONALAR_VIDEO]: "videos",
};

export interface ContentItemView extends BaseContentItem {
  /** Video kontent uchun — `youtube_url`. */
  videoUrl?: string;
  /** Maqola uchun — `full_text`. */
  content?: string;
  author?: string;
  /** Backend `pdf_file_url` — kitob/komiks manbasi. */
  pdfUrl?: string;
  /** Xom DTO — sahifa o'ziga xos maydonga muhtoj bo'lganda. */
  raw: ContentItemDto;
}

/**
 * `hasTest` ni `ContentItem` ning o'zi bilmaydi — bog'liqlik teskari tomonda
 * (`info_test.content_item_id`). Shu sababli test id'lari to'plami tashqaridan
 * beriladi (`buildTestIndex` ga qarang).
 */
export function toContentItemView(
  dto: ContentItemDto,
  locale: string,
  testIdByContentItemId: Map<number, number> = new Map(),
): ContentItemView {
  const testId = testIdByContentItemId.get(dto.id);

  return {
    id: String(dto.id),
    type: CONTENT_TYPE_BY_CATEGORY[dto.categoryId] ?? "lessons",
    title: titleOf(dto, locale),
    description: dto.description ?? "",
    // `DateOnly` allaqachon "YYYY-MM-DD" — sayt shu shaklni kutadi.
    date: dto.publishedDate ?? "",
    // Backend `ContentItemDto` da kontent tili maydoni YO'Q (024-migratsiyadan
    // keyin sarlavhalar uch ustunga bo'lingan), shuning uchun interfeys tili
    // olinadi.
    contentLanguage: (locale as ContentLanguage) ?? "uz",
    hasTest: testId !== undefined,
    coverUrl: toFileUrl(dto.coverImageUrl) ?? undefined,
    pageCount: dto.pages ?? undefined,
    ...(dto.typeId === CONTENT_TYPE_VIDEO && dto.youtubeUrl
      ? { videoUrl: dto.youtubeUrl }
      : {}),
    ...(dto.fullText ? { content: dto.fullText } : {}),
    ...(dto.author ? { author: dto.author } : {}),
    ...(dto.pdfFileUrl ? { pdfUrl: toFileUrl(dto.pdfFileUrl) ?? undefined } : {}),
    raw: dto,
  };
}

/**
 * `contentItemId -> testId` jadvali.
 *
 * Bitta kontentga bir nechta test bog'langan bo'lsa, birinchisi olinadi —
 * saytda kontent oxirida bitta «Testga o'tish» tugmasi bor.
 */
export function buildTestIndex(tests: { id: number; contentItemId?: number | null }[]): Map<
  number,
  number
> {
  const index = new Map<number, number>();
  for (const test of tests) {
    if (test.contentItemId != null && !index.has(test.contentItemId)) {
      index.set(test.contentItemId, test.id);
    }
  }
  return index;
}

// ---------------------------------------------------------------------------
// BookPage / ComicPage -> ReaderPage
// ---------------------------------------------------------------------------

/**
 * Kitob sahifalari o'quvchi komponenti kutgan shaklga o'tkaziladi.
 *
 * `imageUrl` — `BookPages`/`ComicPages` papkasidagi fayl; backendda bu
 * papkalar uchun `DownloadFile` uchi hali yo'q, shuning uchun `toFileUrl`
 * `null` qaytaradi va sahifa faqat matn bilan ko'rsatiladi.
 */
export function toReaderPages(pages: BookPageDto[]): ReaderPage[] {
  return [...pages]
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((page) => ({
      content: page.text ?? "",
      imageUrl: toFileUrl(page.imageUrl) ?? undefined,
    }));
}

/** Komiks sahifalarida matn maydoni `script` deb ataladi. */
export function comicToReaderPages(pages: ComicPageDto[]): ReaderPage[] {
  return [...pages]
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .map((page) => ({
      content: page.script ?? "",
      imageUrl: toFileUrl(page.imageUrl) ?? undefined,
    }));
}

/**
 * Kitob/komiksning audio havolalari — BIRINCHI sahifanikidan olinadi.
 *
 * Backendda audio har SAHIFA uchun alohida yasaladi, sayt o'quvchisi esa butun
 * kitob uchun bitta pleyer ko'rsatadi. Sahifama-sahifa audio kerak bo'lsa,
 * `PagedReader` ni o'zgartirish talab etiladi — hozircha birinchi sahifa
 * audiosi butun kitobniki sifatida beriladi.
 */
export function readerAudioUrls(pages: AudioSource[]): { uz?: string; ru?: string; en?: string } {
  return pages.length > 0 ? audioUrlsOf(pages[0]) : {};
}

// ---------------------------------------------------------------------------
// Test -> TestModel
// ---------------------------------------------------------------------------

/**
 * `TestDto` -> vizard kutgan `TestModel`.
 *
 * Ikkita muhim moslashtirish:
 *  - backend maydon nomi `qustions` (imlo xatosi) — shu yerda to'g'rilanadi;
 *  - backendda to'g'ri javob har variantda `isCorrect` bayrog'i bilan, saytda
 *    esa bitta `correctOptionIndex` — indeks tartiblangan ro'yxatdan topiladi.
 *    To'g'ri variant belgilanmagan bo'lsa `0` emas, `-1` beriladi: aks holda
 *    birinchi variant «to'g'ri» bo'lib qolardi.
 */
export function toTestModel(dto: TestDto): TestModel {
  return {
    id: String(dto.id),
    title: dto.title,
    questions: [...(dto.qustions ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toTestQuestion),
  };
}

function toTestQuestion(dto: TestDto["qustions"][number]): TestQuestion {
  const options = [...(dto.answerOptions ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: String(dto.id),
    type: dto.typeId === TEST_TYPE_IMAGE ? "image" : "text",
    questionText: dto.text ?? "",
    imageUrl: toFileUrl(dto.imageUrl) ?? undefined,
    // Rasmli variantda ham matn ko'rsatiladi (izoh sifatida), shuning uchun
    // `imageCaption` zaxira sifatida olinadi.
    options: options.map((option) => option.text ?? option.imageCaption ?? ""),
    correctOptionIndex: options.findIndex((option) => option.isCorrect),
  };
}

/** Test ro'yxati kartochkasi — `ContentList` uchun. */
export function testToContentItem(dto: TestDto, forParents: boolean): BaseContentItem {
  return {
    id: String(dto.id),
    type: forParents ? "parents-tests" : "tests",
    title: dto.title,
    description: dto.contentItem ?? dto.vocabularyTopic ?? "",
    date: "",
    contentLanguage: languageCodeOf(dto.languageId),
    hasTest: true,
  };
}

function languageCodeOf(languageId: number): ContentLanguage {
  if (languageId === 2) return "ru";
  if (languageId === 3) return "en";
  return "uz";
}

// ---------------------------------------------------------------------------
// VocabularyTopic
// ---------------------------------------------------------------------------

export interface VocabularyTopicView {
  id: string;
  title: string;
  language: ContentLanguage;
  wordsCount: number;
  hasTest: boolean;
}

export interface VocabularyWordView {
  id: string;
  word: string;
  imageUrl: string;
  audioUrls: { uz?: string; ru?: string; en?: string };
}

export function toVocabularyTopicView(
  dto: VocabularyTopicDto,
  topicIdsWithTest: Set<number>,
): VocabularyTopicView {
  return {
    id: String(dto.id),
    title: dto.title,
    language: languageCodeOf(dto.languageId),
    wordsCount: dto.vocabularyWords?.length ?? 0,
    hasTest: topicIdsWithTest.has(dto.id),
  };
}

export function toVocabularyWordViews(dto: VocabularyTopicDto): VocabularyWordView[] {
  return [...(dto.vocabularyWords ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(toVocabularyWordView);
}

function toVocabularyWordView(dto: VocabularyWordDto): VocabularyWordView {
  return {
    id: String(dto.id),
    word: dto.word,
    // `imageUrl` — `VocabularyTopic` papkasida, uni `DownloadFile` beradi.
    imageUrl: toFileUrl(dto.imageUrl) ?? "",
    audioUrls: audioUrlsOf(dto),
  };
}

// ---------------------------------------------------------------------------
// Slide -> SlideItem
// ---------------------------------------------------------------------------

export interface SlideView {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export function toSlideViews(slides: SlideDto[]): SlideView[] {
  return [...slides]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((slide) => ({
      id: String(slide.id),
      title: slide.title,
      description: slide.content ?? "",
      imageUrl: toFileUrl(slide.imageUrl) ?? undefined,
    }));
}

// ---------------------------------------------------------------------------
// VolunteerCase
// ---------------------------------------------------------------------------

export interface VolunteerCaseView {
  id: string;
  title: string;
  description: string;
  /** To'liq matn — backendda alohida maydon yo'q, `description` ning o'zi. */
  longDescription: string;
  region: string;
  mediaUrl?: string;
  /** Fayl kengaytmasidan aniqlanadi — backend media turini saqlamaydi. */
  mediaType: "image" | "video" | "none";
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)$/i;

export function toVolunteerCaseView(dto: VolunteerCaseDto): VolunteerCaseView {
  const mediaUrl = toFileUrl(dto.mediaUrl) ?? undefined;

  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    longDescription: dto.description,
    region: dto.region ?? "",
    mediaUrl,
    mediaType: mediaUrl ? (VIDEO_EXTENSIONS.test(mediaUrl) ? "video" : "image") : "none",
  };
}

// ---------------------------------------------------------------------------
// PlatformStat
// ---------------------------------------------------------------------------

export interface ImpactMetricView {
  id: string;
  value: string;
  label: string;
  metricKey: string;
}

/**
 * `PlatformStat` — «ishonch raqamlari». `label` bo'sh bo'lsa `metricKey`
 * ko'rsatiladi (adminka `label` ni ixtiyoriy qoldirgan).
 */
export function toImpactMetricView(dto: PlatformStatDto): ImpactMetricView {
  return {
    id: String(dto.id),
    value: formatMetricValue(dto.value),
    label: dto.label?.trim() || dto.metricKey,
    metricKey: dto.metricKey,
  };
}

/** 1500 -> "1 500". Mock'lardagi "1,500+" kabi qo'lda yozilgan shakl o'rniga. */
function formatMetricValue(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
