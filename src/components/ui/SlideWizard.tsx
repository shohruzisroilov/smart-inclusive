"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon, CheckIcon, RotateCcwIcon, ArrowLeftIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

export interface SlideItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface SlideWizardProps {
  title: string;
  slides: SlideItem[];
  onClose: () => void;
  onComplete?: () => void; // Optional global callback on finish click
  completionTitle?: string;
  completionDescription?: string;
  completionAction?: React.ReactNode;
}

export function SlideWizard({
  title,
  slides,
  onClose,
  onComplete,
  completionTitle,
  completionDescription,
  completionAction,
}: SlideWizardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const totalSlides = slides.length;

  // Keyboard navigation hook - must be declared before early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowRight") {
        if (currentIdx < totalSlides - 1) {
          e.preventDefault();
          setCurrentIdx((idx) => idx + 1);
        } else if (!showCompletion) {
          e.preventDefault();
          onComplete?.();
          setShowCompletion(true);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIdx > 0 && !showCompletion) {
          e.preventDefault();
          setCurrentIdx((idx) => idx - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIdx, totalSlides, showCompletion, onComplete]);
  
  // Safe bounds check
  if (totalSlides === 0) {
    return (
      <Card className="p-8 text-center border border-border">
        <p className="text-fg-muted">Slaydlar mavjud emas.</p>
        <Button onClick={onClose} className="mt-4">Qaytish</Button>
      </Card>
    );
  }

  const currentSlide = slides[currentIdx]!;

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < totalSlides - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      onComplete?.();
      setShowCompletion(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setShowCompletion(false);
  };

  // COMPLETION VIEW
  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-surface shadow-sm overflow-hidden text-center">
        <EmptyState
          title={completionTitle || "Taqdimot yakunlandi!"}
          description={
            completionDescription ||
            "Siz ushbu bo&apos;limning barcha slaydlarini to&apos;liq ko&apos;rib chiqdingiz. Quyidagi tugmalar orqali taqdimotni qayta ko&apos;rishingiz yoki darslarga qaytishingiz mumkin."
          }
          action={
            completionAction || (
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="secondary" onClick={handleRestart} className="flex items-center gap-2">
                  <RotateCcwIcon className="h-4 w-4" />
                  {"Yana o'tish"}
                </Button>
                <Button onClick={onClose} className="flex items-center gap-2">
                  <ArrowLeftIcon className="h-4 w-4" />
                  Qaytish
                </Button>
              </div>
            )
          }
        />
      </div>
    );
  }

  const progressRatio = totalSlides > 1 ? (currentIdx / (totalSlides - 1)) * 100 : 100;
  const isLast = currentIdx === totalSlides - 1;

  return (
    <Card className="w-full max-w-2xl mx-auto border border-border shadow-md overflow-hidden relative text-left">
      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-subtle border-b border-border/40 overflow-hidden relative select-none">
        <div
          className="h-full bg-brand rounded-r-md transition-all duration-[var(--duration-base)] ease-out"
          style={{ width: `${progressRatio}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Header bar controls */}
      <CardHeader className="border-none pb-0 pt-6 flex flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2">
          <Badge variant="brand">
            {currentIdx + 1} / {totalSlides} slayd
          </Badge>
          <span className="text-xs font-bold text-fg-muted font-display truncate max-w-xs md:max-w-md">
            {title}
          </span>
        </div>
        
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "tap-target p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-subtle transition-all focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
          )}
          aria-label="Yopish"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </CardHeader>

      <CardContent className="p-8 max-phone:p-6 space-y-6">
        {/* Slide image if any */}
        {currentSlide.imageUrl && (
          <div className="aspect-video w-full bg-surface-subtle border border-border/60 rounded-xl overflow-hidden flex items-center justify-center select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="w-full h-full object-cover select-none"
            />
          </div>
        )}

        {/* Slide text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold text-fg font-display tracking-tight leading-tight max-phone:text-xl">
            {currentSlide.title}
          </h2>
          <p className="text-base text-fg-muted leading-relaxed whitespace-pre-line max-phone:text-sm">
            {currentSlide.description}
          </p>
        </div>
      </CardContent>

      {/* Footer trigger */}
      <CardFooter className="pt-3 pb-6 flex justify-between select-none">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Orqaga
        </Button>

        <Button
          onClick={handleNext}
          className="flex items-center gap-1.5 min-w-32 justify-center"
        >
          {isLast ? (
            <>
              Tayyor!
              <CheckIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              Keyingi
              <ChevronRightIcon className="h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
