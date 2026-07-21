import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Til marshrutlash qatlami.
 *
 * ESLATMA: Next.js 16 dan boshlab bu fayl `middleware.ts` emas, `proxy.ts`
 * deb nomlanadi. Vazifasi o'zgarmagan.
 *
 * Nima qiladi:
 *  - `/` → `/uz` (yoki `NEXT_LOCALE` cookie / `Accept-Language` bo'yicha);
 *  - til prefiksisiz yo'llarni to'g'ri tilga yo'naltiradi;
 *  - til almashtirilganda `NEXT_LOCALE` cookie'sini yozadi.
 */
export default createMiddleware(routing);

export const config = {
  // API, Next ichki fayllari va statik fayllardan tashqari hamma narsa.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
