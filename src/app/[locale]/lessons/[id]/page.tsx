import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getSectionItem } from "@/lib/api/content";
import { KidsVideoClientWrapper } from "@/components/kids/KidsVideoClientWrapper";

interface LessonVideoProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function LessonVideoPage({ params }: LessonVideoProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const video = await getSectionItem("lessons", id, locale);
  // Video havolasi (`youtube_url`) bo'lmasa ko'rsatadigan narsa yo'q.
  if (!video?.videoUrl) notFound();

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("videoLessonEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">{video.title}</h1>
        <p className="mt-2 text-sm text-fg-muted">{video.description}</p>
      </div>

      <KidsVideoClientWrapper
        video={{ title: video.title, videoUrl: video.videoUrl }}
        backHref="/lessons"
      />
    </Container>
  );
}
