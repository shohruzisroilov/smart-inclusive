import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigatsiya primitivlari.
 *
 * Loyihada `next/link` va `next/navigation` O'RNIGA HAR DOIM shular ishlatiladi —
 * aks holda til prefiksi yo'qoladi.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
