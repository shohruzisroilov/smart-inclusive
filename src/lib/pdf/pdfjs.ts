import * as pdfjs from 'pdfjs-dist'
import PdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?worker'

/**
 * pdf.js ni sozlashning YAGONA joyi.
 *
 * Vorker Vite'ning `?worker` importi orqali ulanadi — CDN'dan emas. Sabab:
 * `GlobalWorkerOptions.workerSrc` ga tashqi manzil berilsa, sayt begona
 * domenga bog'lanib qoladi va versiya kutubxonanikidan farq qilsa reader
 * jimgina ishlamay qo'yadi. `?worker` esa vorkerni bandlga qo'shadi, ya'ni
 * versiya har doim mos keladi.
 *
 * Modul birinchi importda bir marta bajariladi, shuning uchun sozlash
 * takrorlanmaydi.
 */
pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker()

export { pdfjs }
export type PdfDocument = pdfjs.PDFDocumentProxy
