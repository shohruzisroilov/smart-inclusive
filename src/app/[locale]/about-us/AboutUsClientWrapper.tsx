"use client";

import React, { useState } from "react";
import { PlayIcon, CalendarIcon, QuoteIcon, XIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { MOCK_ABOUT_US, type AboutUsData, type RegionVideo } from "@/lib/mocks/volunteers-about";
import { cn } from "@/lib/utils/cn";

export function AboutUsClientWrapper() {
  const [data] = useState<AboutUsData>(MOCK_ABOUT_US);
  const [activeVideo, setActiveVideo] = useState<RegionVideo | null>(null);

  return (
    <div className="py-12 space-y-16 select-none text-left">
      {/* 1. HERO HEADER */}
      <section className="px-4">
        <Container>
          <div className="bg-gradient-to-r from-accent/10 via-accent-light/5 to-transparent rounded-3xl p-10 max-phone:p-6 text-left relative overflow-hidden select-none border border-accent/10">
            <div className="max-w-2xl">
              <Badge variant="accent" className="mb-4">LOYIHA MISSIYASI</Badge>
              <h1 className="text-4xl font-black text-fg font-display tracking-tight leading-tight max-phone:text-3xl">
                {data.hero.title}
              </h1>
              <p className="mt-2 text-lg text-fg-muted font-semibold">
                {data.hero.subtitle}
              </p>
              <p className="mt-4 text-base text-fg-muted leading-relaxed">
                {data.hero.description}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. ALTERNATING TEXT/MEDIA BLOCKS */}
      <section className="px-4">
        <Container className="space-y-16">
          {data.blocks.map((block) => (
            <div
              key={block.id}
              className={cn(
                "flex flex-col lg:flex-row items-center gap-12",
                block.align === "left" ? "lg:flex-row-reverse" : ""
              )}
            >
              {/* Text side */}
              <div className="flex-1 space-y-4 text-left">
                <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight leading-tight">
                  {block.title}
                </h2>
                <p className="text-base text-fg-muted leading-relaxed whitespace-pre-line">
                  {block.description}
                </p>
              </div>

              {/* Image side */}
              <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden border border-border bg-surface-subtle shadow-sm select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.imageUrl}
                  alt={block.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* 3. IMPACT STATISTICS COUNTER */}
      <section className="bg-surface-subtle py-12 border-y border-border/50 px-4">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center select-none">
            {data.results.map((stat) => (
              <div key={stat.id} className="space-y-2">
                <span className="block text-4xl font-black text-brand font-display tracking-tight">
                  {stat.value}
                </span>
                <span className="block text-sm font-semibold text-fg-muted uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. VOLUNTEER COMMUNITY TESTIMONIALS */}
      <section className="px-4">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10 select-none">
            <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight">
              Hamjamiyat Fikrlari
            </h2>
            <p className="mt-2 text-fg-muted">
              Platforma orqali farzandlari ta&apos;lim olayotgan ota-onalar va ko&apos;ngillilarimiz fikrlari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.testimonials.map((t) => (
              <Card key={t.id} className="border border-border/80 p-6 flex flex-col justify-between relative h-full">
                <CardContent className="pt-4 space-y-4">
                  <div className="text-brand shrink-0">
                    <QuoteIcon className="h-8 w-8 fill-current opacity-20" />
                  </div>
                  <p className="text-sm text-fg-muted italic leading-relaxed text-left">
                    &quot;{t.quote}&quot;
                  </p>
                </CardContent>
                <div className="border-t border-border/40 pt-4 mt-4 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center font-bold">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-fg font-display">{t.author}</h4>
                    <p className="text-xs text-fg-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. TRIP TO REGIONS GALLERY */}
      <section className="px-4">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10 select-none">
            <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight">
              Hududlardan Safarlarimiz
            </h2>
            <p className="mt-2 text-fg-muted">
              Inklyuzivlikni viloyat va chekka tumanlardagi maktablarda keng yoyish bo&apos;yicha sayohatlarimiz galereyasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.travels.map((travel) => (
              <Card key={travel.id} className="overflow-hidden border border-border flex flex-col h-full">
                <div className="aspect-video w-full relative bg-surface-subtle select-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={travel.imageUrl}
                    alt={travel.title}
                    className="w-full h-full object-cover select-none"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {travel.date}
                  </div>
                </div>
                <div className="p-6 space-y-2 text-left">
                  <h3 className="text-xl font-bold text-fg font-display tracking-tight">
                    {travel.title}
                  </h3>
                  <p className="text-sm text-fg-muted leading-relaxed">
                    {travel.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. TRAVEL VIDEOS (LIGHTBOX TRIGGERS) */}
      <section className="px-4">
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10 select-none">
            <h2 className="text-3xl font-extrabold text-fg font-display tracking-tight">
              Sayohat Videolavhalari
            </h2>
            <p className="mt-2 text-fg-muted">
              Viloyatlardagi faoliyatimizdan olingan qisqa interaktiv hisobotlar va dars jarayonlari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.videos.map((vid) => (
              <button
                key={vid.id}
                onClick={() => setActiveVideo(vid)}
                className="group relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black select-none text-left focus-visible:outline-3 focus-visible:outline-[var(--focus-ring)]"
              >
                {/* Thumbnail image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-102 transition-transform duration-300"
                />

                {/* Duration Tag */}
                <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-xs font-mono">
                  {vid.duration}
                </div>

                {/* Bottom Overlay title */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-10">
                  <h4 className="text-white font-bold font-display leading-tight truncate group-hover:text-brand transition-colors">
                    {vid.title}
                  </h4>
                </div>

                {/* Play hover item */}
                <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-brand/90 group-hover:bg-brand text-white rounded-full flex items-center justify-center shadow-lg transition-colors scale-95 group-hover:scale-100 duration-200">
                    <PlayIcon className="h-6 w-6 fill-current ml-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* VIDEO LIGHTBOX MODAL DIALOG */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden text-center select-none animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-white/70 hover:text-white bg-black/60 hover:bg-black/80 transition-all z-20 focus:outline-none"
              aria-label="Yopish"
            >
              <XIcon className="h-5 w-5" />
            </button>

            {/* Video Player */}
            <VideoPlayer
              src={activeVideo.videoUrl}
              title={activeVideo.title}
              onBack={() => setActiveVideo(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
