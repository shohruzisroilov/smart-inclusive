import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getSlides } from "@/lib/api/slides";
import { PresentationClientWrapper } from "./PresentationClientWrapper";

interface PresentationPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PresentationPage({ params }: PresentationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const slides = await getSlides("presentation", locale);

  return (
    <Container className="py-12 text-left">
      <PresentationClientWrapper slides={slides} />
    </Container>
  );
}
