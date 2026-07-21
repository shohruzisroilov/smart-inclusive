"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Volume2Icon, PlayIcon, PauseIcon, GraduationCapIcon, ArrowLeftIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button, buttonStyles } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

interface WordSlideshowClientProps {
  topicId: string;
  words: Array<{
    id: string;
    word: string;
    imageUrl: string;
    audioUrls: { uz?: string; ru?: string; en?: string };
  }>;
  hasTest: boolean;
}

type AudioLang = "uz" | "ru" | "en";

export function WordSlideshowClient({ topicId, words, hasTest }: WordSlideshowClientProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Set default audio language from active word
  const activeWord = words[currentIdx]!;
  const getInitialLang = (): AudioLang => {
    if (activeWord.audioUrls.uz) return "uz";
    if (activeWord.audioUrls.ru) return "ru";
    if (activeWord.audioUrls.en) return "en";
    return "uz";
  };
  const [audioLang, setAudioLang] = useState<AudioLang>(getInitialLang());

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync audio source when active index or active lang switches
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);

    const activeTrack = activeWord.audioUrls[audioLang];
    if (activeTrack) {
      audioRef.current.src = activeTrack;
      audioRef.current.load();
    }
  }, [currentIdx, audioLang, activeWord]);

  const handlePlayPause = () => {
    if (!audioRef.current || !activeWord.audioUrls[audioLang]) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Navigations
  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < words.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const isFinalWord = currentIdx === words.length - 1;
  const audioTrackExists = !!activeWord.audioUrls[audioLang];

  // Keyboard navigation hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowRight") {
        if (currentIdx < words.length - 1) {
          e.preventDefault();
          setCurrentIdx((idx) => idx + 1);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentIdx > 0) {
          e.preventDefault();
          setCurrentIdx((idx) => idx - 1);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        if (audioRef.current && activeWord.audioUrls[audioLang]) {
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
  }, [currentIdx, words, isPlaying, audioLang, activeWord]);

  return (
    <div className="space-y-6 text-left select-none">
      {/* Audio Player Node */}
      <audio ref={audioRef} onEnded={handleAudioEnded} aria-hidden="true" />

      {/* Main Slideshow Card */}
      <Card className="overflow-hidden border border-border/80 shadow-md">
        <div className="aspect-video w-full bg-surface-subtle overflow-hidden relative select-none">
          {/* Large illustration */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeWord.imageUrl}
            alt={activeWord.word}
            className="w-full h-full object-cover select-none"
          />
          
          {/* Page index overlay */}
          <div className="absolute top-4 left-4">
            <Badge variant="neutral" className="bg-surface/90 backdrop-blur-xs">
              {currentIdx + 1} / {words.length}
            </Badge>
          </div>
        </div>

        <CardContent className="p-8 text-center space-y-6">
          {/* Large Word Text */}
          <h2 className="text-4xl font-extrabold text-fg font-display tracking-tight">
            {activeWord.word}
          </h2>

          {/* Audio controller section */}
          <div className="flex flex-col items-center gap-4 bg-surface-subtle p-4 rounded-xl border border-border/50 max-w-sm mx-auto">
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={handlePlayPause}
                disabled={!audioTrackExists}
                className="rounded-full w-12 h-12 flex items-center justify-center p-0 shrink-0"
                aria-label="Talaffuzni eshitish"
              >
                {isPlaying ? <PauseIcon className="h-5 w-5 fill-current" /> : <PlayIcon className="h-5 w-5 fill-current ml-0.5" />}
              </Button>
              <span className="text-sm font-bold text-fg flex items-center gap-1">
                <Volume2Icon className="h-4 w-4 text-brand" />
                Talaffuzni eshitish
              </span>
            </div>

            {/* Audio lang switches */}
            <div className="flex gap-2">
              {(["uz", "ru", "en"] as AudioLang[]).map((lang) => {
                const disabled = !activeWord.audioUrls[lang];
                return (
                  <button
                    key={lang}
                    type="button"
                    disabled={disabled}
                    onClick={() => setAudioLang(lang)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold transition-all select-none border",
                      audioLang === lang
                        ? "bg-brand text-fg-on-brand border-brand"
                        : "bg-surface border-border text-fg-muted hover:text-fg hover:border-border-strong",
                      disabled && "opacity-35 cursor-not-allowed hover:bg-surface hover:border-border"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control panel: pagination vs. test redirection on last slide */}
      <div className="flex items-center justify-between gap-4 py-2 select-none">
        <Button variant="secondary" onClick={handlePrev} disabled={currentIdx === 0} className="flex items-center gap-1.5">
          <ChevronLeftIcon className="h-4 w-4" />
          Orqaga
        </Button>

        {isFinalWord ? (
          hasTest ? (
            <Link
              href={`/vocabulary/${topicId}/test`}
              className={cn(buttonStyles({ variant: "accent", size: "md" }), "flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200")}
            >
              <GraduationCapIcon className="h-5 w-5" />
              Testni boshlash
            </Link>
          ) : (
            <Link
              href="/vocabulary"
              className={cn(buttonStyles({ variant: "primary", size: "md" }), "flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200")}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Mavzularga qaytish
            </Link>
          )
        ) : (
          <Button onClick={handleNext} className="flex items-center gap-1.5">
            Keyingi
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
