import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Shartli klasslarni birlashtiradi va Tailwind ziddiyatlarini hal qiladi.
 *
 *   cn("px-4", condition && "px-6")  →  "px-6"
 *
 * Bu komponentlarga `className` prop orqali tashqaridan stil berish
 * imkonini beradi — qayta ishlatiladigan komponentlar uchun majburiy.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
