import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type {
  TestOption,
  TestQuestion,
  TestSetDetail,
  TestSetSummary,
} from "@/types/test";
import type { DocumentDifficulty, GradeLevel } from "@/types/document";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabasePublishableKey);

type QuestionSetRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  grade: string;
  topic: string;
  difficulty: string | null;
  duration_minutes: number | null;
  created_at: string;
};

type QuestionSetItemRow = {
  question_set_id: string;
  question_id: string;
  position: number;
};

type QuestionRow = {
  id: string;
  grade: string;
  topic: string;
  subtopic: string | null;
  curriculum_code: string | null;
  difficulty: string | null;
  question_text: string;
  question_image_url: string | null;
  solution_text: string | null;
  solution_video_url: string | null;
};

type OptionRow = {
  id: string;
  question_id: string;
  label: string;
  text: string;
  image_url: string | null;
  is_correct: boolean;
};

function mapSet(row: QuestionSetRow, questionCount = 0): TestSetSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description || undefined,
    grade: row.grade as GradeLevel,
    topic: row.topic,
    difficulty: (row.difficulty || undefined) as DocumentDifficulty | undefined,
    durationMinutes: row.duration_minutes || undefined,
    questionCount,
    createdAt: row.created_at.slice(0, 10),
  };
}

function mapOption(row: OptionRow): TestOption {
  return {
    id: row.id,
    label: row.label,
    text: row.text,
    imageUrl: row.image_url || undefined,
    isCorrect: row.is_correct,
  };
}

function mapQuestion(row: QuestionRow, options: TestOption[]): TestQuestion {
  return {
    id: row.id,
    grade: row.grade as GradeLevel,
    topic: row.topic,
    subtopic: row.subtopic || undefined,
    curriculumCode: row.curriculum_code || undefined,
    difficulty: (row.difficulty || undefined) as DocumentDifficulty | undefined,
    questionText: row.question_text,
    questionImageUrl: row.question_image_url || undefined,
    solutionText: row.solution_text || undefined,
    solutionVideoUrl: row.solution_video_url || undefined,
    options,
  };
}

const getPublishedTestSetsCached = unstable_cache(
  async () => {
    const { data: sets, error } = await supabase
      .from("question_sets")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !sets) {
      return [];
    }

    const setRows = sets as QuestionSetRow[];
    const { data: items } = await supabase
      .from("question_set_items")
      .select("question_set_id")
      .in(
        "question_set_id",
        setRows.map((set) => set.id)
      );

    const counts = new Map<string, number>();
    ((items ?? []) as Pick<QuestionSetItemRow, "question_set_id">[]).forEach(
      (item) => {
        counts.set(item.question_set_id, (counts.get(item.question_set_id) ?? 0) + 1);
      }
    );

    return setRows.map((row) => mapSet(row, counts.get(row.id) ?? 0));
  },
  ["tests-public-list"],
  { revalidate: 300, tags: ["tests-public"] }
);

export async function getPublishedTestSets() {
  return getPublishedTestSetsCached();
}

export async function getPublishedTestSetBySlug(slug: string) {
  const { data: set, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !set) {
    return null;
  }

  const setRow = set as QuestionSetRow;
  const { data: items, error: itemError } = await supabase
    .from("question_set_items")
    .select("*")
    .eq("question_set_id", setRow.id)
    .order("position", { ascending: true });

  if (itemError || !items) {
    return { ...mapSet(setRow), questions: [] } satisfies TestSetDetail;
  }

  const itemRows = items as QuestionSetItemRow[];
  const questionIds = itemRows.map((item) => item.question_id);

  if (questionIds.length === 0) {
    return { ...mapSet(setRow), questions: [] } satisfies TestSetDetail;
  }

  const [{ data: questions }, { data: options }] = await Promise.all([
    supabase.from("questions").select("*").in("id", questionIds).eq("published", true),
    supabase.from("question_options").select("*").in("question_id", questionIds),
  ]);

  const questionMap = new Map(
    ((questions ?? []) as QuestionRow[]).map((question) => [question.id, question])
  );
  const optionsByQuestion = new Map<string, TestOption[]>();

  ((options ?? []) as OptionRow[]).forEach((option) => {
    const current = optionsByQuestion.get(option.question_id) ?? [];
    current.push(mapOption(option));
    optionsByQuestion.set(option.question_id, current);
  });

  const mappedQuestions = itemRows
    .map((item) => questionMap.get(item.question_id))
    .filter((question): question is QuestionRow => Boolean(question))
    .map((question) =>
      mapQuestion(
        question,
        (optionsByQuestion.get(question.id) ?? []).sort((a, b) =>
          a.label.localeCompare(b.label, "tr")
        )
      )
    );

  return {
    ...mapSet(setRow, mappedQuestions.length),
    questions: mappedQuestions,
  } satisfies TestSetDetail;
}
