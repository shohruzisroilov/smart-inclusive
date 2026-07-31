import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getVolunteerCase } from "@/lib/api/volunteers";
import { VolunteerDetailClientWrapper } from "./VolunteerDetailClientWrapper";

interface VolunteerDetailPageProps {
  params: Promise<{ locale: string; caseId: string }>;
}

export default async function VolunteerDetailPage({ params }: VolunteerDetailPageProps) {
  const { locale, caseId } = await params;
  setRequestLocale(locale);

  const item = await getVolunteerCase(caseId);
  if (!item) notFound();

  return <VolunteerDetailClientWrapper item={item} />;
}
