"use client";

import React, { useState, useEffect, useRef, type ReactNode, type TouchEvent } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  BookmarkIcon,
  BookmarkCheckIcon,
  Volume2Icon,
  ArrowLeftIcon,
  GraduationCapIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useProgressStore } from "@/stores/progress-store";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { ReadAloud } from "@/components/ui/ReadAloud";

export interface ReaderPage {
  title?: string;
  content: string;
  illustration?: () => ReactNode; // dynamic SVG component
  imageUrl?: string; // fallback picture link
}

interface PagedReaderProps {
  id: string; // Unique book ID (e.g. "book-zumrad")
  title: string;
  pages: ReaderPage[];
  audioUrls?: {
    uz?: string;
    ru?: string;
    en?: string;
  };
  testId?: string; // Linked test ID (e.g. "zumrad-test")
  onBack?: () => void; // Trigger when clicking "Orqaga" to return to book library
}

type AudioLang = "uz" | "ru" | "en";

export function PagedReader({
  id,
  title,
  pages,
  audioUrls,
  testId,
  onBack,
}: PagedReaderProps) {
  const t = useTranslations("reader");
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Set default audio language based on available streams
  const getInitialLang = (): AudioLang => {
    if (audioUrls?.uz) return "uz";
    if (audioUrls?.ru) return "ru";
    if (audioUrls?.en) return "en";
    return "uz";
  };
  const [audioLang, setAudioLang] = useState<AudioLang>(getInitialLang());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Zustand Store variables
  const bookmarks = useProgressStore((s) => s.bookmarks);
  const saveBookmark = useProgressStore((s) => s.saveBookmark);
  const toggleComplete = useProgressStore((s) => s.toggleComplete);

  const savedPage = bookmarks[id] ?? 0;
  const isFinalPage = currentPage === pages.length - 1;

  // Mark content as completed automatically when reaching final page
  useEffect(() => {
    if (isFinalPage) {
      toggleComplete(id, true);
    }
  }, [isFinalPage, id, toggleComplete]);

  // Synchronize audio element source
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Pause before changing audio sources
    audioRef.current.pause();
    setIsPlaying(false);
    
    const activeUrl = audioUrls?.[audioLang];
    if (activeUrl) {
      audioRef.current.src = activeUrl;
      audioRef.current.load();
    }
  }, [audioLang, audioUrls]);

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrls?.[audioLang]) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  // Navigations
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      // Reset audio position when turning pages
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage((p) => p + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  };

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowRight") {
        if (currentPage < pages.length - 1) {
          e.preventDefault();
          setCurrentPage((p) => p + 1);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }
      } else if (e.key === "ArrowLeft") {
        if (currentPage > 0) {
          e.preventDefault();
          setCurrentPage((p) => p - 1);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }
      } else if (e.key === " ") {
        e.preventDefault();
        if (audioRef.current && audioUrls?.[audioLang]) {
          if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          } else {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, pages, isPlaying, audioLang, audioUrls]);

  // Bookmark actions
  const handleSaveBookmark = () => {
    saveBookmark(id, currentPage);
  };

  const handleLoadBookmark = () => {
    if (savedPage < pages.length) {
      setCurrentPage(savedPage);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]!.clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0]!.clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 55; // swipe sensitivity

    if (diff > threshold) {
      handleNextPage();
    } else if (diff < -threshold) {
      handlePrevPage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Formatter helper for audio minutes
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const activePage = pages[currentPage]!;
  const Illustration = activePage.illustration;
  const hasAudio = !!audioUrls && Object.values(audioUrls).some(Boolean);

  return (
    <article className="space-y-6 text-left" aria-label={`${title} oʼqish moduli`}>
      {/* 1. Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border shadow-xs">
        <Button variant="secondary" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeftIcon className="h-4 w-4" />
          {t("backToLibrary")}
        </Button>

        <div className="flex items-center gap-3">
          {/* Bookmark Load */}
          {savedPage > 0 && savedPage !== currentPage && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLoadBookmark}
              className="text-xs flex items-center gap-1.5"
            >
              <BookmarkCheckIcon className="h-4 w-4 text-brand" />
              {t("bookmarkReturn", { page: savedPage + 1 })}
            </Button>
          )}

          {/* Bookmark Save */}
          <Button
            variant={savedPage === currentPage ? "secondary" : "primary"}
            size="sm"
            onClick={handleSaveBookmark}
            disabled={savedPage === currentPage}
            className="text-xs flex items-center gap-1.5"
          >
            <BookmarkIcon className="h-4 w-4" />
            {savedPage === currentPage ? t("bookmarkSaved") : t("bookmarkSave")}
          </Button>
        </div>
      </div>

      {/* 2. Audio Player Sync bar */}
      {hasAudio && (
        <div className="bg-surface-subtle border border-border/80 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
          {/* Audio Node */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleAudioEnded}
            aria-hidden="true"
          />

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Play Button */}
            <Button
              onClick={handlePlayPause}
              variant="primary"
              size="sm"
              className="rounded-full shrink-0 w-11 h-11 flex items-center justify-center"
              aria-label={isPlaying ? t("pauseAudio") : t("playAudio")}
              disabled={!audioUrls?.[audioLang]}
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5 fill-current" />
              ) : (
                <PlayIcon className="h-5 w-5 fill-current ml-0.5" />
              )}
            </Button>

            <div className="text-left select-none">
              <div className="text-sm font-bold text-fg flex items-center gap-1.5">
                <Volume2Icon className="h-4 w-4 text-brand" />
                {t("listen")}
              </div>
              <div className="text-xs text-fg-muted">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Timeline slider */}
          <div className="flex-1 w-full mx-2 flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              aria-label="Audio timeline"
              disabled={!audioUrls?.[audioLang]}
            />
          </div>

          {/* Audio Language Switches */}
          <div className="flex items-center gap-2 border-l border-border/60 pl-4 max-md:border-l-0 max-md:pl-0">
            {(["uz", "ru", "en"] as AudioLang[]).map((lang) => {
              const disabled = !audioUrls?.[lang];
              return (
                <button
                  key={lang}
                  type="button"
                  disabled={disabled}
                  onClick={() => setAudioLang(lang)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-[var(--duration-fast)] select-none",
                    audioLang === lang
                      ? "bg-brand text-fg-on-brand shadow-xs"
                      : "bg-surface border border-border text-fg-muted hover:text-fg hover:border-border-strong",
                    disabled && "opacity-35 cursor-not-allowed hover:bg-surface hover:text-fg-muted hover:border-border"
                  )}
                  aria-label={t("audioLangLabel", { lang: lang.toUpperCase() })}
                >
                  {lang.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Main Reading Card Area */}
      <Card
        className="overflow-hidden border border-border/80 shadow-md transition-all select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-1 laptop:grid-cols-12 items-stretch min-h-[360px]">
          {/* Page Image / SVG illustration */}
          <div className="laptop:col-span-5 bg-gradient-to-br from-brand/5 to-brand/15 flex items-center justify-center p-8 border-b laptop:border-b-0 laptop:border-r border-border/60 select-none">
            {Illustration ? (
              <div className="w-full max-w-[280px] drop-shadow-sm">
                <Illustration />
              </div>
            ) : activePage.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activePage.imageUrl}
                alt={activePage.title || t("pageCounter", { current: currentPage + 1, total: pages.length })}
                className="w-full max-h-[300px] object-contain rounded-xl select-none"
              />
            ) : (
              <div className="p-8 text-center text-fg-subtle select-none">
                {t("noImage")}
              </div>
            )}
          </div>

          {/* Text Page contents */}
          <CardContent className="laptop:col-span-7 p-8 max-phone:p-6 flex flex-col justify-between text-left">
              <div className="flex items-center justify-between gap-4">
                <Badge variant="brand" size="sm">
                  {t("pageCounter", { current: currentPage + 1, total: pages.length })}
                </Badge>
                {savedPage === currentPage && (
                  <span className="text-xs font-semibold text-brand flex items-center gap-1">
                    <BookmarkIcon className="h-3.5 w-3.5 fill-current" />
                    {t("markedPage")}
                  </span>
                )}
                {!hasAudio && <ReadAloud targetId="paged-reader-content" className="py-1 px-3 text-xs" />}
              </div>

              <div id="paged-reader-content" className="space-y-4">
                {activePage.title && (
                  <h2 className="text-2xl font-bold text-fg font-display leading-tight">
                    {activePage.title}
                  </h2>
                )}

                <p className="text-base text-fg-muted leading-relaxed whitespace-pre-line pt-2">
                  {activePage.content}
                </p>
              </div>

            {/* Test Unlock logic */}
            {isFinalPage && testId && (
              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-[var(--duration-base)]">
                <div className="flex items-center gap-2 text-status-success text-sm font-bold">
                  <CheckCircle2Icon className="h-5 w-5" />
                  {t("finished")}
                </div>
                <p className="text-xs text-fg-muted">
                  {t("testPrompt")}
                </p>
                <Link
                  href={`/tests/${testId}`}
                  className={cn(buttonStyles({ variant: "accent", size: "md" }), "flex items-center gap-2 mt-1")}
                >
                  <GraduationCapIcon className="h-5 w-5" />
                  {t("goToTest")}
                </Link>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* 4. Controls Footer */}
      <div className="flex items-center justify-between py-2">
        <Button
          variant="secondary"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          {t("prev")}
        </Button>

        <span className="text-sm font-bold text-fg-muted select-none">
          {t("pageCounter", { current: currentPage + 1, total: pages.length })}
        </span>

        <Button
          variant="primary"
          onClick={handleNextPage}
          disabled={isFinalPage}
          className="flex items-center gap-1.5"
        >
          {t("next")}
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

import { CheckCircle2Icon } from "lucide-react";
