import { setRequestLocale } from "next-intl/server";
import { VolunteerDetailClientWrapper } from "./VolunteerDetailClientWrapper";

interface VolunteerDetailPageProps {
  params: Promise<{ locale: string; caseId: string }>;
}

export default async function VolunteerDetailPage({ params }: VolunteerDetailPageProps) {
  const { locale, caseId } = await params;
  setRequestLocale(locale);

  return <VolunteerDetailClientWrapper caseId={caseId} />;
}
