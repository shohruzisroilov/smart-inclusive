import { setRequestLocale } from "next-intl/server";
import { VolunteersClientWrapper } from "./VolunteersClientWrapper";

interface VolunteersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function VolunteersPage({ params }: VolunteersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VolunteersClientWrapper />;
}
