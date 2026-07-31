import { setRequestLocale } from "next-intl/server";
import { fetchRegions } from "@/lib/api/services";
import { BecomeVolunteerClientWrapper } from "./BecomeVolunteerClientWrapper";

interface BecomeVolunteerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BecomeVolunteerPage({ params }: BecomeVolunteerPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Viloyatlar ro'yxati — `[AllowAnonymous]`, ya'ni saytdan ochiq.
  const regions = await fetchRegions();

  return (
    <BecomeVolunteerClientWrapper
      regions={regions.map((region) => ({ id: region.value, text: region.text }))}
    />
  );
}
