import type { ContentItemDto } from './types'

/**
 * Kontent yozuvlari uchun umumiy yordamchi funksiyalar.
 *
 * Sarlavha bekendda uch ustunda saqlanadi (`titleUz/Ru/En`), tavsif esa
 * bittada — shuning uchun faqat sarlavha tilga qarab tanlanadi.
 */

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
