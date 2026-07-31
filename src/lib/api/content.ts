import { cache } from "react";
import {
  ARTICLE_CATEGORY_HUQUQIY,
  ARTICLE_CATEGORY_PSIXOLOGIYA,
  ARTICLE_CATEGORY_TALIM,
  AUDIENCE_OTA_ONALAR,
  CONTENT_CATEGORY_DARSLAR,
  CONTENT_CATEGORY_ETIKET,
  CONTENT_CATEGORY_HUQUQIY,
  CONTENT_CATEGORY_KUTUBXONA,
  CONTENT_CATEGORY_MEN_QILA_OLAMAN,
  CONTENT_CATEGORY_OTA_ONALAR_VIDEO,
  CONTENT_CATEGORY_PSIXOLOGIYA,
  CONTENT_CATEGORY_TALIM,
  CONTENT_CATEGORY_UYDA_TALIM,
  CONTENT_STATUS_PUBLISHED,
  STATE_ACTIVE,
} from "./constants";
import {
  buildTestIndex,
  comicToReaderPages,
  readerAudioUrls,
  toContentItemView,
  toReaderPages,
  type ContentItemView,
} from "./mappers";
import {
  fetchBookPages,
  fetchComicPages,
  fetchContentItems,
  fetchTests,
} from "./services";
import type { ContentItemDto } from "./types";
import type { ReaderPage } from "@/components/ui/PagedReader";

/**
 * Sayt bo'limlari uchun kontent tanlash qatlami.
 *
 * SABABI — backendning `ContentItemFilterParams` da `categoryId`/`audienceId`
 * bo'yicha filtr YO'Q (faqat `search`). Shu sababli ro'yxat bir marta olinadi
 * (`fetchContentItems` `react.cache` bilan render davomida bitta so'rovga
 * aylanadi) va bo'limlarga shu yerda ajratiladi.
 *
 * Backendga filtr qo'shilganda o'zgarish faqat shu faylda bo'ladi — sahifalar
 * `getSectionContent(...)` ni chaqirishda davom etadi.
 */

/** Saytda faqat «e'lon qilingan» va faol yozuvlar ko'rinadi. */
function isPublic(dto: ContentItemDto): boolean {
  return dto.stateId === STATE_ACTIVE && dto.contentStatusId === CONTENT_STATUS_PUBLISHED;
}

/** Bo'lim -> qaysi `category_id` lardan iborat. */
export const SECTION_CATEGORIES = {
  etiquette: [CONTENT_CATEGORY_ETIKET],
  iCanDoIt: [CONTENT_CATEGORY_MEN_QILA_OLAMAN],
  lessons: [CONTENT_CATEGORY_DARSLAR],
  books: [CONTENT_CATEGORY_KUTUBXONA],
  parentVideos: [CONTENT_CATEGORY_OTA_ONALAR_VIDEO],
  homeEducation: [CONTENT_CATEGORY_UYDA_TALIM],
  legal: [CONTENT_CATEGORY_HUQUQIY],
  /**
   * «Maqolalar» bo'limi — psixologiya va ta'lim. Huquqiy maqolalar alohida
   * bo'limda ko'rsatilgani uchun bu yerga kirmaydi.
   */
  articles: [CONTENT_CATEGORY_PSIXOLOGIYA, CONTENT_CATEGORY_TALIM],
} as const;

export type SectionKey = keyof typeof SECTION_CATEGORIES;

/**
 * Maqola bo'limlari `article_category_id` bo'yicha ham ajratilishi mumkin —
 * kontent `category_id` o'rniga shu maydon bilan kiritilgan bo'lsa, ro'yxat
 * bo'sh qolmasligi uchun ikkala manba ham tekshiriladi.
 */
const ARTICLE_CATEGORY_FALLBACK: Partial<Record<SectionKey, number[]>> = {
  legal: [ARTICLE_CATEGORY_HUQUQIY],
  articles: [ARTICLE_CATEGORY_PSIXOLOGIYA, ARTICLE_CATEGORY_TALIM],
};

/**
 * Bitta bo'lim uchun kontent ro'yxati.
 *
 * `hasTest` bayrog'i test ro'yxatidan quriladi: `ContentItem` o'ziga bog'langan
 * testni bilmaydi (bog'liqlik `info_test.content_item_id` tomonda).
 */
export const getSectionContent = cache(
  async (section: SectionKey, locale: string): Promise<ContentItemView[]> => {
    const [items, tests] = await Promise.all([fetchContentItems(), fetchTests()]);
    const testIndex = buildTestIndex(tests);

    const categoryIds: readonly number[] = SECTION_CATEGORIES[section];
    const articleCategoryIds = ARTICLE_CATEGORY_FALLBACK[section];

    return items
      .filter(isPublic)
      .filter(
        (dto) =>
          categoryIds.includes(dto.categoryId) ||
          (articleCategoryIds != null &&
            dto.articleCategoryId != null &&
            articleCategoryIds.includes(dto.articleCategoryId)),
      )
      .map((dto) => toContentItemView(dto, locale, testIndex))
      .sort(byNewestFirst);
  },
);

/** Yangi kontent tepada — `published_date` bo'sh bo'lsa oxiriga tushadi. */
function byNewestFirst(a: ContentItemView, b: ContentItemView): number {
  if (!a.date) return 1;
  if (!b.date) return -1;
  return b.date.localeCompare(a.date);
}

/**
 * Bitta kontent yozuvi.
 *
 * `Get/{id}` alohida chaqirilmaydi: ro'yxat allaqachon `react.cache` da va
 * unda barcha maydonlar bor, ya'ni qo'shimcha so'rov ortiqcha bo'lardi.
 * E'lon qilinmagan yozuv ataylab `null` — saytda 404 ko'rinadi.
 */
export const getContentItem = cache(
  async (id: string, locale: string): Promise<ContentItemView | null> => {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) return null;

    const [items, tests] = await Promise.all([fetchContentItems(), fetchTests()]);
    const dto = items.find((item) => item.id === numericId);

    if (!dto || !isPublic(dto)) return null;

    return toContentItemView(dto, locale, buildTestIndex(tests));
  },
);

/**
 * Bitta yozuv, LEKIN faqat berilgan bo'limga tegishli bo'lsa.
 *
 * Detal sahifalar shuni ishlatadi: `/books/9` (aslida dars) kitob o'quvchisida
 * ochilmasligi, 404 berishi kerak — URL bo'lim bilan mos kelishi shart.
 */
export const getSectionItem = cache(
  async (section: SectionKey, id: string, locale: string): Promise<ContentItemView | null> => {
    const item = await getContentItem(id, locale);
    if (!item) return null;

    const categoryIds: readonly number[] = SECTION_CATEGORIES[section];
    const articleCategoryIds = ARTICLE_CATEGORY_FALLBACK[section];

    const belongs =
      categoryIds.includes(item.raw.categoryId) ||
      (articleCategoryIds != null &&
        item.raw.articleCategoryId != null &&
        articleCategoryIds.includes(item.raw.articleCategoryId));

    return belongs ? item : null;
  },
);

/** Statik yo'llarni oldindan qurish uchun (`generateStaticParams`). */
export const getSectionIds = cache(async (section: SectionKey): Promise<string[]> => {
  const items = await getSectionContent(section, "uz");
  return items.map((item) => item.id);
});

// ---------------------------------------------------------------------------
// Maqolalar
// ---------------------------------------------------------------------------

/** `ArticleLayout` kutgan model. */
export interface ArticleView {
  id: string;
  title: string;
  category: string;
  date: string;
  readingTime: string;
  content: string;
}

/**
 * Maqola matni `full_text` da. Backendda maqola BIR tilda saqlanadi
 * (`description`/`full_text` uchun tilga bo'lingan ustunlar yo'q), shuning
 * uchun matn tarjima qilinmaydi — faqat sarlavha tilga qarab tanlanadi.
 */
export const getArticle = cache(
  async (section: SectionKey, id: string, locale: string): Promise<ArticleView | null> => {
    const item = await getSectionItem(section, id, locale);
    if (!item) return null;

    const content = item.content ?? item.description ?? "";

    return {
      id: item.id,
      title: item.title,
      category: item.raw.articleCategory ?? item.raw.category ?? "",
      date: item.date,
      readingTime: estimateReadingTime(content),
      content,
    };
  },
);

/**
 * Taxminiy o'qish vaqti — mock'larda qo'lda yozilgan «5 daqiqa» o'rniga.
 * 180 so'z/daqiqa — o'zbek/rus matni uchun mo''tadil o'rtacha.
 */
function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${minutes} min`;
}

// ---------------------------------------------------------------------------
// O'qiladigan kontent (kitob va komiks)
// ---------------------------------------------------------------------------

/** `PagedReader` kutgan to'liq model. */
export interface ReadableView {
  id: string;
  title: string;
  pages: ReaderPage[];
  audioUrls?: { uz?: string; ru?: string; en?: string };
  /** Bog'langan test — o'quvchining oxirgi sahifasida tugma chiqadi. */
  testId?: string;
}

/**
 * Kitob yoki komiksni sahifalari bilan birga oladi.
 *
 * `kind` sahifalar QAYSI jadvaldan olinishini belgilaydi: komikslar
 * `info_comic_page` da (matn maydoni `script`), kitoblar `info_book_page` da
 * (matn maydoni `text`).
 *
 * DIQQAT — komiks uchi hozir `[AllowAnonymous]` emas, ya'ni sahifalar bo'sh
 * keladi va o'quvchi «sahifa yo'q» holatini ko'rsatadi. Bu backend kamchiligi,
 * `services.ts` dagi `fetchComicPages` izohiga qarang.
 */
export const getReadable = cache(
  async (id: string, locale: string, kind: "book" | "comic"): Promise<ReadableView | null> => {
    // Komiks — «etiket» bo'limi, kitob — «kutubxona». Bo'lim tekshiruvi
    // `/books/{etiket-id}` kabi noto'g'ri manzillarni 404 ga oborib qo'yadi.
    const item = await getSectionItem(kind === "comic" ? "etiquette" : "books", id, locale);
    if (!item) return null;

    const contentItemId = item.raw.id;

    if (kind === "comic") {
      const all = await fetchComicPages();
      const pages = all.filter((page) => page.contentItemId === contentItemId);
      return {
        id: item.id,
        title: item.title,
        pages: comicToReaderPages(pages),
        audioUrls: readerAudioUrls(pages),
        testId: await findTestId(contentItemId),
      };
    }

    const all = await fetchBookPages();
    const pages = all.filter((page) => page.contentItemId === contentItemId);
    return {
      id: item.id,
      title: item.title,
      pages: toReaderPages(pages),
      audioUrls: readerAudioUrls(pages),
      testId: await findTestId(contentItemId),
    };
  },
);

async function findTestId(contentItemId: number): Promise<string | undefined> {
  const tests = await fetchTests();
  const testId = buildTestIndex(tests).get(contentItemId);
  return testId !== undefined ? String(testId) : undefined;
}

/** «Ota-onalar uchun» bo'limidagi barcha kontent — audiensiya bo'yicha. */
export const getParentsContent = cache(async (locale: string): Promise<ContentItemView[]> => {
  const [items, tests] = await Promise.all([fetchContentItems(), fetchTests()]);
  const testIndex = buildTestIndex(tests);

  return items
    .filter(isPublic)
    .filter((dto) => dto.audienceId === AUDIENCE_OTA_ONALAR)
    .map((dto) => toContentItemView(dto, locale, testIndex))
    .sort(byNewestFirst);
});
