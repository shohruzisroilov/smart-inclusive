import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  KeyboardIcon,
  EyeIcon,
  TypeIcon,
  ContrastIcon,
  MousePointerClickIcon,
  MoonIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

interface AccessibilityPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AccessibilityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: t("accessibilityStatement") };
}

/** Platformaning qulaylik imkoniyatlari — bitta qatordagi karta uchun. */
const FEATURES = [
  {
    icon: KeyboardIcon,
    title: "Klaviatura bilan boshqarish",
    description:
      "Barcha interaktiv elementlar faqat klaviatura orqali ishlaydi. Fokus halqasi hech qachon yashirilmaydi.",
  },
  {
    icon: EyeIcon,
    title: "Ekran o'quvchi qo'llab-quvvatlashi",
    description:
      "Semantik teglar, ARIA belgilari va matnli muqobillar bilan sahifalar ekran o'quvchilarga to'g'ri o'qiladi.",
  },
  {
    icon: ContrastIcon,
    title: "Yetarli rang kontrasti",
    description:
      "Matn va fon ranglari WCAG talablariga mos. Holat hech qachon faqat rang bilan bildirilmaydi — ikonka va matn ham qo'shiladi.",
  },
  {
    icon: TypeIcon,
    title: "Shriftni kattalashtirish",
    description:
      "Interfeys 200% gacha kattalashtirilganda ham buzilmaydi va o'qishga qulay bo'lib qoladi.",
  },
  {
    icon: MoonIcon,
    title: "Mavzu va harakat sozlamalari",
    description:
      "Yorug' va qorong'i rejim tanlash mumkin; tizimda harakat kamaytirilgan bo'lsa, animatsiyalar avtomatik so'ndiriladi.",
  },
  {
    icon: MousePointerClickIcon,
    title: "Katta tegish maydonlari",
    description:
      "Har bir tugma va havola kamida 44px balandlikda — planshet va telefonda barmoq bilan bosish oson.",
  },
];

export default async function AccessibilityPage({ params }: AccessibilityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container size="narrow" className="py-12 text-left">
      <article className="space-y-12">
        {/* --- Sarlavha --- */}
        <header className="space-y-4">
          <h1 className="text-4xl font-black text-fg font-display tracking-tight leading-tight max-phone:text-3xl">
            Qulaylik bayonoti
          </h1>
          <p className="text-lg text-fg-muted leading-relaxed">
            Smart Inclusive — inklyuziv ta'lim platformasi. Biz platformadan
            imkoniyati cheklangan foydalanuvchilar ham teng qatnasha olishini
            asosiy maqsad qilib qo'yganmiz va qulaylikni doimiy ravishda
            yaxshilab boramiz.
          </p>
        </header>

        {/* --- Muvofiqlik darajasi --- */}
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-fg font-display tracking-tight">
            Muvofiqlik darajasi
          </h2>
          <p className="text-base text-fg-muted leading-relaxed">
            Platforma <strong className="text-fg">WCAG 2.1 AA</strong> darajasiga
            muvofiq bo'lishni maqsad qiladi. Bu — veb-kontent qulayligi bo'yicha
            xalqaro standart. Sahifalar shu talablarni hisobga olgan holda
            ishlab chiqilmoqda.
          </p>
        </section>

        {/* --- Imkoniyatlar --- */}
        <section className="space-y-5">
          <h2 className="text-2xl font-extrabold text-fg font-display tracking-tight">
            Qo'llab-quvvatlanadigan imkoniyatlar
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-fg font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {feature.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        {/* --- Ma'lum cheklovlar --- */}
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-fg font-display tracking-tight">
            Ma'lum cheklovlar
          </h2>
          <p className="text-base text-fg-muted leading-relaxed">
            Ba'zi bo'limlar hali ishlab chiqilmoqda va uchinchi tomon
            manbalaridan olingan ayrim videolarda subtitrlar to'liq bo'lmasligi
            mumkin. Bunday kamchiliklarni bosqichma-bosqich bartaraf etamiz.
          </p>
        </section>

        {/* --- Fikr-mulohaza --- */}
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-fg font-display tracking-tight">
            Fikr-mulohaza
          </h2>
          <p className="text-base text-fg-muted leading-relaxed">
            Agar biror sahifada qulaylik muammosiga duch kelsangiz, bizga xabar
            bering — tez orada tuzatamiz.
          </p>
          <Link
            href="/contact"
            className="inline-flex min-h-[var(--tap-target-min)] items-center font-semibold text-brand underline underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-brand-hover"
          >
            Murojaat qoldirish
          </Link>
        </section>
      </article>
    </Container>
  );
}
