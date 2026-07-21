/**
 * "Platforma raqamlarda" ko'rsatkichlari.
 *
 * ⚠️ QIYMATLAR VAQTINCHA — haqiqiy statistika bilan almashtirilishi kerak.
 *
 * Keyinchalik bu ma'lumot backend'dan kelishi mumkin: `TrustNumberBar`
 * `items` propini qabul qiladi, shuning uchun komponentni o'zgartirmasdan
 * server'dan uzatish yetarli bo'ladi.
 */

export type TrustNumberIcon = "children" | "lessons" | "volunteers" | "regions";

export interface TrustNumberItem {
  id: string;
  icon: TrustNumberIcon;
  value: number;
  /** `messages/*.json` → `trustBar` bo'limidagi kalit. */
  labelKey: string;
  /** Masalan "+" — "1 200+" ko'rinishi uchun. */
  suffix?: string;
}

export const TRUST_NUMBERS: TrustNumberItem[] = [
  { id: "children", icon: "children", value: 1200, labelKey: "children", suffix: "+" },
  { id: "lessons", icon: "lessons", value: 180, labelKey: "lessons" },
  { id: "volunteers", icon: "volunteers", value: 64, labelKey: "volunteers" },
  { id: "regions", icon: "regions", value: 14, labelKey: "regions" },
];
