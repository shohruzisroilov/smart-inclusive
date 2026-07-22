"use client";

import { useEffect, useState, useRef, type TouchEvent, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { buttonStyles } from "@/components/ui/Button";
import { useHydrated } from "@/hooks/use-hydrated";

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  illustration: () => ReactNode;
  bgColorClass: string;
}

// ----------------------------------------------------------------------------
// INLINE SVG ILLUSTRATIONS
// ----------------------------------------------------------------------------
function WelcomeIllustration() {
  return (
    <img
      src="/welcome-banner.png"
      alt="Smart Inclusive ta'lim platformasi"
      className="w-full h-auto max-h-[320px] object-contain select-none"
    />
  );
}

function CreativePainterIllustration() {
  return (
    <img
      src="/creativity-banner.png"
      alt="Bolalar uchun ijodiy rasm chizish darslari"
      className="w-full h-auto max-h-[320px] object-contain select-none"
    />
  );
}

function FamilyIllustration() {
  return (
    <img
      src="/parents-banner.png"
      alt="Ota-onalar va ko'ngillilar bilan hamkorlik"
      className="w-full h-auto max-h-[320px] object-contain select-none"
    />
  );
}

const SLIDES: CarouselSlide[] = [
  {
    id: "welcome",
    title: "Smart Inclusive platformasiga xush kelibsiz!",
    description: "Bolalar uchun interfaol o'yinlar, qiziqarli darslar va elektron kitoblar.",
    ctaText: "Lug'atni ochish",
    ctaHref: "/vocabulary",
    illustration: WelcomeIllustration,
    bgColorClass: "bg-brand/5 dark:bg-brand/10",
  },
  {
    id: "ican",
    title: "Men hammasini qila olaman!",
    description: "Bolalarning ijodiy salohiyatini oshirish hamda dunyoni san'at orqali kashf etish portali.",
    ctaText: "Ijodni boshlash",
    ctaHref: "/become-volunteer",
    illustration: CreativePainterIllustration,
    bgColorClass: "bg-accent/5 dark:bg-accent/10",
  },
  {
    id: "parents",
    title: "Ota-onalar va ko'ngillilar uchun",
    description: "Uyda ta'lim berish usullari, huquqiy qo'llab-quvvatlash va faol ko'ngillilar hamjamiyati.",
    ctaText: "Ko'ngilli bo'lish",
    ctaHref: "/become-volunteer",
    illustration: FamilyIllustration,
    bgColorClass: "bg-status-info-subtle/30 dark:bg-status-info-subtle/10",
  },
];

// ----------------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------------
export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hydrated = useHydrated();
  
  // Touch coordinates for swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Autoplay handler
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile/tablet swipe support
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0]!.clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50; // swipe sensitivity threshold

    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }

    // Reset touch variables
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!hydrated) {
    // Skeleton placeholder to prevent shift during SSR load
    return (
      <div className="w-full bg-surface-subtle border-b border-border animate-pulse py-20 max-phone:py-12">
        <div className="mx-auto w-full max-w-[var(--container-max)] px-6 max-phone:px-4 grid laptop:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="h-10 bg-surface-muted rounded-lg w-3/4" />
            <div className="h-5 bg-surface-muted rounded-md w-full" />
            <div className="h-5 bg-surface-muted rounded-md w-5/6" />
            <div className="h-12 bg-surface-muted rounded-lg w-40 mt-6" />
          </div>
          <div className="h-[250px] bg-surface-muted rounded-xl w-full" />
        </div>
      </div>
    );
  }

  const activeSlide = SLIDES[currentIndex]!;
  const Illustration = activeSlide.illustration;

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Bosh sahifa yangiliklari"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative w-full overflow-hidden border-b border-border"
    >
      {/* Slides Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "transition-colors duration-[var(--duration-slow)] py-16 max-phone:py-8",
          activeSlide.bgColorClass
        )}
      >
        <div className="mx-auto w-full max-w-[var(--container-max)] px-6 max-phone:px-4 grid laptop:grid-cols-12 gap-8 laptop:gap-12 items-center">
          {/* Text Content */}
          <div className="laptop:col-span-7 space-y-6 text-left animate-in fade-in slide-in-from-left-4 duration-[var(--duration-base)] ease-out">
            <h2 className="text-3xl font-extrabold text-fg tracking-tight max-phone:text-2xl laptop:text-4xl font-display">
              {activeSlide.title}
            </h2>
            <p className="text-base text-fg-muted max-w-2xl leading-relaxed">
              {activeSlide.description}
            </p>
            <div className="pt-2">
              <Link
                href={activeSlide.ctaHref}
                className={buttonStyles({ size: "lg", variant: activeSlide.id === "ican" ? "accent" : "primary" })}
              >
                {activeSlide.ctaText}
              </Link>
            </div>
          </div>

          {/* Image/Illustration Content */}
          <div className="laptop:col-span-5 flex justify-center items-center select-none animate-in fade-in slide-in-from-right-4 duration-[var(--duration-base)] ease-out">
            <div className="w-full max-w-[360px] laptop:max-w-full drop-shadow-sm">
              <Illustration />
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Overlay indicators for Touch devices */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 z-[10]">
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Oldingi slayd"
          className={cn(
            "tap-target w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 border border-border/80 text-fg-muted",
            "transition-all duration-[var(--duration-fast)] hover:bg-surface hover:text-fg shadow-sm hover:scale-105",
            "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2",
            "max-phone:hidden"
          )}
        >
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Indicators Dots */}
        <div className="flex gap-2 mx-4" role="tablist" aria-label="Slaydlarni tanlash">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`${index + 1}-slayd`}
              onClick={() => handleDotClick(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-[var(--duration-base)]",
                index === currentIndex ? "bg-brand w-6" : "bg-fg-subtle/40 hover:bg-fg-subtle/80"
              )}
            />
          ))}
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Keyingi slayd"
          className={cn(
            "tap-target w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 border border-border/80 text-fg-muted",
            "transition-all duration-[var(--duration-fast)] hover:bg-surface hover:text-fg shadow-sm hover:scale-105",
            "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)] focus-visible:outline-offset-2",
            "max-phone:hidden"
          )}
        >
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
