import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { BOOKS } from "@/lib/mocks/kids-content";
import { BookReaderClientWrapper } from "./BookReaderClientWrapper";

interface BookReaderProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function BookReaderPage({ params }: BookReaderProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const book = BOOKS.find((b) => b.id === id);
  if (!book) notFound();

  return (
    <Container className="py-10 text-left max-w-4xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("book")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5 max-phone:text-2xl">
          {book.title}
        </h1>
      </div>

      <BookReaderClientWrapper book={book} />
    </Container>
  );
}
