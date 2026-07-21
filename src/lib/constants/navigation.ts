/**
 * Sayt navigatsiyasi — yagona manba.
 *
 * Header, mobil menyu va Footer shu ro'yxatdan quriladi. Yangi sahifa
 * qo'shilganda faqat shu fayl va tarjima fayllari o'zgaradi.
 *
 * `labelKey` — `messages/*.json` dagi `nav` bo'limiga nisbatan kalit.
 * Matn bu yerda saqlanmaydi (aks holda 3 tilni qo'llab bo'lmaydi).
 *
 * URL slug'lari barcha tillarda INGLIZCHA qoladi: canonical URL barqaror
 * bo'ladi va routing soddalashadi.
 */

export interface NavItem {
  href: string;
  labelKey: string;
  children?: NavItem[];
}

// DIQQAT: bolalar bo'limi sahifalari (etiket, "men qila olaman", darslar,
// kitoblar, testlar) hali qurilmagan. Ular tayyor bo'lguncha faqat mavjud
// yagona bola-sahifasi — lug'at (/vocabulary) — havolada qoladi.
export const KIDS_NAV: NavItem[] = [
  { href: "/vocabulary", labelKey: "kidsItems.dictionary" },
];

export const PARENTS_NAV: NavItem[] = [
  { href: "/for-parents/tests", labelKey: "parentsItems.tests" },
  { href: "/for-parents/videos", labelKey: "parentsItems.videoLessons" },
  { href: "/for-parents/legal", labelKey: "parentsItems.legalArticles" },
  { href: "/for-parents/articles", labelKey: "parentsItems.articles" },
  { href: "/for-parents/onboarding", labelKey: "parentsItems.onboarding" },
  { href: "/for-parents/presentation", labelKey: "parentsItems.presentation" },
  { href: "/for-parents/home-education", labelKey: "parentsItems.homeEducation" },
];

export const MAIN_NAV: NavItem[] = [
  // Bolalar bo'limi hozircha faqat lug'atdan iborat — to'g'ridan-to'g'ri unga.
  { href: "/vocabulary", labelKey: "kids" },
  { href: "/for-parents", labelKey: "parents", children: PARENTS_NAV },
  { href: "/about-project", labelKey: "aboutProject" },
  { href: "/volunteers", labelKey: "volunteers" },
  { href: "/about-us", labelKey: "aboutUs" },
  { href: "/contact", labelKey: "contact" },
];

/** Asosiy harakat tugmasi — header va footerda ajratib ko'rsatiladi. */
export const CTA_NAV: NavItem = {
  href: "/become-volunteer",
  labelKey: "becomeVolunteer",
};

/** Footer ustunlari. */
export const FOOTER_NAV: NavItem[] = [
  { href: "/about-project", labelKey: "aboutProject" },
  { href: "/about-us", labelKey: "aboutUs" },
  { href: "/volunteers", labelKey: "volunteers" },
  { href: "/contact", labelKey: "contact" },
];
