/**
 * Backend saqlagan fayl yo'lini brauzer ocha oladigan URL ga aylantirish.
 *
 * `UploadFile` uchlari fayl MAZMUNINI emas, SERVER YO'LINI qaytaradi
 * (`/app/ContentItems/<GUID>_<nom>.pdf`) — bu yo'lni to'g'ridan-to'g'ri
 * `<img src>` ga berib bo'lmaydi. Faylni faqat mos `DownloadFile/{fileName}`
 * uchi beradi va har bir uch FAQAT BITTA papkaga qaraydi, shuning uchun
 * endpoint fayl turiga emas, fayl QAYSI PAPKAGA yozilganiga qarab tanlanadi.
 *
 * Adminkadagi `adm/src/utils/downloadFileUrl.ts` bilan bir xil mantiq.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

/**
 * Papka -> uni bera oladigan kontroller.
 *
 * `BookPages`, `ComicPages` va `VocabularyWordAudio` ataylab YO'Q: backendda
 * bu papkalar uchun `DownloadFile` uchi hali yozilmagan. Ular uchun `null`
 * qaytariladi — mavjud bo'lmagan manzilga havola yasab, foydalanuvchini 404 ga
 * yuborgandan ko'ra, kontentni umuman ko'rsatmagan afzal. Backendga o'sha
 * uchlar qo'shilgach, shu jadvalga bir qator qo'shish kifoya.
 */
const DOWNLOAD_CONTROLLER_BY_FOLDER: Record<string, string> = {
  ContentItems: "/ContentItem",
  TestFiles: "/Test",
  VocabularyTopic: "/VocabularyTopic",
};

/**
 * Saqlangan yo'ldan ochiladigan URL yasaydi.
 *
 * @returns Havola, yoki faylni bera oladigan uch bo'lmasa `null`.
 */
export function toFileUrl(storedPath: string | null | undefined): string | null {
  if (!storedPath) return null;

  // Backend ba'zi maydonlarga tashqi havola ham yozishi mumkin (masalan
  // muqova rasmi CDN'da bo'lsa) — bunday qiymat o'zgarishsiz o'tadi.
  if (/^https?:\/\//i.test(storedPath)) return storedPath;

  const segments = storedPath.split(/[/\\]/).filter(Boolean);
  const fileName = segments.at(-1);
  const folder = segments.at(-2);
  if (!fileName || !folder) return null;

  const controller = DOWNLOAD_CONTROLLER_BY_FOLDER[folder];
  if (!controller) return null;

  return `${API_BASE_URL}${controller}/DownloadFile/${encodeURIComponent(fileName)}`;
}

/**
 * Faylni bera oladigan uch BORmi — sahifa «rasm hali mavjud emas» holatini
 * ko'rsatishi kerakmi yoki yo'qmi, shu bilan hal qilinadi.
 */
export function isServableFile(storedPath: string | null | undefined): boolean {
  return toFileUrl(storedPath) !== null;
}
