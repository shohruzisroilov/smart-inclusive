/**
 * Backenddagi `SmartInklyuziv.Core/Constants` va `Persistence/Scripts` dagi
 * enum jadvallarining nusxasi.
 *
 * Bu qiymatlar SELECT-list orqali emas, kodda qattiq yozib qo'yilgan — chunki
 * backendning o'zi ham ularni konstanta sifatida ishlatadi (`ContentTypeIdConst`,
 * `LanguageIdConst`, ...), ya'ni id'lar barqaror. Adminkadagi
 * `adm/src/api/backendConstants.ts` bilan bir xil bo'lishi shart.
 */

/** `enum_status` — `StatusIdConst`. */
export const STATE_ACTIVE = 1;
export const STATE_PASSIVE = 2;

/**
 * `info_country` (`0002 COUNTRY REGION DISTRICT.sql`).
 *
 * `SelectList/RegionSelectList/{countryId}` majburiy yo'l parametri talab qiladi.
 */
export const COUNTRY_UZBEKISTAN = 1;

/** `enum_language` — `LanguageIdConst`. */
export const LANGUAGE_UZ = 1;
export const LANGUAGE_RU = 2;
export const LANGUAGE_EN = 3;

/** `enum_content_type` — `ContentTypeIdConst`. */
export const CONTENT_TYPE_KOMIKS = 1;
export const CONTENT_TYPE_KITOB = 2;
export const CONTENT_TYPE_VIDEO = 3;
export const CONTENT_TYPE_MAQOLA = 4;

/**
 * `enum_content_category` (`009 CREATE TABLE info_content_item.sql`).
 *
 * Sayt navigatsiyasi shu kategoriyalarga tayanadi: har bir bo'lim sahifasi
 * `ContentItem` ro'yxatini shu id bo'yicha ajratadi.
 */
export const CONTENT_CATEGORY_ETIKET = 1;
export const CONTENT_CATEGORY_MEN_QILA_OLAMAN = 2;
export const CONTENT_CATEGORY_DARSLAR = 3;
export const CONTENT_CATEGORY_KUTUBXONA = 4;
export const CONTENT_CATEGORY_OTA_ONALAR_VIDEO = 5;
export const CONTENT_CATEGORY_UYDA_TALIM = 6;
export const CONTENT_CATEGORY_PSIXOLOGIYA = 7;
export const CONTENT_CATEGORY_TALIM = 8;
export const CONTENT_CATEGORY_HUQUQIY = 9;

/** `enum_content_status`. Saytda FAQAT «e'lon qilingan» ko'rinadi. */
export const CONTENT_STATUS_QORALAMA = 1;
export const CONTENT_STATUS_PUBLISHED = 2;
export const CONTENT_STATUS_KUTILMOQDA = 3;

/** `enum_content_audience`. */
export const AUDIENCE_BOLALAR = 1;
export const AUDIENCE_OTA_ONALAR = 2;

/** `enum_article_category` — «Ota-onalar uchun» maqolalarining ichki bo'limi. */
export const ARTICLE_CATEGORY_PSIXOLOGIYA = 1;
export const ARTICLE_CATEGORY_TALIM = 2;
export const ARTICLE_CATEGORY_HUQUQIY = 3;

/** `enum_test_type` — savol va javob varianti turi. */
export const TEST_TYPE_TEXT = 1;
export const TEST_TYPE_IMAGE = 2;

/** `enum_slide_scenario` (`023 CREATE TABLE info_slide.sql`). */
export const SLIDE_SCENARIO_ONBOARDING = 1;
export const SLIDE_SCENARIO_PRESENTATION = 2;
export const SLIDE_SCENARIO_ABOUT_PROJECT = 3;

/**
 * `enum_audio_generation_status` — `AudioGenerationStatusIdConst`.
 *
 * Audio backend tomonda yasaladi; SUCCESS bo'lmagan audio havolasi hali
 * tayyor emas, shuning uchun pleyerga berilmaydi.
 */
export const AUDIO_STATUS_PENDING = 1;
export const AUDIO_STATUS_PROCESSING = 2;
export const AUDIO_STATUS_SUCCESS = 3;
export const AUDIO_STATUS_FAILURE = 4;

/** `enum_volunteer_application_status`. */
export const VOLUNTEER_APPLICATION_STATUS_NEW = 1;

/** `enum_contact_request_status`. */
export const CONTACT_REQUEST_STATUS_NEW = 1;

/** Interfeys tili -> backend `language_id`. */
export const LANGUAGE_ID_BY_LOCALE: Record<string, number> = {
  uz: LANGUAGE_UZ,
  ru: LANGUAGE_RU,
  en: LANGUAGE_EN,
};

export function languageIdOf(locale: string): number {
  return LANGUAGE_ID_BY_LOCALE[locale] ?? LANGUAGE_UZ;
}
