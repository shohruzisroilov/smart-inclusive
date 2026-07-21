import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PARENT_LEGAL_ARTICLES } from "@/lib/mocks/parents-content";
import { ParentLegalClientWrapper } from "./ParentLegalClientWrapper";

interface ParentLegalProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentLegalDetailPage({ params }: ParentLegalProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = PARENT_LEGAL_ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentLegalClientWrapper article={article} />
    </Container>
  );
}
