import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ParentsHomeEdClient } from "./ParentsHomeEdClient";

interface ParentsHomeEdIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ParentsHomeEdIndexPage({ params }: ParentsHomeEdIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <span className="text-xs font-bold text-brand uppercase tracking-wider block">{"Ota-onalar bo'limi"}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
          {"Uyda ta'lim va rivojlantirish"}
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {"Farzandingiz bilan uy sharoitida o'tkazishingiz mumkin bo'lgan interaktiv darslar va motorik mashg'ulotlar."}
        </p>
      </div>

      <ParentsHomeEdClient />
    </Container>
  );
}
