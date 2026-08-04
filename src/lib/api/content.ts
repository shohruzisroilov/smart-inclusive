import type { ContentItemDto } from './types'
import { extractVideoId } from '@/lib/youtube'
import {
  CONTENT_CATEGORY_DARSLAR,
  CONTENT_CATEGORY_ETIKET,
  CONTENT_CATEGORY_KUTUBXONA,
  CONTENT_CATEGORY_MEN_QILA_OLAMAN,
  CONTENT_CATEGORY_OTA_ONALAR_VIDEO,
  CONTENT_CATEGORY_UYDA_TALIM,
  CONTENT_TYPE_KOMIKS,
} from './constants'

/**
 * Kontent yozuvlari uchun umumiy yordamchi funksiyalar.
 *
 * Sarlavha bekendda uch ustunda saqlanadi (`titleUz/Ru/En`), tavsif esa
 * bittada — shuning uchun faqat sarlavha tilga qarab tanlanadi.
 */

/**
 * `publishedDate` ni `Date` ga o'giradi.
 *
 * DIQQAT: bekend `DateOnly` ni ISO'da emas, **`kun.oy.yil`** ko'rinishida
 * beradi (`"04.08.2026"` — jonli API'da tekshirilgan). Bunday satrni to'g'ridan
 * to'g'ri `new Date()` ga berish JIM XATO tug'diradi: brauzer uni amerikacha
 * `oy/kun/yil` deb o'qib, 4-avgustni 8-aprelga aylantiradi. Shu sababli
 * kunlar ro'yxatda noto'g'ri saralanardi va sahifada noto'g'ri sana chiqardi.
 *
 * ISO shakli ham qabul qilinadi — bekend keyinchalik formatni to'g'rilasa,
 * bu funksiyani o'zgartirish shart bo'lmasin.
 */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null

  const dotted = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  if (dotted) {
    const [, day, month, year] = dotted
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Kartochka va material sahifasidagi sana (TZ 5.1). */
export function formatApiDate(value: string | null | undefined, locale: string): string {
  const date = parseApiDate(value)
  if (!date) return ''
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

export function localizedTitle(item: ContentItemDto, locale: string): string {
  if (locale === 'ru') return item.titleRu || item.titleUz
  if (locale === 'en') return item.titleEn || item.titleUz
  return item.titleUz
}

/**
 * «Ota-onalar uchun» maqola turkumiga tegishlilikni tekshiradi.
 *
 * MUAMMO: bekendda AYNAN BIR XIL uchta turkum ikkita alohida ro'yxatda yashaydi:
 *   - `ContentCategorySelectList` -> psixologiya=7, ta'lim=8, huquqiy=9
 *   - `ArticleCategorySelectList` -> psixologiya=1, ta'lim=2, huquqiy=3
 *
 * Adminka ham ikkalasini so'raydi: `categoryId` har qanday material uchun,
 * `articleCategoryId` esa faqat «maqola» turi uchun qo'shimcha maydon sifatida.
 * Ya'ni bitta maqolani ikki xil yo'l bilan «huquqiy» deb belgilash mumkin va
 * qaysi biri tanlangani muharrirga bog'liq.
 *
 * Sayt avval faqat `categoryId` ga qarardi — natijada `articleCategoryId`
 * orqali turkumlangan maqola hech bir bo'limga tushmay yo'qolib qolardi.
 * Shuning uchun bu yerda IKKALA belgi ham qabul qilinadi.
 */
export function inArticleCategory(
  item: ContentItemDto,
  contentCategoryId: number,
  articleCategoryId: number,
): boolean {
  return item.categoryId === contentCategoryId || item.articleCategoryId === articleCategoryId
}

/**
 * Yozuv qaysi manzilda ochilishini aniqlaydi.
 *
 * Sayt bo'limlarga BO'LINGAN, bekend esa hamma narsani bitta `ContentItem`
 * jadvalida saqlaydi — ya'ni bir yozuvning «o'z sahifasi» uning kategoriyasidan
 * kelib chiqadi. Bosh sahifadagi ro'yxatlar aralash kategoriyalarni ko'rsatgani
 * uchun bu bog'lanish bir joyda bo'lishi kerak, aks holda har bir blokda
 * takrorlanardi.
 */
export function routeForContentItem(item: ContentItemDto): string {
  switch (item.categoryId) {
    case CONTENT_CATEGORY_ETIKET:
      // Etiket bo'limida komiks ham, video ham bo'lishi mumkin.
      return item.typeId === CONTENT_TYPE_KOMIKS ? `/comics/${item.id}` : `/etiquette/${item.id}`
    case CONTENT_CATEGORY_MEN_QILA_OLAMAN:
      return `/i-can-do-it/${item.id}`
    case CONTENT_CATEGORY_DARSLAR:
      return `/lessons/${item.id}`
    case CONTENT_CATEGORY_KUTUBXONA:
      return `/books/${item.id}`
    case CONTENT_CATEGORY_OTA_ONALAR_VIDEO:
      return `/for-parents/videos/${item.id}`
    case CONTENT_CATEGORY_UYDA_TALIM:
      return `/for-parents/home-education/${item.id}`
    default:
      return `/for-parents/articles/${item.id}`
  }
}

/**
 * YouTube prevyu rasmi.
 *
 * Video kartochkasi uchun alohida muqova shart emas — YouTube har bir video
 * uchun tayyor prevyu beradi (`hqdefault` barcha videolarda mavjud). Yozuvning
 * o'z `coverImageUrl` i bo'lsa u ustunroq: muharrir ataylab tanlagan rasm.
 */
export function youtubeThumbnail(youtubeUrl: string | null | undefined): string | null {
  const id = extractVideoId(youtubeUrl)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
