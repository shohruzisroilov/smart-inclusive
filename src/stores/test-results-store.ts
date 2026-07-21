"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage";

export const TEST_RESULTS_VERSION = 1;

export interface TestResult {
  testId: string;
  score: number; // percentage, e.g. 85
  correctCount: number;
  totalCount: number;
  passed: boolean;
  date: string; // ISO string format
}

export interface TestResultsState {
  results: Record<string, TestResult>; // testId -> Result record
}

interface TestResultsActions {
  saveResult: (result: Omit<TestResult, "date">) => void;
  resetResults: () => void;
}

export type TestResultsStore = TestResultsState & TestResultsActions;

const DEFAULT_TEST_RESULTS: TestResultsState = {
  results: {},
};

export const useTestResultsStore = create<TestResultsStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_TEST_RESULTS,

      saveResult: (res) => {
        const current = get().results;
        const date = new Date().toISOString();
        
        set({
          results: {
            ...current,
            [res.testId]: {
              ...res,
              date,
            },
          },
        });
      },

      resetResults: () => set({ ...DEFAULT_TEST_RESULTS }),
    }),
    {
      name: "si_test_results",
      version: TEST_RESULTS_VERSION,
      storage: createJSONStorage(() => zustandStorage),

      // Store only raw state fields
      partialize: (state): TestResultsState => ({
        results: state.results,
      }),

      migrate: (persisted, fromVersion) => {
        if (fromVersion === TEST_RESULTS_VERSION) return persisted as TestResultsState;
        return { ...DEFAULT_TEST_RESULTS };
      },

      // Envelope integrity guard to check if inputs are correctly formatted
      merge: (persisted, current) => {
        const incoming = (persisted ?? {}) as Partial<TestResultsState>;
        const results = incoming.results;

        return {
          ...current,
          results:
            results && typeof results === "object"
              ? (results as Record<string, TestResult>)
              : DEFAULT_TEST_RESULTS.results,
        };
      },
    }
  )
);
