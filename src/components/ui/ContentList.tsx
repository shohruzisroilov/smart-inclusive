"use client";

import { useState } from "react";
import { type BaseContentItem } from "@/types/content";
import { useProgressStore } from "@/stores/progress-store";
import { ContentCard } from "@/components/ui/ContentCard";
import { ContentListFilters, type FilterState } from "@/components/ui/ContentListFilters";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Button } from "@/components/ui/Button";

interface ContentListProps {
  items: BaseContentItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onActionClick?: (item: BaseContentItem) => void;
  actionText?: string;
  emptyNoDataTitle?: string;
  emptyNoDataDesc?: string;
}

const DEFAULT_FILTERS: FilterState = {
  hasTest: "all",
  completed: "all",
  language: "all",
  sortBy: "newest",
};

export function ContentList({
  items,
  loading = false,
  error = null,
  onRetry,
  onActionClick,
  actionText,
  emptyNoDataTitle = "Hozircha hech qanday maʼlumot yoʼq",
  emptyNoDataDesc = "Ushbu boʼlimga tez orada yangi oʼquv materiallari yuklanadi.",
}: ContentListProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const completedItems = useProgressStore((s) => s.completedItems);

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  // 1. Loading Skeleton Grid
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-border rounded-xl p-5 bg-surface space-y-4">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error Feedback
  if (error) {
    return (
      <ErrorState
        title="Maʼlumotlarni oʼqib boʼlmadi"
        description={error}
        action={onRetry ? <Button onClick={onRetry}>Qayta urinish</Button> : undefined}
      />
    );
  }

  // 3. Database Empty State
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyNoDataTitle}
        description={emptyNoDataDesc}
      />
    );
  }

  // 4. Filtering and Sorting Logic
  const filteredItems = items
    .filter((item) => {
      // Language Filter
      if (filters.language !== "all" && item.contentLanguage !== filters.language) {
        return false;
      }
      // Test Status Filter
      if (filters.hasTest === "yes" && !item.hasTest) return false;
      if (filters.hasTest === "no" && item.hasTest) return false;
      
      // Completion Status Filter
      const isCompleted = !!completedItems[item.id];
      if (filters.completed === "completed" && !isCompleted) return false;
      if (filters.completed === "uncompleted" && isCompleted) return false;

      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return filters.sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="space-y-6">
      {/* Search Filter Panel */}
      <ContentListFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {/* 5. Filtered Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="Saralash boʼyicha hech narsa topilmadi"
          description="Kiritilgan filtrlar boʼyicha birorta ham kontent mavjud emas. Boshqa filtrlarni sinab koʼring yoki sozlamalarni tozalang."
          action={<Button variant="secondary" onClick={resetFilters}>Filtrlarni tozalash</Button>}
        />
      ) : (
        /* 6. Success Grid List */
        <ul className="grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <li key={item.id} className="h-full">
              <ContentCard
                item={item}
                completed={!!completedItems[item.id]}
                onActionClick={onActionClick}
                actionText={actionText}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
