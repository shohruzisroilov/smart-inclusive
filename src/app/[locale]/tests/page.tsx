import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getKidsTests } from "@/lib/api/tests";
import { TestsListClient } from "./TestsListClient";

interface TestsIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function TestsIndexPage({ params }: TestsIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");
  const items = await getKidsTests();

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("kidsEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
          {t("testsTitle")}
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {t("testsSubtitle")}
        </p>
      </div>

      <TestsListClient items={items} />
    </Container>
  );
}
