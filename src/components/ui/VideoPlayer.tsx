"use client";

import React, { useRef, useState, useEffect } from "react";
import { PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon, ArrowLeftIcon, Maximize2Icon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface VideoPlayerProps {
  src: string;
  title: string;
  onBack?: () => void;
}

export function VideoPlayer({ src, title, onBack }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Load video progress on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("si:media");
      if (raw) {
        const mediaStore = JSON.parse(raw);
        const savedTime = mediaStore[src];
        if (savedTime && videoRef.current) {
          videoRef.current.currentTime = savedTime;
          setTimeout(() => {
            setCurrentTime(savedTime);
          }, 0);
        }
      }
    } catch {}
  }, [src]);

  // Auto-hide controls after inactivity when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setShowControls(false), 2500);
    return () => clearTimeout(timer);
  }, [isPlaying, currentTime]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true); // Reset visibility directly in handler instead of effect
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Save to localStorage under si:media
    try {
      const raw = localStorage.getItem("si:media");
      const mediaStore = raw ? JSON.parse(raw) : {};
      if (videoRef.current.duration && time >= videoRef.current.duration - 1) {
        delete mediaStore[src];
      } else {
        mediaStore[src] = time;
      }
      localStorage.setItem("si:media", JSON.stringify(mediaStore));
    } catch {}
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " ") {
      e.preventDefault();
      handlePlayPause();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      handleMuteToggle();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      handleFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseMove={() => setShowControls(true)}
      className={cn(
        "relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-border/80 group focus:outline-3 focus:outline-[var(--focus-ring)] select-none"
      )}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={handlePlayPause}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* TOP HEADER CONTROLS */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 pointer-events-none select-none z-10",
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border-none text-white shrink-0"
              aria-label="Orqaga"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          )}
          <span className="text-white font-bold text-sm md:text-base font-display truncate max-w-xs md:max-w-md select-none">
            {title}
          </span>
        </div>
      </div>

      {/* BIG PLAY BUTTON IN THE MIDDLE */}
      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition-all duration-300 hover:scale-105 select-none focus:outline-none z-10"
          aria-label="Videoni qo'yish"
        >
          <div className="w-16 h-16 bg-brand/90 hover:bg-brand rounded-full flex items-center justify-center shadow-lg transition-colors">
            <PlayIcon className="h-8 w-8 fill-current ml-1" />
          </div>
        </button>
      )}

      {/* BOTTOM OVERLAY PLAYER CONTROLS */}
      <div
        className={cn(
          "absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 space-y-3 transition-opacity duration-300 pointer-events-none select-none z-10",
          showControls ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}
      >
        {/* Timeline Slider */}
        <div className="flex items-center gap-3 select-none pointer-events-auto">
          <span className="text-white text-xs font-mono select-none">{formatTime(currentTime)}</span>
          
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-brand bg-white/30 h-1 rounded-lg cursor-pointer appearance-none hover:h-1.5 transition-all select-none"
            aria-label="Video vaqti"
          />

          <span className="text-white text-xs font-mono select-none">{formatTime(duration)}</span>
        </div>

        {/* Player controls */}
        <div className="flex items-center justify-between select-none pointer-events-auto">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handlePlayPause}
              className="text-white hover:text-brand transition-colors focus:outline-none"
              aria-label={isPlaying ? "Vaqtinchalik to'xtatish" : "Videoni qo'yish"}
            >
              {isPlaying ? <PauseIcon className="h-5 w-5 fill-current" /> : <PlayIcon className="h-5 w-5 fill-current" />}
            </button>

            <button
              type="button"
              onClick={handleMuteToggle}
              className="text-white hover:text-brand transition-colors focus:outline-none"
              aria-label={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            >
              {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleFullscreen}
              className="text-white hover:text-brand transition-colors focus:outline-none"
              aria-label="Butun ekranga kattalashtirish"
            >
              <Maximize2Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
