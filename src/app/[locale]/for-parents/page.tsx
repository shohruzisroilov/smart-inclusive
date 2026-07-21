import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import {
  GraduationCapIcon,
  VideoIcon,
  ScaleIcon,
  FileTextIcon,
  HelpCircleIcon,
  PresentationIcon,
  HomeIcon,
  HeartIcon
} from "lucide-react";
import React from "react";

interface ForParentsIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function ForParentsIndexPage({ params }: ForParentsIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tiles = [
    {
      title: "Ota-onalar uchun testlar",
      description: "Inklyuziv ta'lim bo'yicha bilimlaringizni sinab ko'ring",
      href: "/for-parents/tests",
      icon: GraduationCapIcon,
      gradient: "from-brand/20 to-brand/40 text-brand border-brand/30"
    },
    {
      title: "Ota-onalar uchun videodarslar",
      description: "Mutaxassislardan foydali maslahat va videodarslar to'plami",
      href: "/for-parents/videos",
      icon: VideoIcon,
      gradient: "from-accent/20 to-accent/40 text-accent border-accent/30"
    },
    {
      title: "Huquqiy maqolalar",
      description: "Bolangizning ta'lim olish huquqlari va kafolatlari",
      href: "/for-parents/legal",
      icon: ScaleIcon,
      gradient: "from-status-warning-subtle to-status-warning/45 text-status-warning border-status-warning/30"
    },
    {
      title: "Platforma maqolalari",
      description: "Tizimdan qulay va to'g'ri foydalanish bo'yicha tavsiyalar",
      href: "/for-parents/articles",
      icon: FileTextIcon,
      gradient: "from-brand/20 to-brand/40 text-brand border-brand/30"
    },
    {
      title: "O'qitish vizardi",
      description: "Farzandingizga qulay muhit yaratish bo'yicha yo'riqnoma",
      href: "/for-parents/onboarding",
      icon: HelpCircleIcon,
      gradient: "from-accent/20 to-accent/40 text-accent border-accent/30"
    },
    {
      title: "Platforma taqdimoti",
      description: "Smart Inclusive loyihasining g'oyasi va maqsadlari",
      href: "/for-parents/presentation",
      icon: PresentationIcon,
      gradient: "from-status-warning-subtle to-status-warning/45 text-status-warning border-status-warning/30"
    },
    {
      title: "Uyda ta'lim",
      description: "Farzandingiz bilan uyda bajarishingiz mumkin bo'lgan darslar",
      href: "/for-parents/home-education",
      icon: HomeIcon,
      gradient: "from-brand/20 to-brand/40 text-brand border-brand/30"
    }
  ];

  return (
    <Container className="py-12 text-left">
      {/* Header section */}
      <div className="border-b border-border/60 pb-6 mb-8 select-none">
        <h1 className="text-3xl font-black text-fg font-display tracking-tight max-phone:text-2xl flex items-center gap-2">
          <HeartIcon className="h-8 w-8 text-brand fill-current" />
          Ota-onalar uchun boʻlim
        </h1>
        <p className="mt-2 text-base text-fg-muted max-w-xl">
          Farzandingiz rivojlanishiga koʻmaklashuvchi darslar, huquqiy yordam koʻrsatuvchi maqolalar va oʻrganish qoʻllanmalari bilan tanishing.
        </p>
      </div>

      {/* Tiles grid layout */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
        {tiles.map((tile, idx) => {
          return (
            <Link key={idx} href={tile.href} className="group block h-full">
              <Card className="h-full border border-border/80 shadow-xs group-hover:border-border-strong group-hover:shadow-sm transition-all duration-[var(--duration-base)] hover:scale-[1.015] active:scale-[0.99] flex flex-col justify-between p-6">
                <CardHeader className="p-0 flex flex-row items-start gap-4">
                  <div className={`p-3 rounded-xl border bg-gradient-to-br ${tile.gradient} shrink-0`}>
                    {React.createElement(tile.icon, { className: "h-6 w-6" })}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-fg font-display group-hover:text-brand transition-colors leading-snug">
                      {tile.title}
                    </h3>
                    <p className="text-sm text-fg-muted leading-relaxed">
                      {tile.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mt-4 text-xs font-bold text-brand uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Batafsil &rarr;
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
