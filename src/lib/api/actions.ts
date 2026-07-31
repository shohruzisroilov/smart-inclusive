"use server";

import { ApiError } from "./client";
import { createContactRequest, createVolunteerApplication } from "./services";

/**
 * Saytdan yuboriladigan formalar uchun server funksiyalari.
 *
 * Nega server funksiyasi: `ContactRequest/Create` va
 * `VolunteerApplication/Create` — saytning bekendga YOZADIGAN yagona ikki uchi.
 * Ularni brauzerdan to'g'ridan-to'g'ri chaqirish API manzilini ochib qo'yardi va
 * CORS sozlashni talab qilardi; server funksiyasi ikkalasini ham keraksiz qiladi.
 *
 * Natija har doim `FormResult` — chaqiruvchi komponent xatoni ko'rsata olishi
 * uchun. Xato ATAYLAB `throw` qilinmaydi: forma xatosi sahifani buzmasligi kerak.
 */
export interface FormResult {
  ok: boolean;
  /** `ok: false` bo'lganda foydalanuvchiga ko'rsatiladigan sabab kaliti. */
  reason?: "validation" | "network" | "server";
}

/** Telefon: 9–15 raqam, ixtiyoriy «+» bilan. */
function isValidPhone(phone: string): boolean {
  return /^\+?[0-9]{9,15}$/.test(phone.replace(/[\s-]/g, ""));
}

function toFormResult(error: unknown): FormResult {
  if (error instanceof ApiError) {
    // `status: 0` — tarmoq uzilishi yoki timeout (`client.ts` shunday belgilaydi).
    return { ok: false, reason: error.status === 0 ? "network" : "server" };
  }
  return { ok: false, reason: "server" };
}

// ---------------------------------------------------------------------------
// Aloqa formasi
// ---------------------------------------------------------------------------

export async function submitContactRequest(input: {
  fullName: string;
  phone: string;
  message: string;
}): Promise<FormResult> {
  const fullName = input.fullName?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  // Backend DTO'sida uchalasi ham nullable emas — bo'sh qiymat 400 beradi,
  // shuning uchun serverda ham tekshiriladi (brauzerdagi tekshiruv yetarli emas).
  if (!fullName || !message || !isValidPhone(phone)) {
    return { ok: false, reason: "validation" };
  }

  try {
    await createContactRequest({ fullName, phone, message });
    return { ok: true };
  } catch (error) {
    return toFormResult(error);
  }
}

// ---------------------------------------------------------------------------
// Ko'ngilli arizasi
// ---------------------------------------------------------------------------

export async function submitVolunteerApplication(input: {
  fullName: string;
  phone: string;
  regionId: number;
  email?: string;
  age?: number;
  message?: string;
}): Promise<FormResult> {
  const fullName = input.fullName?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";

  // `region_id` — `NOT NULL` tashqi kalit, shuning uchun majburiy.
  if (!fullName || !isValidPhone(phone) || !Number.isInteger(input.regionId)) {
    return { ok: false, reason: "validation" };
  }

  try {
    await createVolunteerApplication({
      fullName,
      phone,
      regionId: input.regionId,
      email: input.email?.trim() || null,
      // `age` — `int?`, bo'sh satr backendga `null` bo'lib ketishi kerak.
      age: Number.isFinite(input.age) ? input.age : null,
      message: input.message?.trim() || null,
    });
    return { ok: true };
  } catch (error) {
    return toFormResult(error);
  }
}
