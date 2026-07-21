import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ParentsLegalClient } from "./ParentsLegalClient";

interface ParentsLegalIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ParentsLegalIndexPage({ params }: ParentsLegalIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <span className="text-xs font-bold text-accent uppercase tracking-wider block">{"Ota-onalar bo'limi"}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
          Huquqiy maqolalar va yoʻriqnomalar
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {"Alohida ehtiyojli bolalarni davlat va jamoat ta'lim muassasalarida o'qitish bo'yicha qonunlar, imtiyozlar va kafolatlar."}
        </p>
      </div>

      <ParentsLegalClient />
    </Container>
  );
}
