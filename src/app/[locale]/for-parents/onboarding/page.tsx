import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getSlides } from "@/lib/api/slides";
import { OnboardingClientWrapper } from "./OnboardingClientWrapper";

interface OnboardingPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const slides = await getSlides("onboarding", locale);

  return (
    <Container className="py-12 text-left">
      <OnboardingClientWrapper slides={slides} />
    </Container>
  );
}
