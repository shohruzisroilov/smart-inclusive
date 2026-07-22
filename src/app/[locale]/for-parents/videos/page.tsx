import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ParentsVideosClient } from "./ParentsVideosClient";

interface ParentsVideosIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ParentsVideosIndexPage({ params }: ParentsVideosIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("parentsEyebrow")}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
          {t("parentsVideosTitle")}
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {t("parentsVideosSubtitle")}
        </p>
      </div>

      <ParentsVideosClient />
    </Container>
  );
}
