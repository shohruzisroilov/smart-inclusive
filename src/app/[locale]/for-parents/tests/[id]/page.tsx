import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PARENT_TESTS } from "@/lib/mocks/parents-content";
import { ParentTestClientWrapper } from "./ParentTestClientWrapper";

interface ParentTestProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentTestDetailPage({ params }: ParentTestProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const tt = await getTranslations("sections");

  const test = PARENT_TESTS.find((t) => t.id === id);

  if (!test) {
    notFound();
  }

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-brand uppercase tracking-wider block">{tt("parentsTestEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">
          {test.title}
        </h1>
      </div>

      <ParentTestClientWrapper test={test} />
    </Container>
  );
}
