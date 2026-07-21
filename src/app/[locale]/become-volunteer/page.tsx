import { setRequestLocale } from "next-intl/server";
import { BecomeVolunteerClientWrapper } from "./BecomeVolunteerClientWrapper";

interface BecomeVolunteerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BecomeVolunteerPage({ params }: BecomeVolunteerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BecomeVolunteerClientWrapper />;
}
