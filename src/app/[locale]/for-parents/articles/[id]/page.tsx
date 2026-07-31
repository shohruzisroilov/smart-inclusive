import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getArticle } from "@/lib/api/content";
import { ParentArticleClientWrapper } from "./ParentArticleClientWrapper";

interface ParentArticleProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentArticleDetailPage({ params }: ParentArticleProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = await getArticle("articles", id, locale);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentArticleClientWrapper article={article} />
    </Container>
  );
}
