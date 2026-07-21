import { setRequestLocale } from "next-intl/server";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { ImpactStats, type ImpactStatsData } from "@/components/layout/ImpactStats";
import { RegionalVideos } from "@/components/layout/RegionalVideos";
import { HomeNavigation } from "@/components/layout/HomeNavigation";
import { VolunteerCTA } from "@/components/layout/VolunteerCTA";

async function getStats(): Promise<ImpactStatsData> {
  return {
    children: 1250,
    volunteers: 68,
    lessons: 184,
    families: 462,
  };
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Load server-side impact statistics
  const stats = await getStats();

  return (
    <>
      <HeroCarousel />
      <ImpactStats data={stats} />
      <RegionalVideos />
      <HomeNavigation />
      <VolunteerCTA />
    </>
  );
}
