import type { ComponentType } from "react";
import {
  SmileIcon,
  UsersIcon,
  MessageSquareIcon,
  ArrowRightIcon,
  type LucideProps,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface NavigationCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: ComponentType<LucideProps>;
  colorClass: string; // custom visual highlight for children/parents
  hoverColorClass: string; // custom hover border/text highlight
}

// ESLATMA: bolalar bo'limining ko'p sahifalari (etiket, "men qila olaman",
// darslar, kitoblar, testlar) hali qurilmagan — ular tayyor bo'lgach shu
// yerga qaytariladi. Hozircha faqat mavjud yo'nalishlar ko'rsatiladi.
const PORTAL_CARDS: NavigationCard[] = [
  {
    id: "nav-dictionary",
    title: "Lugʼat",
    description: "Qiziqarli rasmlar va imo-ishora lugʼati.",
    href: "/vocabulary",
    icon: SmileIcon,
    colorClass: "text-accent",
    hoverColorClass: "hover:border-accent/60 hover:shadow-accent/5",
  },
  {
    id: "nav-parents",
    title: "Ota-onalar uchun",
    description: "Tavsiyalar, huquqiy yordam va uyda taʼlim yoʼriqnomalari.",
    href: "/for-parents",
    icon: UsersIcon,
    colorClass: "text-status-warning",
    hoverColorClass: "hover:border-status-warning/60 hover:shadow-status-warning/5",
  },
  {
    id: "nav-volunteers",
    title: "Koʼngillilar",
    description: "Koʼngillilar hamjamiyati va yordam soʼrovlari.",
    href: "/volunteers",
    icon: UsersIcon,
    colorClass: "text-status-success",
    hoverColorClass: "hover:border-status-success/60 hover:shadow-status-success/5",
  },
  {
    id: "nav-contact",
    title: "Murojaat",
    description: "Takliflar va loyiha maʼmurlari bilan bogʼlanish formasi.",
    href: "/contact",
    icon: MessageSquareIcon,
    colorClass: "text-brand",
    hoverColorClass: "hover:border-brand/60 hover:shadow-brand/5",
  },
];

export function HomeNavigation() {
  return (
    <section className="py-16 bg-surface" aria-labelledby="nav-heading">
      <Container>
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 id="nav-heading" className="text-3xl font-extrabold text-fg font-display tracking-tight max-phone:text-2xl">
            Asosiy yoʼnalishlar
          </h2>
          <p className="mt-2 text-base text-fg-muted">
            Platformaning barcha interaktiv boʼlimlariga tezkor oʼtish. Kerakli boʼlimni tanlang va oʼrganishni boshlang!
          </p>
        </div>

        {/* Card Grid Navigation */}
        <ul className="grid grid-cols-2 laptop:grid-cols-4 gap-6 max-phone:gap-4">
          {PORTAL_CARDS.map((card) => {
            const Icon = card.icon;

            return (
              <li key={card.id}>
                <Card
                  variant="interactive"
                  href={card.href}
                  className={cn(
                    "h-full border border-border bg-surface shadow-xs group cursor-pointer",
                    "transition-all duration-[var(--duration-base)] hover:-translate-y-1.5 hover:shadow-lg",
                    card.colorClass,
                    card.hoverColorClass
                  )}
                >
                  <CardHeader className="border-none pb-0 pt-6 max-phone:pt-5 flex items-start">
                    {/* Icon with friendly background wrapper */}
                    <div className="p-3 rounded-xl bg-surface-subtle border border-border/50 group-hover:scale-105 group-hover:bg-surface-subtle/50 transition-all duration-[var(--duration-base)]">
                      <Icon className="h-7 w-7 max-phone:h-6 max-phone:w-6" aria-hidden="true" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-6 max-phone:pb-5 text-left">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-lg font-bold text-fg font-display max-phone:text-base group-hover:text-fg transition-colors">
                        {card.title}
                      </h3>
                      <ArrowRightIcon className="h-5 w-5 text-fg-muted opacity-30 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-fg transition-all duration-[var(--duration-base)]" />
                    </div>
                    <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
