import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Outfit, Inter } from "next/font/google";
import { LOCALE_HTML_LANG, routing, type Locale } from "@/i18n/routing";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { SettingsSync } from "@/components/providers/SettingsSync";
import { SkipLink, MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Uchala tilni build vaqtida statik generatsiya qilamiz. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  return {
    title: {
      default: t("name"),
      template: `%s — ${t("name")}`,
    },
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Noto'g'ri til kodi bilan kelgan so'rovni to'xtatamiz.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Statik renderni yoqadi — bu bo'lmasa sahifalar dinamik bo'lib qoladi.
  setRequestLocale(locale);

  return (
    <html
      lang={LOCALE_HTML_LANG[locale as Locale]}
      // `ThemeScript` <html> atributlarini React'gacha o'zgartiradi,
      // shuning uchun server/client farqi kutilgan holat.
      suppressHydrationWarning
    >
      <head>
        {/* FOUC oldini oladi — birinchi bo'yashdan oldin ishlashi shart. */}
        <ThemeScript />
      </head>

      <body className={`${inter.variable} ${outfit.variable} flex min-h-dvh flex-col`}>
        <NextIntlClientProvider>
          {/* Store o'zgarishlarini <html> atributlariga uzatadi. */}
          <SettingsSync />

          <SkipLink />
          <Header />

          {/*
            `tabIndex={-1}` — SkipLink bosilganda fokus shu yerga tusha olsin.
            Busiz brauzer sakraydi, lekin fokus headerda qolib ketadi.
          */}
          {/*
            `flex-1` — sticky footer: kontent kalta bo'lsa ham footer pastda qoladi.
            `min-h-[…]` — kontent maydoni kamida bir ekranni (header'dan pastini)
            to'ldiradi, shunda footer har doim birinchi ekrandan (h-screen) pastda
            turadi — hatto main'da kontent bo'lmasa ham.
          */}
          <main
            id={MAIN_CONTENT_ID}
            tabIndex={-1}
            className="flex-1 outline-none min-h-[calc(100dvh-var(--header-height))] max-phone:min-h-[calc(100dvh-var(--header-height-compact))]"
          >
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
