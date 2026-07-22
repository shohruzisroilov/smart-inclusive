"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReadAloud } from "@/components/ui/ReadAloud";

interface ArticleLayoutProps {
  title: string;
  category: string;
  date: string;
  readingTime: string;
  content: string;
  onBack: () => void;
}

export function ArticleLayout({
  title,
  category,
  date,
  readingTime,
  content,
  onBack,
}: ArticleLayoutProps) {
  const t = useTranslations("article");
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      {/* Back button link */}
      <div className="select-none">
        <Button variant="secondary" onClick={onBack} className="flex items-center gap-1.5">
          <ArrowLeftIcon className="h-4 w-4" />
          {t("back")}
        </Button>
      </div>

      {/* Main card article content */}
      <Card className="border border-border/80 shadow-md overflow-hidden">
        <CardContent className="p-8 max-phone:p-6 space-y-6">
          {/* Metadata headers */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-4 select-none">
            <div className="flex flex-wrap items-center gap-4 text-xs text-fg-muted">
              <Badge variant="brand">{category}</Badge>
              
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{date}</span>
              </div>

              <div className="flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                <span>{readingTime}</span>
              </div>
            </div>

            {/* Read Aloud Text-to-Speech Button */}
            <ReadAloud targetId="article-read-target" />
          </div>

          {/* Heading and content wrapper for speech reading */}
          <div id="article-read-target" className="space-y-6">
            {/* Heading */}
            <h1 className="text-3xl font-black text-fg font-display leading-tight max-phone:text-2xl">
              {title}
            </h1>

            {/* Body content */}
            <div className="text-base text-fg leading-relaxed whitespace-pre-line space-y-4 max-phone:text-sm">
              {content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
