import { useId } from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface FilterState {
  hasTest: "all" | "yes" | "no";
  completed: "all" | "completed" | "uncompleted";
  language: "all" | "uz" | "ru" | "en";
  sortBy: "newest" | "oldest";
}

interface ContentListFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function ContentListFilters({
  filters,
  onChange,
  onReset,
}: ContentListFiltersProps) {
  const t = useTranslations("content.filters");
  const selectTestId = useId();
  const selectCompletedId = useId();
  const selectLanguageId = useId();
  const selectSortId = useId();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div
      aria-label={t("panelLabel")}
      className="p-5 rounded-2xl border border-border bg-surface shadow-xs space-y-4 text-left"
    >
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        {/* Filter 1: Language */}
        <Select
          id={selectLanguageId}
          label={t("language")}
          value={filters.language}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          options={[
            { value: "all", label: t("allLanguages") },
            { value: "uz", label: "Oʼzbekcha" },
            { value: "ru", label: "Русский" },
            { value: "en", label: "English" },
          ]}
        />

        {/* Filter 2: Test status */}
        <Select
          id={selectTestId}
          label={t("testStatus")}
          value={filters.hasTest}
          onChange={(e) => handleFilterChange("hasTest", e.target.value)}
          options={[
            { value: "all", label: t("any") },
            { value: "yes", label: t("withTest") },
            { value: "no", label: t("withoutTest") },
          ]}
        />

        {/* Filter 3: Completion status */}
        <Select
          id={selectCompletedId}
          label={t("progress")}
          value={filters.completed}
          onChange={(e) => handleFilterChange("completed", e.target.value)}
          options={[
            { value: "all", label: t("any") },
            { value: "completed", label: t("completed") },
            { value: "uncompleted", label: t("uncompleted") },
          ]}
        />

        {/* Filter 4: Sorting */}
        <Select
          id={selectSortId}
          label={t("sort")}
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          options={[
            { value: "newest", label: t("newest") },
            { value: "oldest", label: t("oldest") },
          ]}
        />
      </div>

      {/* Reset CTA */}
      <div className="flex justify-end pt-2 border-t border-border/50">
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="text-xs"
        >
          {t("clear")}
        </Button>
      </div>
    </div>
  );
}
