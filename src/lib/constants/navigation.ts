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

export const KIDS_NAV: NavItem[] = [
  { href: "/etiquette", labelKey: "kidsItems.etiquette" },
  { href: "/i-can-do-it", labelKey: "kidsItems.iCan" },
  { href: "/lessons", labelKey: "kidsItems.lessons" },
  { href: "/books", labelKey: "kidsItems.books" },
  { href: "/vocabulary", labelKey: "kidsItems.dictionary" },
  { href: "/tests", labelKey: "kidsItems.tests" },
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
  { href: "/etiquette", labelKey: "kids", children: KIDS_NAV },
  { href: "/for-parents", labelKey: "parents", children: PARENTS_NAV },
  { href: "/about-project", labelKey: "aboutProject" },
  { href: "/volunteers", labelKey: "volunteers" },
  { href: "/about-us", labelKey: "aboutUs" },
  { href: "/contact", labelKey: "contact" },
];

/**
 * "Bo'limlar" dropdownidagi bandlar — bolalar/ota-onalardan tashqari
 * qolgan yuqori darajali sahifalar. Header'da alohida dropdown sifatida
 * ko'rsatiladi.
 */
export const SECTIONS_NAV: NavItem[] = [
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
