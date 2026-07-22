import { getTranslations, setRequestLocale } from "next-intl/server";
import { GraduationCapIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/Button";
import { EtiquetteListClient } from "./EtiquetteListClient";

interface EtiquetteIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function EtiquetteIndexPage({ params }: EtiquetteIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 flex flex-wrap items-end justify-between gap-4 select-none">
        <div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider block">{t("kidsEyebrow")}</span>
          <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
            {t("etiquetteTitle")}
          </h1>
          <p className="mt-2 text-base text-fg-muted max-w-xl">
            {t("etiquetteSubtitle")}
          </p>
        </div>

        <Link
          href="/etiquette/tests"
          className={buttonStyles({ variant: "accent", size: "sm", className: "flex items-center gap-2" })}
        >
          <GraduationCapIcon className="h-4 w-4" />
          {t("situationalTests")}
        </Link>
      </div>

      <EtiquetteListClient />
    </Container>
  );
}
