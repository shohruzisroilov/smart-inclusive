import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PARENT_PLATFORM_ARTICLES } from "@/lib/mocks/parents-content";
import { ParentArticleClientWrapper } from "./ParentArticleClientWrapper";

interface ParentArticleProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentArticleDetailPage({ params }: ParentArticleProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = PARENT_PLATFORM_ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentArticleClientWrapper article={article} />
    </Container>
  );
}
