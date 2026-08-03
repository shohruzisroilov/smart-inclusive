const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.smart-inklyuziv.uz'

/**
 * Bekend fayl yo'llarini brauzer ocha oladigan URL'ga aylantiradi.
 *
 * MUAMMO: `UploadFile` uchlari faylning SERVER YO'LINI qaytaradi (masalan
 * `/var/www/.../ContentItems/abc.jpg`) va adminka aynan shu satrni `imageUrl`
 * maydoniga yozadi. Bu satr URL emas — `<img src>` ga qo'yilsa hech qachon
 * yuklanmaydi.
 *
 * YECHIM: faylni faqat mos `DownloadFile/{fileName}` uchi qaytara oladi.
 * Har bir uch faqat BITTA papkaga qaraydi (`ContentItemService` -> "ContentItems",
 * `TestService` -> "TestFiles", `VocabularyTopicService` -> "VocabularyTopic"),
 * shuning uchun uch fayl turiga emas, fayl QAYSI PAPKAGA yozilganiga qarab
 * tanlanadi.
 *
 * DIQQAT: `BookPages`, `ComicPages` va `VocabularyWordAudio` papkalari uchun
 * bekendda `DownloadFile` HOZIRCHA YO'Q (kitob/komiks sahifa rasmlari va so'z
 * audiosi shu papkalarga tushadi). Ular uchun `null` qaytadi — mavjud bo'lmagan
 * uchga havola yasab foydalanuvchini 404 ga yubormaslik uchun. Bekendga o'sha
 * uchlar qo'shilgach, quyidagi jadvalga bir qatordan qo'shish kifoya.
 *
 * Adminkadagi `adm/src/utils/downloadFileUrl.ts` bilan bir xil mantiq.
 */
const DOWNLOAD_BASE_PATH_BY_FOLDER: Record<string, string> = {
  ContentItems: '/ContentItem',
  TestFiles: '/Test',
  VocabularyTopic: '/VocabularyTopic',
}

/**
 * Bekend fayl yo'li saqlanadigan maydonlar. `youtubeUrl` bu ro'yxatda YO'Q —
 * u haqiqiy tashqi havola va tegilmasligi kerak.
 */
const MEDIA_FIELDS = [
  'imageUrl',
  'coverImageUrl',
  'pdfFileUrl',
  'mediaUrl',
  'thumbnailUrl',
  'audioUrlUz',
  'audioUrlRu',
  'audioUrlEn',
] as const

/**
 * Yozuvdagi barcha media maydonlarini o'rnida URL'ga aylantiradi.
 *
 * Konvertatsiya MA'LUMOT CHEGARASIDA (`services.ts`) bir marta bajariladi —
 * shunda 20 dan ortiq `<img :src>` joyida takrorlash shart emas va komponentlar
 * hech qachon xom server yo'lini ko'rmaydi.
 */
export function normalizeMedia<T>(entity: T): T {
  if (!entity || typeof entity !== 'object') return entity

  const record = entity as Record<string, unknown>
  for (const field of MEDIA_FIELDS) {
    const value = record[field]
    if (typeof value === 'string') record[field] = toMediaUrl(value)
  }
  return entity
}

export function toMediaUrl(storedPath: string | null | undefined): string | null {
  if (!storedPath) return null

  // Adminkaga to'g'ridan-to'g'ri tashqi havola kiritilgan bo'lishi ham mumkin.
  if (/^(https?:)?\/\//i.test(storedPath) || storedPath.startsWith('data:')) {
    return storedPath
  }

  const segments = storedPath.split(/[/\\]/).filter(Boolean)
  const fileName = segments.at(-1)
  const folder = segments.at(-2)
  if (!fileName || !folder) return null

  const basePath = DOWNLOAD_BASE_PATH_BY_FOLDER[folder]
  if (!basePath) return null

  return `${API_BASE_URL}${basePath}/DownloadFile/${encodeURIComponent(fileName)}`
}
