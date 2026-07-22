"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { VOCABULARY_TOPICS } from "@/lib/mocks/vocabulary";
import { buttonStyles } from "@/components/ui/Button";
import { BookOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function VocabularyListClient() {
  const t = useTranslations("vocab");
  const [langFilter, setLangFilter] = useState<string>("all");

  const filteredTopics = VOCABULARY_TOPICS.filter((topic) => {
    if (langFilter !== "all" && topic.language !== langFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Filter panel */}
      <div className="max-w-xs select-none">
        <Select
          id="vocab-lang-filter"
          label={t("filterLabel")}
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          options={[
            { value: "all", label: t("allLanguages") },
            { value: "uz", label: "Oʼzbekcha (UZ)" },
            { value: "ru", label: "Русский (RU)" },
            { value: "en", label: "English (EN)" },
          ]}
        />
      </div>

      {/* Grid listing */}
      {filteredTopics.length === 0 ? (
        <div className="text-center py-12 text-fg-subtle select-none">
          {t("emptyLang")}
        </div>
      ) : (
        <ul className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <li key={topic.id} className="h-full">
              <Card className="h-full flex flex-col justify-between border border-border/80 shadow-xs hover:shadow-sm transition-all duration-[var(--duration-base)] text-left">
                <CardHeader className="pb-0 pt-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="brand" size="sm">
                      {topic.language.toUpperCase()}
                    </Badge>
                    <Badge variant="neutral" size="sm" className="text-xs">
                      {t("wordsCount", { count: topic.wordsCount })}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-fg font-display leading-tight">
                    {topic.title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-2 pb-6 text-sm text-fg-muted">
                  {t("cardDesc")}
                </CardContent>
                <CardFooter className="pt-3 pb-4">
                  <Link
                    href={`/vocabulary/${topic.id}`}
                    className={cn(buttonStyles({ variant: "primary", fullWidth: true }), "flex items-center justify-center gap-2")}
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    {t("start")}
                  </Link>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
