import { setRequestLocale } from "next-intl/server";
import { ContactClientWrapper } from "./ContactClientWrapper";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactClientWrapper />;
}
