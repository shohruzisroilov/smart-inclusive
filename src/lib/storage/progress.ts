/**
 * Foydalanuvchi progressi — SERVERSIZ, faqat brauzerda (TZ 3.4, 12.3, 13.5).
 *
 * Ochiq sayt avtorizatsiyasiz ishlaydi, shuning uchun "o'qildi", xatcho'p va
 * test natijalari hisob yozuvisiz, `localStorage` da saqlanadi.
 *
 * Kalitlar TZ 13.5 jadvalidagi nomlar bilan aynan bir xil (`si_` prefiksi).
 * Sozlamalar (til, mavzu, shrift) alohida `si:settings` da — u boshqa
 * hujjatdagi tuzilma, shuning uchun aralashtirilmaydi.
 */

export const PROGRESS_KEYS = {
  /** `{ [contentItemId]: true }` — ko'rilgan/o'qilgan materiallar. */
  viewed: 'si_progress_viewed',
  /** `{ [contentItemId]: pageNumber }` — kitob/komiks xatcho'pi. */
  bookmarks: 'si_bookmarks',
  /** `{ [testId]: TestResult }` — oxirgi natija (tarix yuritilmaydi). */
  testResults: 'si_test_results',
  /** Kontent tili filtri — foydalanuvchi tanlagan bo'lsa. */
  contentLanguage: 'si_content_language',
  /** Mini-personaj yig'ilganmi. */
  mascotCollapsed: 'si_mascot_collapsed',
} as const

export interface TestResult {
  passed: boolean
  score: number
  total: number
  completedAt: string
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    // Buzilgan yoki qo'lda tahrirlangan qiymat progressni yo'qotadi,
    // lekin sahifani sindirmasligi kerak.
    return fallback
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* kvota to'lgan yoki private rejim — progress shu sessiyada ishlayveradi */
  }
}

// --- Ko'rildi / o'qildi (TZ 3.4) ------------------------------------------

export function getViewed(): Record<number, true> {
  return read<Record<number, true>>(PROGRESS_KEYS.viewed, {})
}

export function isViewed(contentItemId: number): boolean {
  return getViewed()[contentItemId] === true
}

/** Idempotent — TZ 10.3 «ko'rilgan deb belgilash» talabiga ko'ra. */
export function markViewed(contentItemId: number): void {
  const all = getViewed()
  if (all[contentItemId]) return
  all[contentItemId] = true
  write(PROGRESS_KEYS.viewed, all)
}

// --- Xatcho'p (TZ 10.2) ---------------------------------------------------

export function getBookmarks(): Record<number, number> {
  return read<Record<number, number>>(PROGRESS_KEYS.bookmarks, {})
}

export function getBookmark(contentItemId: number): number | null {
  return getBookmarks()[contentItemId] ?? null
}

export function setBookmark(contentItemId: number, pageNumber: number): void {
  const all = getBookmarks()
  all[contentItemId] = pageNumber
  write(PROGRESS_KEYS.bookmarks, all)
}

// --- Test natijalari (TZ 9.3) ---------------------------------------------

/** TZ 9.2/9.3 — o'tish chegarasi. */
export const PASS_THRESHOLD = 60

export function getTestResults(): Record<number, TestResult> {
  return read<Record<number, TestResult>>(PROGRESS_KEYS.testResults, {})
}

export function getTestResult(testId: number): TestResult | null {
  return getTestResults()[testId] ?? null
}

/** Qayta topshirilganda oxirgi natija QAYTA YOZILADI — urinishlar tarixi yo'q. */
export function saveTestResult(testId: number, score: number, total: number): TestResult {
  const percent = total > 0 ? Math.round((score / total) * 100) : 0
  const result: TestResult = {
    passed: percent >= PASS_THRESHOLD,
    score,
    total,
    completedAt: new Date().toISOString(),
  }
  const all = getTestResults()
  all[testId] = result
  write(PROGRESS_KEYS.testResults, all)
  return result
}

// --- Mini-personaj (TZ 12.2) ----------------------------------------------

export function isMascotCollapsed(): boolean {
  return read<boolean>(PROGRESS_KEYS.mascotCollapsed, false)
}

export function setMascotCollapsed(value: boolean): void {
  write(PROGRESS_KEYS.mascotCollapsed, value)
}
