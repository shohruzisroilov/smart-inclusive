import { setRequestLocale } from "next-intl/server";
import { AboutUsClientWrapper } from "./AboutUsClientWrapper";

interface AboutUsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutUsClientWrapper />;
}
