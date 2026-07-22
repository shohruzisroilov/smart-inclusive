"use client";

import React, { useState, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2Icon, XCircleIcon, XIcon, RotateCcwIcon, ArrowRightIcon, LogOutIcon } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { type VocabularyTestQuestion as MockQuestion } from "@/lib/mocks/vocabulary";
import { useTestResultsStore } from "@/stores/test-results-store";
import { cn } from "@/lib/utils/cn";

// ----------------------------------------------------------------------------
// LIGHTWEIGHT CONFETTI EMITTER
// ----------------------------------------------------------------------------
interface ConfettiParticle {
  id: number;
  left: number;
  delay: number;
  color: string;
  scale: number;
  duration: number;
}

function ConfettiEffect() {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const COLORS = ["#ff5964", "#35a7ff", "#38b000", "#ffc857", "#e056fd", "#ff9f43"];
    const items = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      scale: 0.5 + Math.random() * 0.8,
      duration: 1.2 + Math.random() * 1.5,
    }));
    
    requestAnimationFrame(() => setParticles(items));

    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50 select-none">
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(450px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confettiFall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-10px] w-3 h-3 rounded-full animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            transform: `scale(${p.scale})`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// MAIN LAYOUT
// ----------------------------------------------------------------------------
interface VocabularyTestWizardProps {
  topicId: string;
  topicTitle: string;
  questions: MockQuestion[];
  onClose: () => void; // exit callback
}

export function VocabularyTestWizard({
  topicId,
  topicTitle,
  questions,
  onClose,
}: VocabularyTestWizardProps) {
  const t = useTranslations("test");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const saveResult = useTestResultsStore((s) => s.saveResult);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIdx]!;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercentage >= 60;

  const testKey = `vocab-${topicId}`;
  const optionIdPrefix = useId();

  // Handle option select
  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;

    setSelectedOpt(optIndex);
    setIsAnswered(true);

    const correct = optIndex === currentQuestion.correctOptionIndex;
    if (correct) {
      setCorrectCount((c) => c + 1);
      setShowConfetti(true);
    }
  };

  // Turn page
  const handleNext = () => {
    if (!isAnswered) return;

    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((idx) => idx + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setShowConfetti(false);
    } else {
      // Save result in store
      saveResult({
        testId: testKey,
        score: scorePercentage,
        correctCount,
        totalCount: totalQuestions,
        passed: isPassed,
      });

      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setShowResults(false);
    setShowConfetti(false);
  };

  // Exit dialog
  if (showExitConfirm) {
    return (
      <Card className="max-w-md mx-auto border border-border shadow-md">
        <CardContent className="p-8 text-center space-y-4">
          <div className="p-3 w-12 h-12 bg-status-warning-subtle text-status-warning rounded-full mx-auto flex items-center justify-center">
            <LogOutIcon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-fg font-display">{t("exitTitle")}</h3>
          <p className="text-sm text-fg-muted leading-relaxed">
            {t("vocabExitDesc")}
          </p>
          <div className="flex gap-4 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setShowExitConfirm(false)}>
              {t("continue")}
            </Button>
            <Button variant="primary" fullWidth onClick={onClose}>
              {t("exitConfirm")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // RESULTS SCOREBOARD VIEW
  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {isPassed ? (
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden text-center">
            <EmptyState
              title={t("vocabPassedTitle")}
              description={t("vocabPassedDesc", { topic: topicTitle, correct: correctCount, score: scorePercentage })}
              action={
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button variant="secondary" onClick={handleRetake} className="flex items-center gap-2">
                    <RotateCcwIcon className="h-4 w-4" />
                    {t("retake")}
                  </Button>
                  <Button onClick={onClose}>{t("backToMaterial")}</Button>
                </div>
              }
            />
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden text-center">
            <ErrorState
              title={t("vocabFailedTitle")}
              description={t("vocabFailedDesc", { score: scorePercentage, correct: correctCount, total: totalQuestions })}
              action={
                <div className="flex flex-wrap gap-4 justify-center pt-2">
                  <Button variant="primary" onClick={handleRetake} className="flex items-center gap-2">
                    <RotateCcwIcon className="h-4 w-4" />
                    {t("retry")}
                  </Button>
                  <Button variant="secondary" onClick={onClose}>{t("backToMaterial")}</Button>
                </div>
              }
            />
          </div>
        )}
      </div>
    );
  }

  const progressRatio = totalQuestions > 0 ? (currentIdx / totalQuestions) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto border border-border shadow-md overflow-hidden relative">
      {/* Confetti element */}
      {showConfetti && <ConfettiEffect />}

      {/* Progress tracking line */}
      <div className="w-full h-2 bg-surface-subtle border-b border-border/40 overflow-hidden relative select-none">
        <div
          className="h-full bg-brand rounded-r-md transition-all duration-[var(--duration-base)] ease-out"
          style={{ width: `${progressRatio}%` }}
          aria-hidden="true"
        />
      </div>

      {/* Header index counters */}
      <CardHeader className="border-none pb-0 pt-6 flex flex-row items-center justify-between gap-4">
        <Badge variant="brand">
          {t("questionCounter", { current: currentIdx + 1, total: totalQuestions })}
        </Badge>
        
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className={cn(
            "tap-target p-2 rounded-lg text-fg-muted hover:text-fg hover:bg-surface-subtle transition-all",
            "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
          )}
          aria-label={t("stop")}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </CardHeader>

      <CardContent className="p-8 max-phone:p-6 space-y-8 text-center select-none">
        {/* Word Prompt Question */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-fg-subtle uppercase tracking-wider block">
            {t("vocabPrompt")}
          </span>
          <h3 className="text-4xl font-black text-brand font-display tracking-tight max-phone:text-3xl">
            &ldquo;{currentQuestion.questionWord}&rdquo;
          </h3>
        </div>

        {/* 4-Image Card grid option */}
        <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-label={t("answersLabel")}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOpt === index;
            const isCorrect = index === currentQuestion.correctOptionIndex;
            const optionId = `${optionIdPrefix}-vocab-opt-${index}`;

            const cardClasses = cn(
              "w-full text-center p-3.5 rounded-2xl border font-bold transition-all duration-[var(--duration-fast)] flex flex-col items-center gap-3 overflow-hidden select-none",
              "focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]",
              
              // 1. Before selection
              !isAnswered && [
                "bg-surface border-border hover:border-border-strong hover:bg-surface-subtle hover:scale-[1.015] cursor-pointer",
                "active:scale-[0.995]"
              ],
              
              // 2. Post validation
              isAnswered && [
                isCorrect && "bg-status-success-subtle/50 text-status-dark-success border-status-success",
                isSelected && !isCorrect && "bg-status-danger-subtle/50 text-status-dark-danger border-status-danger",
                !isSelected && !isCorrect && "opacity-35 border-border bg-surface text-fg-muted cursor-not-allowed"
              ]
            );

            return (
              <button
                key={index}
                id={optionId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isAnswered}
                disabled={isAnswered}
                onClick={() => handleSelectOption(index)}
                className={cardClasses}
              >
                {/* Visual Option Image */}
                <div className="w-full aspect-video rounded-xl bg-surface-subtle overflow-hidden border border-border/40 select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={option.imageUrl}
                    alt={t("vocabImageAlt")}
                    className="w-full h-full object-cover select-none"
                  />
                </div>

                {/* Option label: initially hidden (shows '???'), revealed after selection */}
                <div className="text-sm font-semibold select-none flex items-center gap-1.5 min-h-[24px]">
                  {!isAnswered ? (
                    <span className="text-fg-subtle select-none font-medium tracking-widest">???</span>
                  ) : (
                    <>
                      {isCorrect && <CheckCircle2Icon className="h-4 w-4 text-status-success shrink-0" />}
                      {isSelected && !isCorrect && <XCircleIcon className="h-4 w-4 text-status-danger shrink-0" />}
                      <span className="select-none">{option.label}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>

      {/* Footer trigger */}
      <CardFooter className="pt-3 pb-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="flex items-center gap-1.5 min-w-32 justify-center"
        >
          {currentIdx === totalQuestions - 1 ? t("viewResult") : t("next")}
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
