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
    <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px] text-brand" aria-hidden="true">
      {/* Background circles */}
      <circle cx="200" cy="150" r="120" fill="currentColor" opacity="0.08" />
      <circle cx="200" cy="150" r="80" fill="currentColor" opacity="0.12" />
      
      {/* Cute Smart Star Mascot */}
      <g transform="translate(140, 70)">
        {/* Star body */}
        <path
          d="M60 10 L73 40 L105 42 L80 65 L88 96 L60 80 L32 96 L40 65 L15 42 L47 40 Z"
          fill="var(--accent)"
          stroke="var(--accent-hover)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Smart Glasses */}
        <circle cx="51" cy="54" r="7" fill="none" stroke="var(--surface-inverse)" strokeWidth="2" />
        <circle cx="69" cy="54" r="7" fill="none" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M58 54 L62 54" stroke="var(--surface-inverse)" strokeWidth="2" />
        {/* Eyes */}
        <circle cx="51" cy="54" r="2.5" fill="var(--surface-inverse)" />
        <circle cx="69" cy="54" r="2.5" fill="var(--surface-inverse)" />
        {/* Smile */}
        <path d="M56 63 Q60 67 64 63" fill="none" stroke="var(--surface-inverse)" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Stack of Books */}
      <g transform="translate(60, 180)">
        <rect x="0" y="40" width="80" height="15" fill="var(--brand)" rx="2" />
        <line x1="10" y1="40" x2="10" y2="55" stroke="var(--surface)" strokeWidth="3" />
        
        <rect x="10" y="25" width="65" height="15" fill="var(--accent)" rx="2" />
        <line x1="20" y1="25" x2="20" y2="40" stroke="var(--surface)" strokeWidth="3" />
        
        <rect x="5" y="10" width="70" height="15" fill="var(--status-info)" rx="2" />
        <line x1="15" y1="10" x2="15" y2="25" stroke="var(--surface)" strokeWidth="3" />
      </g>

      {/* Graduation Hat floating */}
      <g transform="translate(70, 60) rotate(-10)">
        <path d="M20 15 L40 10 L60 15 L40 20 Z" fill="var(--brand)" />
        <path d="M30 18 L30 25 Q40 28 50 25 L50 18" fill="none" stroke="var(--brand)" strokeWidth="2" />
        <line x1="60" y1="15" x2="62" y2="22" stroke="var(--accent)" strokeWidth="1.5" />
      </g>

      {/* Alphabet Blocks */}
      <g transform="translate(260, 160)">
        {/* Cube A */}
        <rect x="0" y="20" width="35" height="35" fill="var(--status-success)" rx="6" />
        <text x="18" y="44" fill="var(--surface)" fontSize="20" fontWeight="bold" textAnchor="middle">A</text>
        {/* Cube B */}
        <rect x="40" y="10" width="35" height="35" fill="var(--brand)" rx="6" />
        <text x="58" y="34" fill="var(--fg-on-brand)" fontSize="20" fontWeight="bold" textAnchor="middle">B</text>
      </g>
    </svg>
  );
}

function WheelchairPainterIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px] text-brand" aria-hidden="true">
      <circle cx="200" cy="150" r="120" fill="var(--accent)" opacity="0.06" />
      
      {/* Easel/Board */}
      <g transform="translate(230, 60)">
        <line x1="20" y1="10" x2="5" y2="180" stroke="var(--border-strong)" strokeWidth="4" />
        <line x1="60" y1="10" x2="75" y2="180" stroke="var(--border-strong)" strokeWidth="4" />
        <line x1="40" y1="10" x2="40" y2="180" stroke="var(--border-strong)" strokeWidth="3" />
        {/* Canvas */}
        <rect x="0" y="20" width="80" height="90" fill="var(--surface)" rx="4" stroke="var(--border-strong)" strokeWidth="2" />
        {/* Painted Rainbow */}
        <path d="M15 80 Q40 40 65 80" fill="none" stroke="var(--status-danger)" strokeWidth="6" />
        <path d="M20 80 Q40 48 60 80" fill="none" stroke="var(--accent)" strokeWidth="6" />
        <path d="M25 80 Q40 56 55 80" fill="none" stroke="var(--status-info)" strokeWidth="6" />
      </g>

      {/* Wheelchair & Child drawing */}
      <g transform="translate(80, 80)">
        {/* Wheelchair big wheel */}
        <circle cx="45" cy="110" r="28" fill="none" stroke="var(--brand)" strokeWidth="4.5" />
        <circle cx="45" cy="110" r="22" fill="none" stroke="var(--brand)" strokeWidth="1" opacity="0.5" />
        <line x1="45" y1="82" x2="45" y2="138" stroke="var(--brand)" strokeWidth="1.5" opacity="0.5" />
        <line x1="17" y1="110" x2="73" y2="110" stroke="var(--brand)" strokeWidth="1.5" opacity="0.5" />
        
        {/* Small front wheel */}
        <circle cx="100" cy="128" r="10" fill="none" stroke="var(--brand)" strokeWidth="3.5" />
        
        {/* Wheelchair frame */}
        <path d="M35 75 L65 75 L95 125 L100 128" fill="none" stroke="var(--surface-inverse)" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 110 L95 110" stroke="var(--surface-inverse)" strokeWidth="4" />
        <path d="M35 55 L35 85" stroke="var(--surface-inverse)" strokeWidth="4" strokeLinecap="round" />

        {/* Happy Child Body */}
        <circle cx="65" cy="40" r="14" fill="#fbd5c0" stroke="var(--surface-inverse)" strokeWidth="2" /> {/* Head */}
        {/* Smiling face */}
        <circle cx="69" cy="38" r="1.5" fill="var(--surface-inverse)" />
        <path d="M72 43 Q74 46 76 43" fill="none" stroke="var(--surface-inverse)" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Shirt */}
        <path d="M50 55 C50 55 60 55 68 55 C74 55 80 62 80 70 L60 85 Z" fill="var(--status-success)" />
        
        {/* Arm reaching out to paint */}
        <path d="M75 62 L120 62" fill="none" stroke="#fbd5c0" strokeWidth="6" strokeLinecap="round" />
        {/* Paintbrush */}
        <line x1="120" y1="62" x2="135" y2="52" stroke="brown" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M135 52 L138 50" stroke="var(--status-info)" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function FamilyIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full max-h-[300px] text-brand" aria-hidden="true">
      <circle cx="200" cy="150" r="120" fill="var(--status-info)" opacity="0.06" />

      {/* Sun */}
      <circle cx="340" cy="60" r="22" fill="var(--accent)" opacity="0.7" />

      {/* Big Cloud */}
      <g transform="translate(40, 40)" fill="var(--surface-muted)" opacity="0.8">
        <circle cx="30" cy="30" r="20" />
        <circle cx="50" cy="20" r="25" />
        <circle cx="75" cy="30" r="22" />
        <rect x="30" y="22" width="45" height="20" />
      </g>

      {/* Parents & Child Reading Book */}
      <g transform="translate(100, 100)">
        {/* Mother Head & Body */}
        <circle cx="50" cy="40" r="15" fill="#fdd5b1" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M35 55 C35 55 45 52 55 52 C65 52 75 75 75 90 L35 90 Z" fill="var(--brand)" />

        {/* Father Head & Body */}
        <circle cx="150" cy="35" r="16" fill="#fdd5b1" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M130 50 C130 50 145 48 160 48 C170 48 180 75 180 90 L130 90 Z" fill="var(--surface-inverse)" />

        {/* Child sitting between them */}
        <circle cx="100" cy="60" r="11" fill="#fdd5b1" stroke="var(--surface-inverse)" strokeWidth="2" />
        <path d="M90 71 C90 71 95 70 105 70 C110 70 115 85 115 95 L85 95 Z" fill="var(--accent)" />

        {/* Large Open Book held by all */}
        <path d="M70 90 L100 84 L130 90 L125 98 L100 93 L75 98 Z" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />
        {/* Book cover back */}
        <path d="M68 91 L100 85 L132 91" fill="none" stroke="var(--status-danger)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Decorative Tree/Plant */}
      <g transform="translate(30, 160)">
        <path d="M20 80 Q25 40 25 10" fill="none" stroke="brown" strokeWidth="5" strokeLinecap="round" />
        <circle cx="25" cy="15" r="22" fill="var(--status-success)" opacity="0.85" />
        <circle cx="12" cy="28" r="16" fill="var(--status-success)" opacity="0.75" />
        <circle cx="38" cy="26" r="18" fill="var(--status-success)" opacity="0.8" />
      </g>
    </svg>
  );
}

const SLIDES: CarouselSlide[] = [
  {
    id: "welcome",
    title: "Smart Inclusive platformasiga xush kelibsiz!",
    description: "Har bir bola uchun inklyuziv va qiziqarli taʼlim muhiti. Bu yerda siz bolalar uchun oʼyinlar, darslar va kitoblarni topasiz.",
    ctaText: "Lugʼatni ochish",
    ctaHref: "/vocabulary",
    illustration: WelcomeIllustration,
    bgColorClass: "bg-brand/5 dark:bg-brand/10",
  },
  {
    id: "ican",
    title: "Men hammasini qila olaman!",
    description: "Imkoniyati cheklangan bolalarning oʼziga boʼlgan ishonchini oshirish, rasm chizish, sanʼat va ijod orqali dunyoni kashf etish portaliga kiring.",
    ctaText: "Koʼngilli boʼlish",
    ctaHref: "/become-volunteer",
    illustration: WheelchairPainterIllustration,
    bgColorClass: "bg-accent/5 dark:bg-accent/10",
  },
  {
    id: "parents",
    title: "Ota-onalar va koʼngillilar uchun",
    description: "Bolalarga uyda taʼlim berish usullari, huquqiy yordam va koʼngillilar hamjamiyati. Keling, inklyuziv jamiyatni birgalikda quramiz!",
    ctaText: "Koʼngilli boʼlish",
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
