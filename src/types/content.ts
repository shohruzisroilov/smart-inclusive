export type ContentType =
  | "etiquette"
  | "i-can"
  | "lessons"
  | "books"
  | "tests"
  | "parents-tests"
  | "videos";

export type ContentLanguage = "uz" | "ru" | "en";

export interface BaseContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  date: string; // ISO string format (e.g. "2026-07-21")
  contentLanguage: ContentLanguage;
  hasTest: boolean;
  coverUrl?: string; // Optional image URL or CSS gradient background class
  
  // Specific optional metadata for different content types
  pageCount?: number; // Specific for books
  duration?: string;  // Specific for lessons and videos (e.g. "12:30")
  difficulty?: "easy" | "medium" | "hard"; // Specific for tests
}

// Type guard helper functions
export function isBook(item: BaseContentItem): boolean {
  return item.type === "books";
}

export function isVideoOrLesson(item: BaseContentItem): boolean {
  return item.type === "videos" || item.type === "lessons";
}

export function isTest(item: BaseContentItem): boolean {
  return item.type === "tests" || item.type === "parents-tests";
}
