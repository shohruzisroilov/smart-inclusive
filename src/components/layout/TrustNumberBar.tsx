import type { ComponentType } from "react";
import { useFormatter, useTranslations } from "next-intl";
import {
  BookOpenIcon,
  HeartHandshakeIcon,
  MapPinIcon,
  UsersIcon,
  type LucideProps,
} from "lucide-react";
import {
  TRUST_NUMBERS,
  type TrustNumberIcon,
  type TrustNumberItem,
} from "@/lib/constants/trust-numbers";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

const ICONS: Record<TrustNumberIcon, ComponentType<LucideProps>> = {
  children: UsersIcon,
  lessons: BookOpenIcon,
  volunteers: HeartHandshakeIcon,
  regions: MapPinIcon,
};

interface TrustNumberBarProps {
  /** Standart holatda konstantalardan olinadi; server'dan ham berish mumkin. */
  items?: TrustNumberItem[];
  className?: string;
}

/**
 * Platforma ko'rsatkichlari qatori — ishonch hosil qilish uchun.
 *
 * Server Component: interaktivlik yo'q, JS bundle'ga tushmaydi.
 *
 * QULAYLIK QARORLARI:
 *  - Raqamlar `useFormatter` bilan tilga moslab formatlanadi
 *    (uz/ru: `1 200`, en: `1,200`) — ekran o'quvchi to'g'ri o'qiydi.
 *  - Ikonkalar dekorativ (`aria-hidden`): ma'noni matn tashiydi.
 *  - Ro'yxat `<ul>` — ekran o'quvchi "4 elementli ro'yxat" deb e'lon qiladi.
 *  - Count-up animatsiyasi QASDDAN yo'q: u harakatga sezgir foydalanuvchiga
 *    xalaqit beradi va ekran o'quvchida raqam bir necha marta o'qiladi.
 */
export function TrustNumberBar({ items = TRUST_NUMBERS, className }: TrustNumberBarProps) {
  const t = useTranslations("trustBar");
  const format = useFormatter();

  return (
    <section
      aria-labelledby="trust-numbers-title"
      className={cn("border-y border-border bg-surface-subtle py-8", className)}
    >
      <Container>
        {/* Sarlavha vizual emas, lekin struktura uchun kerak. */}
        <h2 id="trust-numbers-title" className="sr-only">
          {t("title")}
        </h2>

        <ul
          className={cn(
            // Planshet — asosiy holat: 4 ta ustun bemalol sig'adi.
            "grid grid-cols-4 gap-6",
            // Telefonda 2×2 ga tushamiz.
            "max-phone:grid-cols-2 max-phone:gap-5",
          )}
        >
          {items.map((item) => {
            const Icon = ICONS[item.icon];

            return (
              <li key={item.id} className="flex flex-col items-center text-center">
                <Icon
                  className="mb-2 h-7 w-7 text-brand max-phone:h-6 max-phone:w-6"
                  aria-hidden="true"
                />

                <span className="text-3xl font-bold tabular-nums text-fg max-phone:text-2xl">
                  {format.number(item.value)}
                  {item.suffix}
                </span>

                <span className="mt-1 text-sm text-fg-muted text-balance">
                  {t(item.labelKey)}
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
