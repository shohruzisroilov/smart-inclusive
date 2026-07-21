import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PresentationClientWrapper } from "./PresentationClientWrapper";

interface PresentationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 text-left">
      <PresentationClientWrapper />
    </Container>
  );
}
