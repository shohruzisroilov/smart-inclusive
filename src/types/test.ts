export interface TestQuestion {
  id: string;
  type: "text" | "image";
  questionText: string;
  imageUrl?: string; // Optional image URL for image-type questions
  options: string[]; // Options array, e.g. ["Option A", "Option B", "Option C"]
  correctOptionIndex: number; // 0-based index of correct option
}

export interface TestModel {
  id: string;
  title: string;
  questions: TestQuestion[];
}
