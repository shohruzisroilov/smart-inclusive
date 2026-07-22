import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { findKidsTest } from "@/lib/mocks/kids-content";
import { KidsTestClientWrapper } from "./KidsTestClientWrapper";

interface KidsTestProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function KidsTestPage({ params }: KidsTestProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const test = findKidsTest(id);
  if (!test) notFound();

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-brand uppercase tracking-wider block">{t("test")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5 max-phone:text-2xl">
          {test.title}
        </h1>
      </div>

      <KidsTestClientWrapper test={test} />
    </Container>
  );
}
