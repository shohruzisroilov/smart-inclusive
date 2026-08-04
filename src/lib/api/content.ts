import type { ContentItemDto } from './types'

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
