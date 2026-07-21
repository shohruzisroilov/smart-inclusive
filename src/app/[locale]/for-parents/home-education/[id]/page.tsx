import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PARENT_HOME_ED_ARTICLES } from "@/lib/mocks/parents-content";
import { ParentHomeEdClientWrapper } from "./ParentHomeEdClientWrapper";

interface ParentHomeEdProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentHomeEdDetailPage({ params }: ParentHomeEdProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const article = PARENT_HOME_ED_ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <Container className="py-12 text-left">
      <ParentHomeEdClientWrapper article={article} />
    </Container>
  );
}
