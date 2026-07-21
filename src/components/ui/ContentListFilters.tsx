import { useId } from "react";
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
      aria-label="Filtrlash paneli"
      className="p-5 rounded-2xl border border-border bg-surface shadow-xs space-y-4 text-left"
    >
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        {/* Filter 1: Language */}
        <Select
          id={selectLanguageId}
          label="Kontent tili"
          value={filters.language}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          options={[
            { value: "all", label: "Barcha tillar" },
            { value: "uz", label: "Oʼzbekcha" },
            { value: "ru", label: "Русский" },
            { value: "en", label: "English" },
          ]}
        />

        {/* Filter 2: Test status */}
        <Select
          id={selectTestId}
          label="Test holati"
          value={filters.hasTest}
          onChange={(e) => handleFilterChange("hasTest", e.target.value)}
          options={[
            { value: "all", label: "Farqi yoʼq" },
            { value: "yes", label: "Testi borlar" },
            { value: "no", label: "Testi yoʼqlar" },
          ]}
        />

        {/* Filter 3: Completion status */}
        <Select
          id={selectCompletedId}
          label="Progress holati"
          value={filters.completed}
          onChange={(e) => handleFilterChange("completed", e.target.value)}
          options={[
            { value: "all", label: "Farqi yoʼq" },
            { value: "completed", label: "Bajarilganlar" },
            { value: "uncompleted", label: "Bajarilmaganlar" },
          ]}
        />

        {/* Filter 4: Sorting */}
        <Select
          id={selectSortId}
          label="Saralash"
          value={filters.sortBy}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          options={[
            { value: "newest", label: "Avval yangilari" },
            { value: "oldest", label: "Avval eskilari" },
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
          Filtrlarni tozalash
        </Button>
      </div>
    </div>
  );
}
