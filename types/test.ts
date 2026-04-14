import type { DocumentDifficulty, GradeLevel } from "@/types/document";

export type TestOption = {
  id: string;
  label: string;
  text: string;
  imageUrl?: string;
  isCorrect: boolean;
};

export type TestQuestion = {
  id: string;
  grade: GradeLevel;
  topic: string;
  subtopic?: string;
  curriculumCode?: string;
  difficulty?: DocumentDifficulty;
  questionText: string;
  questionImageUrl?: string;
  solutionText?: string;
  solutionVideoUrl?: string;
  options: TestOption[];
};

export type TestSetSummary = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  grade: GradeLevel;
  topic: string;
  difficulty?: DocumentDifficulty;
  durationMinutes?: number;
  questionCount: number;
  createdAt: string;
};

export type TestSetDetail = TestSetSummary & {
  questions: TestQuestion[];
};
