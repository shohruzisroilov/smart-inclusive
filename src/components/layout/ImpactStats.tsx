"use client";

import { useEffect, useState, useRef } from "react";
import { UsersIcon, HeartHandshakeIcon, BookOpenIcon, HomeIcon, AlertCircleIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export interface ImpactStatsData {
  children: number;
  volunteers: number;
  lessons: number;
  families: number;
}

interface ImpactStatsProps {
  data?: ImpactStatsData | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

// ----------------------------------------------------------------------------
// ANIMATED COUNTER WIDGET
// ----------------------------------------------------------------------------
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      requestAnimationFrame(() => setCount(target));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && !animated.current) {
          animated.current = true;
          const startTime = performance.now();
          const duration = 1500; // 1.5 seconds animation time

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: easeOutQuad
            const ease = progress * (2 - progress);
            const value = Math.floor(ease * target);
            setCount(value);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [target]);

  return (
    <span ref={elementRef} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ----------------------------------------------------------------------------
// MAIN LAYOUT
// ----------------------------------------------------------------------------
export function ImpactStats({ data, loading = false, error = null, onRetry }: ImpactStatsProps) {
  const iconClasses = "h-8 w-8 text-brand mb-3 max-phone:h-6 max-phone:w-6";

  const cardsConfig = [
    {
      id: "children",
      key: "children",
      icon: UsersIcon,
      label: "Qamrab olingan bolalar",
      suffix: "+",
      targetValue: data?.children || 1200,
    },
    {
      id: "volunteers",
      key: "volunteers",
      icon: HeartHandshakeIcon,
      label: "Faol koʼngillilar",
      suffix: "+",
      targetValue: data?.volunteers || 64,
    },
    {
      id: "lessons",
      key: "lessons",
      icon: BookOpenIcon,
      label: "Bajarilgan darslar",
      suffix: "",
      targetValue: data?.lessons || 180,
    },
    {
      id: "families",
      key: "families",
      icon: HomeIcon,
      label: "Yordam olgan oilalar",
      suffix: "+",
      targetValue: data?.families || 450,
    },
  ];

  return (
    <section className="py-16 border-y border-border bg-surface-subtle/50" aria-labelledby="stats-heading">
      <Container>
        <h2 id="stats-heading" className="sr-only">
          Platforma koʼrsatkichlari (Impact statistics)
        </h2>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-2 laptop:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="flex flex-col items-center py-8">
                  <Skeleton className="w-10 h-10 rounded-full mb-3" />
                  <Skeleton className="w-16 h-8 mb-2" />
                  <Skeleton className="w-24 h-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center p-6 border border-status-danger/30 rounded-2xl bg-surface text-center">
            <AlertCircleIcon className="h-10 w-10 text-status-danger mb-3" />
            <h3 className="text-lg font-bold text-fg mb-1 font-display">Maʼlumotlarni yuklab boʼlmadi</h3>
            <p className="text-sm text-fg-muted mb-4 max-w-sm">{error}</p>
            {onRetry && <Button size="sm" onClick={onRetry}>Qayta urinish</Button>}
          </div>
        )}

        {/* SUCCESS STATE */}
        {!loading && !error && (
          <ul className="grid grid-cols-2 laptop:grid-cols-4 gap-6 max-phone:gap-4">
            {cardsConfig.map((card) => {
              const Icon = card.icon;
              return (
                <li key={card.id}>
                  <Card className="text-center bg-surface border border-border/80 shadow-xs h-full">
                    <CardContent className="flex flex-col items-center py-8 max-phone:py-6">
                      <Icon className={iconClasses} aria-hidden="true" />
                      <span className="text-4xl font-extrabold tracking-tight text-fg font-display max-phone:text-2xl">
                        <AnimatedCounter target={card.targetValue} suffix={card.suffix} />
                      </span>
                      <span className="mt-2 text-sm font-semibold text-fg-muted text-balance px-2">
                        {card.label}
                      </span>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
