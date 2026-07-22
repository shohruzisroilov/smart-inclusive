import { HeartHandshakeIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export async function VolunteerCTA() {
  const t = await getTranslations("home");
  return (
    <section className="py-16 bg-surface-subtle" aria-labelledby="volunteer-heading">
      <Container>
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-brand-border bg-gradient-to-br from-brand/5 to-brand/15",
            "p-8 tablet:p-12 text-left flex flex-col tablet:flex-row items-center justify-between gap-8"
          )}
        >
          {/* Decorative Vector Heart */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 text-brand opacity-[0.03]" aria-hidden="true">
            <HeartHandshakeIcon className="w-80 h-80" />
          </div>

          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-subtle border border-brand/20 text-xs font-semibold text-brand select-none">
              <HeartHandshakeIcon className="h-4 w-4" />
              {t("ctaBadge")}
            </div>

            <h2 id="volunteer-heading" className="text-3xl font-extrabold text-fg tracking-tight font-display max-phone:text-2xl">
              {t("ctaHeading")}
            </h2>

            <p className="text-base text-fg-muted leading-relaxed">
              {t("ctaDesc")}
            </p>
          </div>

          <div className="flex flex-col tablet:flex-row gap-4 w-full tablet:w-auto shrink-0 z-[1]">
            <Link
              href="/become-volunteer"
              className={buttonStyles({ variant: "primary", size: "lg", className: "w-full tablet:w-auto" })}
            >
              {t("ctaJoin")}
            </Link>
            <Link
              href="/volunteers"
              className={buttonStyles({ variant: "secondary", size: "lg", className: "w-full tablet:w-auto" })}
            >
              {t("ctaActivity")}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
