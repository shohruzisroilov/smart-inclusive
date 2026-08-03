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
