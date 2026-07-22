import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { I_CAN_VIDEOS } from "@/lib/mocks/kids-content";
import { KidsVideoClientWrapper } from "@/components/kids/KidsVideoClientWrapper";

interface ICanVideoProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ICanVideoPage({ params }: ICanVideoProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  const video = I_CAN_VIDEOS.find((v) => v.id === id);
  if (!video) notFound();

  return (
    <Container className="py-12 text-left max-w-2xl">
      <div className="mb-6 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("iCanEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight mt-0.5">{video.title}</h1>
        <p className="mt-2 text-sm text-fg-muted">{video.description}</p>
      </div>

      <KidsVideoClientWrapper video={video} backHref="/i-can-do-it" />
    </Container>
  );
}
