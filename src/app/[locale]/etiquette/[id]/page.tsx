import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getReadable } from "@/lib/api/content";
import { EtiquetteReaderClientWrapper } from "./EtiquetteReaderClientWrapper";

interface EtiquetteReaderProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EtiquetteReaderPage({ params }: EtiquetteReaderProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  // Etiket komikslari `info_comic_page` da — matn maydoni `script`.
  const comic = await getReadable(id, locale, "comic");
  if (!comic) notFound();

  return (
    <Container className="py-10 text-left max-w-4xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("etiquetteComic")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5 max-phone:text-2xl">
          {comic.title}
        </h1>
      </div>

      <EtiquetteReaderClientWrapper comic={comic} />
    </Container>
  );
}
