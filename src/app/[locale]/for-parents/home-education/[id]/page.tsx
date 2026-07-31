import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getArticle } from "@/lib/api/content";
import { ParentHomeEdClientWrapper } from "./ParentHomeEdClientWrapper";

interface ParentHomeEdProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentHomeEdDetailPage({ params }: ParentHomeEdProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = await getArticle("homeEducation", id, locale);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentHomeEdClientWrapper article={article} />
    </Container>
  );
}
