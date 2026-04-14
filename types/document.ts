export type GradeLevel = "5" | "6" | "7" | "8";

export type DocumentType = string;

export type SourceType = "Google Drive" | "OneDrive" | "Dropbox" | "Diğer";

export type DocumentDifficulty = "Başlangıç" | "Orta" | "İleri" | "Karma";

export type DocumentItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade: GradeLevel;
  topic: string;
  subtopic?: string;
  type: DocumentType;
  sourceType: SourceType;
  fileUrl: string;
  solutionUrl?: string;
  answerKeyUrl?: string;
  coverImageUrl?: string;
  difficulty?: DocumentDifficulty;
  pageCount?: number;
  questionCount?: number;
  sourceYear?: number;
  curriculumCode?: string;
  isPrintReady: boolean;
  hasVideoSolution: boolean;
  featured: boolean;
  published: boolean;
  createdAt: string;
};
