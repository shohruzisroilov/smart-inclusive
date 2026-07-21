import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { AboutProjectClientWrapper } from "./AboutProjectClientWrapper";

interface AboutProjectPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutProjectPage({ params }: AboutProjectPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-12 text-left">
      <AboutProjectClientWrapper />
    </Container>
  );
}
