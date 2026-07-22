"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Volume2Icon, SquareIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReadAloudProps {
  targetId: string;
  className?: string;
}

export function ReadAloud({ targetId, className }: ReadAloudProps) {
  const t = useTranslations("a11y");
  const locale = useLocale();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" && 
      "speechSynthesis" in window && 
      "SpeechSynthesisUtterance" in window
    );
  }, []);

  const handleToggle = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const element = document.getElementById(targetId);
      if (!element) return;

      // Extract text content and clean it up slightly
      const text = element.innerText || element.textContent || "";
      if (!text.trim()) return;

      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine language code
      if (locale === "uz") {
        utterance.lang = "uz-UZ";
      } else if (locale === "ru") {
        utterance.lang = "ru-RU";
      } else {
        utterance.lang = "en-US";
      }

      // Slightly slower speed for kids/cognitive accessibility
      utterance.rate = 0.85;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? t("readAloudStop") : t("readAloudPlay")}
      title={isPlaying ? t("readAloudStop") : t("readAloudPlay")}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-[var(--duration-base)] shadow-sm",
        isPlaying
          ? "bg-red-600 text-white animate-pulse"
          : "bg-brand text-fg-on-brand hover:scale-105 active:scale-95",
        className
      )}
    >
      {isPlaying ? (
        <>
          <SquareIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("readAloudStop")}</span>
        </>
      ) : (
        <>
          <Volume2Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t("readAloudPlay")}</span>
        </>
      )}
    </button>
  );
}
