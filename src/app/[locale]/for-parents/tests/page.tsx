import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ParentsTestsClient } from "./ParentsTestsClient";

interface ParentsTestsIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ParentsTestsIndexPage({ params }: ParentsTestsIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 text-left">
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <span className="text-xs font-bold text-brand uppercase tracking-wider block">{"Ota-onalar bo'limi"}</span>
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl mt-0.5">
          Ota-onalar uchun testlar
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          {"Farzandingiz rivojlanishi va inklyuziv ko'nikmalar haqidagi bilimlarni mustahkamlash uchun mo'ljallangan sinovlar."}
        </p>
      </div>

      <ParentsTestsClient />
    </Container>
  );
}
