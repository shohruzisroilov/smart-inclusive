import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getArticle } from "@/lib/api/content";
import { ParentLegalClientWrapper } from "./ParentLegalClientWrapper";

interface ParentLegalProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentLegalDetailPage({ params }: ParentLegalProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = await getArticle("legal", id, locale);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentLegalClientWrapper article={article} />
    </Container>
  );
}
