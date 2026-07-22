import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PARENT_VIDEOS } from "@/lib/mocks/parents-content";
import { ParentVideoClientWrapper } from "./ParentVideoClientWrapper";

interface ParentVideoProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ParentVideoDetailPage({ params }: ParentVideoProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const video = PARENT_VIDEOS.find((v) => v.id === id);

  if (!video) {
    notFound();
  }

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("parentsVideoEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">
          {video.title}
        </h1>
        <p className="mt-2 text-sm text-fg-muted">
          {video.description}
        </p>
      </div>

      <ParentVideoClientWrapper video={video} />
    </Container>
  );
}
