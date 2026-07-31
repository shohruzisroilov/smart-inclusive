import { setRequestLocale } from "next-intl/server";
import { getVolunteerCases } from "@/lib/api/volunteers";
import { getPlatformMetrics } from "@/lib/api/stats";
import { fetchRegions } from "@/lib/api/services";
import { VolunteersClientWrapper } from "./VolunteersClientWrapper";

interface VolunteersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function VolunteersPage({ params }: VolunteersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Uchala uch ham `[AllowAnonymous]` — parallel olinadi, biri sekin bo'lsa
  // qolganlari kutib turmasin.
  const [cases, metrics, regions] = await Promise.all([
    getVolunteerCases(),
    getPlatformMetrics(),
    fetchRegions(),
  ]);

  return (
    <VolunteersClientWrapper
      cases={cases}
      metrics={metrics}
      regions={regions.map((region) => ({ id: region.value, text: region.text }))}
    />
  );
}
