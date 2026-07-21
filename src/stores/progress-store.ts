"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS, zustandStorage } from "@/lib/storage";

export const PROGRESS_VERSION = 1;

export interface ProgressState {
  completedItems: Record<string, boolean>; // e.g. { "lesson-1": true, "book-2": true }
  bookmarks: Record<string, number>; // e.g. { "book-1": 2 }
}

interface ProgressActions {
  toggleComplete: (id: string, completed?: boolean) => void;
  saveBookmark: (itemId: string, pageIndex: number) => void;
  resetProgress: () => void;
}

export type ProgressStore = ProgressState & ProgressActions;

const DEFAULT_PROGRESS: ProgressState = {
  completedItems: {},
  bookmarks: {},
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PROGRESS,

      toggleComplete: (id, completed) => {
        const current = get().completedItems;
        const nextState = completed !== undefined ? completed : !current[id];
        
        set({
          completedItems: {
            ...current,
            [id]: nextState,
          },
        });
      },

      saveBookmark: (itemId, pageIndex) => {
        const current = get().bookmarks;
        set({
          bookmarks: {
            ...current,
            [itemId]: pageIndex,
          },
        });
      },

      resetProgress: () => set({ ...DEFAULT_PROGRESS }),
    }),
    {
      name: STORAGE_KEYS.progress,
      version: PROGRESS_VERSION,
      storage: createJSONStorage(() => zustandStorage),

      // Store only raw state fields
      partialize: (state): ProgressState => ({
        completedItems: state.completedItems,
        bookmarks: state.bookmarks,
      }),

      migrate: (persisted, fromVersion) => {
        if (fromVersion === PROGRESS_VERSION) return persisted as ProgressState;
        return { ...DEFAULT_PROGRESS };
      },

      // Envelope integrity guard to check if inputs are correctly formatted
      merge: (persisted, current) => {
        const incoming = (persisted ?? {}) as Partial<ProgressState>;
        const completed = incoming.completedItems;
        const bookmarks = incoming.bookmarks;

        return {
          ...current,
          completedItems:
            completed && typeof completed === "object"
              ? (completed as Record<string, boolean>)
              : DEFAULT_PROGRESS.completedItems,
          bookmarks:
            bookmarks && typeof bookmarks === "object"
              ? (bookmarks as Record<string, number>)
              : DEFAULT_PROGRESS.bookmarks,
        };
      },
    }
  )
);

/** Selectors for performance optimizations (avoids unnecessary re-renders) */
export const selectCompletedItems = (s: ProgressStore) => s.completedItems;
export const selectIsCompleted = (s: ProgressStore) => (id: string) => !!s.completedItems[id];
export const selectBookmarks = (s: ProgressStore) => s.bookmarks;
export const selectBookmark = (s: ProgressStore) => (id: string) => s.bookmarks[id] ?? 0;
