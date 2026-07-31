/**
 * Backend bilan ishlash uchun yagona `fetch` o'ramchisi.
 *
 * FAQAT SERVER KOMPONENTLARIDA ishlatiladi — `next: { revalidate }` va
 * `AbortSignal.timeout` server muhitiga tayanadi. Shu tanlov tufayli brauzerga
 * ortiqcha JS ketmaydi va CORS muammosi umuman tug'ilmaydi.
 *
 * (`import "server-only"` qo'yilmagan: paket loyihaga o'rnatilmagan. Yangi
 * bog'liqlik qo'shilsa, shu faylning birinchi qatoriga qo'yish tavsiya etiladi.)
 */

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

/** Bekend javob bermaganda sahifa qulab tushmasligi uchun so'rov chegarasi. */
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiOptions {
  /**
   * Next.js ma'lumot keshining amal qilish muddati (soniya).
   *
   * Backendning ro'yxat uchlari `POST` — Next `POST` javoblarini avtomatik
   * keshlamaydi, shuning uchun bu qiymat faqat `GET` uchun kuch oladi.
   * `POST` ro'yxatlari har so'rovda qaytadan olinadi (`react.cache` bitta
   * render ichida takrorlanishning oldini oladi — `services.ts` ga qarang).
   */
  revalidate?: number;
  /** On-demand yangilash uchun teg. */
  tags?: string[];
}

/** Sukut bo'yicha kesh muddati — kontent kuniga bir necha marta o'zgaradi. */
export const DEFAULT_REVALIDATE = 300;

function assertBaseUrl(path: string): void {
  if (!BASE_URL) {
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL sozlanmagan — `.env.local` ni tekshiring.",
      0,
      path,
    );
  }
}

async function request<T>(path: string, init: RequestInit, options: ApiOptions): Promise<T> {
  assertBaseUrl(path);

  const { revalidate = DEFAULT_REVALIDATE, tags } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate, ...(tags ? { tags } : {}) },
    });
  } catch (cause) {
    // Tarmoq uzilishi / timeout — `fetch` `TypeError` yoki `TimeoutError` beradi.
    throw new ApiError(
      cause instanceof Error ? cause.message : "Tarmoq xatosi",
      0,
      path,
    );
  }

  if (!response.ok) {
    // Backend xatoni ba'zan JSON, ba'zan oddiy matn bilan qaytaradi — ikkalasini
    // ham ushlab, xabarni imkon qadar mazmunli qilamiz.
    const body = await response.text().catch(() => "");
    throw new ApiError(body.slice(0, 300) || response.statusText, response.status, path);
  }

  // `204 No Content` va bo'sh tanali javoblar (`Reorder` kabi) uchun.
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export function apiGet<T>(path: string, options: ApiOptions = {}): Promise<T> {
  return request<T>(path, { method: "GET" }, options);
}

/**
 * Backendning barcha `GetList` uchlari `POST` (filtr tanasi bilan), shuning
 * uchun o'qish uchun ham `POST` ishlatiladi — bu backend konvensiyasi.
 */
export function apiPost<T>(path: string, body: unknown, options: ApiOptions = {}): Promise<T> {
  return request<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    },
    options,
  );
}

/**
 * Ro'yxat so'rovlarini xatoga chidamli qilish.
 *
 * Bekend yiqilsa yoki bitta bo'lim uchi 401 bersa, butun sahifa 500 bo'lib
 * ketmasligi kerak — bo'sh ro'yxat qaytaramiz va xatoni serverda qayd qilamiz.
 * Chaqiruv joyi bo'sh ro'yxatni «hozircha kontent yo'q» holati sifatida ko'rsatadi.
 */
export async function safeList<T>(promise: Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await promise;
  } catch (error) {
    logApiFailure(label, error);
    return [];
  }
}

/** Bitta yozuv uchun: topilmasa yoki xato bo'lsa `null`. Sahifa 404 ko'rsatadi. */
export async function safeItem<T>(promise: Promise<T>, label: string): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    logApiFailure(label, error);
    return null;
  }
}

/**
 * `console.warn`, `console.error` EMAS — ataylab.
 *
 * `safeList`/`safeItem` ga tushgan xato allaqachon HAL QILINGAN: sahifa
 * qulamaydi, bo'sh holat ko'rsatiladi. `console.error` bo'lsa Next.js dev
 * qatlami uni brauzerda qizil «Console Error» oynasi qilib chiqaradi va
 * bekenddagi bitta yopiq uch (masalan `ComicPage/GetList` -> 401) butun
 * ishlashni to'sib qo'yadi.
 *
 * Ogohlantirish terminalda ham, brauzer konsolida ham ko'rinib turadi —
 * ya'ni ma'lumot yo'qolmaydi, faqat «to'xtat» darajasidan tushiriladi.
 */
function logApiFailure(label: string, error: unknown): void {
  if (error instanceof ApiError) {
    console.warn(`[api] ${label} -> ${error.status} ${error.path}: ${error.message}`);
  } else {
    console.warn(`[api] ${label} -> kutilmagan xato:`, error);
  }
}
