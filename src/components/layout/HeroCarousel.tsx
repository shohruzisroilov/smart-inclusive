"use client";

import { useEffect, useState, useRef, type TouchEvent } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { buttonStyles } from "@/components/ui/Button";
import { useHydrated } from "@/hooks/use-hydrated";

interface CarouselSlide {
  id: string;
  titleKey: string;
  descKey: string;
  ctaKey: string;
  ctaHref: string;
  image: string;
  /** Matn joylashuvi rasm kompozitsiyasiga qarab. */
  accent: "brand" | "accent" | "info";
}

const SLIDES: CarouselSlide[] = [
  {
    id: "welcome",
    titleKey: "slide1Title",
    descKey: "slide1Desc",
    ctaKey: "slide1Cta",
    ctaHref: "/vocabulary",
    image: "",
    accent: "brand",
  },
  {
    id: "ican",
    titleKey: "slide2Title",
    descKey: "slide2Desc",
    ctaKey: "slide2Cta",
    ctaHref: "/become-volunteer",
    image: "",
    accent: "accent",
  },
  {
    id: "parents",
    titleKey: "slide3Title",
    descKey: "slide3Desc",
    ctaKey: "slide3Cta",
    ctaHref: "/become-volunteer",
    image: "",
    accent: "info",
  },
];

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const t = useTranslations("home");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hydrated = useHydrated();

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Avto-aylanish (kursor ustida yoki fokusda pauza).
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

  const goTo = (index: number) => setCurrentIndex((index + SLIDES.length) % SLIDES.length);
  const handlePrev = () => goTo(currentIndex - 1);
  const handleNext = () => goTo(currentIndex + 1);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
    touchEndX.current = null;
  };
  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0]!.clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!hydrated) {
    return (
      <section className="pt-8 pb-4 max-phone:pt-4">
        <Container>
          <div className="w-full h-[440px] max-tablet:h-[380px] max-phone:h-[320px] rounded-3xl bg-surface-subtle border border-border animate-pulse" />
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-8 pb-4 max-phone:pt-4">
      <Container>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={t("carouselLabel")}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "group relative grid w-full overflow-hidden rounded-3xl border border-border shadow-lg select-none",
            "min-h-[440px] max-tablet:min-h-[380px] max-phone:min-h-[320px]",
          )}
        >
          {/* --- Slaydlar (stacked, cross-fade + Ken Burns) --- */}
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                aria-hidden={!isActive}
                className={cn(
                  "relative col-start-1 row-start-1 h-full w-full transition-opacity duration-[900ms] ease-out",
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
                )}
              >
                {slide.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.image}
                    alt={t(slide.titleKey)}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover",
                      isActive && "hero-kenburns",
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-subtle" />
                )}

                {/* Kontrast uchun gradient parda */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>
            );
          })}

          {/* --- Matn qatlami (faol slayd almashganda qayta animatsiya) --- */}
          <div className="relative col-start-1 row-start-1 z-20 flex items-end pointer-events-none">
            <div
              key={currentIndex}
              className="p-8 pb-12 pl-20 laptop:p-10 laptop:pb-14 laptop:pl-24 max-phone:p-5 max-phone:pb-12 max-w-xl laptop:max-w-2xl space-y-3 laptop:space-y-4"
            >
              <h2
                className="hero-item text-2xl tablet:text-3xl laptop:text-5xl font-black text-white font-display tracking-tight leading-[1.1] text-balance [text-shadow:0_2px_16px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: "120ms" }}
              >
                {t(SLIDES[currentIndex]!.titleKey)}
              </h2>

              <p
                className="hero-item text-sm laptop:text-lg text-white/90 leading-relaxed max-w-lg line-clamp-2 laptop:line-clamp-none [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]"
                style={{ animationDelay: "200ms" }}
              >
                {t(SLIDES[currentIndex]!.descKey)}
              </p>

              <div className="hero-item pointer-events-auto pt-1" style={{ animationDelay: "300ms" }}>
                <Link
                  href={SLIDES[currentIndex]!.ctaHref}
                  className={buttonStyles({
                    size: "lg",
                    variant: SLIDES[currentIndex]!.accent === "accent" ? "accent" : "primary",
                  })}
                >
                  {t(SLIDES[currentIndex]!.ctaKey)}
                </Link>
              </div>
            </div>
          </div>

          {/* --- O'q tugmalari (har doim ko'rinadi) --- */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label={t("prevSlide")}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-30 max-phone:hidden",
              "flex h-11 w-11 items-center justify-center rounded-full",
              "bg-white/15 text-white backdrop-blur-md border border-white/20",
              "transition-all duration-[var(--duration-base)]",
              "hover:bg-white/30 hover:scale-105 focus-visible:outline-3 focus-visible:outline-white/70",
            )}
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={t("nextSlide")}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-30 max-phone:hidden",
              "flex h-11 w-11 items-center justify-center rounded-full",
              "bg-white/15 text-white backdrop-blur-md border border-white/20",
              "transition-all duration-[var(--duration-base)]",
              "hover:bg-white/30 hover:scale-105 focus-visible:outline-3 focus-visible:outline-white/70",
            )}
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* --- Indikator nuqtalari --- */}
          <div
            className="absolute bottom-5 right-6 max-phone:right-4 z-30 flex items-center gap-2"
            role="tablist"
            aria-label={t("selectSlides")}
          >
            {SLIDES.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={t("slideN", { n: index + 1 })}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-[var(--duration-base)]",
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>

          {/* --- Avtoaylanish progress chizig'i --- */}
          <div className="absolute bottom-0 inset-x-0 z-30 h-1 bg-white/15">
            <div
              key={`${currentIndex}-${isPaused}`}
              className={cn("h-full bg-white/80", !isPaused && "hero-progress")}
              style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
            />
          </div>

          <style>{`
            @keyframes heroKenburns {
              0%   { transform: scale(1) translate3d(0,0,0); }
              100% { transform: scale(1.09) translate3d(-1%, -1%, 0); }
            }
            .hero-kenburns { animation: heroKenburns 7s ease-out forwards; }

            @keyframes heroItemIn {
              0%   { opacity: 0; transform: translateY(18px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .hero-item {
              opacity: 0;
              animation: heroItemIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            @keyframes heroProgress {
              0%   { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
            .hero-progress {
              transform-origin: left;
              animation: heroProgress linear forwards;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-kenburns, .hero-item, .hero-progress { animation: none; }
              .hero-item { opacity: 1; }
            }
          `}</style>
        </div>
      </Container>
    </section>
  );
}
