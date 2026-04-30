import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-server";
import { normalizeOptionalPublicUrl } from "@/lib/url-security";
import type { DocumentDifficulty, GradeLevel } from "@/types/document";

const optionLabels = ["A", "B", "C", "D"] as const;
const GRADES = new Set<GradeLevel>(["5", "6", "7", "8"]);
const DIFFICULTIES = new Set<DocumentDifficulty>([
  "Başlangıç",
  "Orta",
  "İleri",
  "Karma",
]);
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SupabaseAdminClient = NonNullable<
  Awaited<ReturnType<typeof requireAdmin>>
>["supabase"];

type TestPayload = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  grade?: unknown;
  topic?: unknown;
  difficulty?: unknown;
  durationMinutes?: unknown;
  published?: unknown;
};

type QuestionPayload = {
  testId?: unknown;
  editingQuestionId?: unknown;
  questionText?: unknown;
  questionImageUrl?: unknown;
  solutionText?: unknown;
  options?: unknown;
  correct?: unknown;
  nextPosition?: unknown;
};

type QuestionSetRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  grade: GradeLevel;
  topic: string;
  difficulty: DocumentDifficulty | null;
  duration_minutes: number | null;
  published: boolean;
  created_at: string;
};

function normalizeString(value: unknown, fieldName: string, maxLength = 500) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} zorunludur.`);
  }

  return value.trim().slice(0, maxLength);
}

function normalizeOptionalString(value: unknown, maxLength = 500) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, maxLength)
    : null;
}

function normalizeUuid(value: unknown, fieldName: string) {
  if (typeof value !== "string" || !UUID_RE.test(value)) {
    throw new Error(`${fieldName} geçersiz.`);
  }

  return value;
}

function normalizeGrade(value: unknown) {
  if (typeof value === "string" && GRADES.has(value as GradeLevel)) {
    return value as GradeLevel;
  }

  throw new Error("Geçersiz sınıf seviyesi.");
}

function normalizeDifficulty(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "string" && DIFFICULTIES.has(value as DocumentDifficulty)) {
    return value as DocumentDifficulty;
  }

  throw new Error("Geçersiz zorluk değeri.");
}

function normalizeDuration(value: unknown) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 240) {
    throw new Error("Toplam süre 1 ile 240 dakika arasında olmalıdır.");
  }

  return parsed;
}

function slugifyTr(text: string) {
  return text
    .toLocaleLowerCase("tr")
    .trim()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeTestPayload(payload: TestPayload) {
  const title = normalizeString(payload.title, "Test başlığı", 220);

  return {
    title,
    description: normalizeOptionalString(payload.description, 500),
    grade: normalizeGrade(payload.grade),
    topic: normalizeString(payload.topic, "Konu", 300),
    difficulty: normalizeDifficulty(payload.difficulty),
    duration_minutes: normalizeDuration(payload.durationMinutes),
    published: Boolean(payload.published),
  };
}

function normalizeQuestionOptions(value: unknown, correct: unknown) {
  if (!Array.isArray(value) || value.length !== optionLabels.length) {
    throw new Error("Dört seçenek gönderilmelidir.");
  }

  if (typeof correct !== "string" || !optionLabels.includes(correct as never)) {
    throw new Error("Doğru seçenek geçersiz.");
  }

  return optionLabels.map((label, index) => ({
    label,
    text: normalizeString(value[index], `${label} seçeneği`, 1000),
    is_correct: label === correct,
  }));
}

async function publishAttachedQuestions(
  supabase: SupabaseAdminClient,
  testId: string
) {
  const { data: items, error: itemError } = await supabase
    .from("question_set_items")
    .select("question_id")
    .eq("question_set_id", testId);

  if (itemError) {
    throw itemError;
  }

  const questionIds = ((items ?? []) as Array<{ question_id: string }>).map(
    (item) => item.question_id
  );

  if (questionIds.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("questions")
    .update({ published: true })
    .in("id", questionIds);

  if (error) {
    throw error;
  }
}

async function getTestById(supabase: SupabaseAdminClient, testId: string) {
  const { data, error } = await supabase
    .from("question_sets")
    .select("*")
    .eq("id", testId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Test bulunamadı.");
  }

  return data as QuestionSetRow;
}

async function loadBuilderData(supabase: SupabaseAdminClient) {
  const [setsResult, questionsResult, optionsResult, itemsResult] =
    await Promise.all([
      supabase
        .from("question_sets")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("question_options").select("*"),
      supabase
        .from("question_set_items")
        .select("*")
        .order("position", { ascending: true }),
    ]);

  if (setsResult.error) throw setsResult.error;
  if (questionsResult.error) throw questionsResult.error;
  if (optionsResult.error) throw optionsResult.error;
  if (itemsResult.error) throw itemsResult.error;

  return {
    tests: setsResult.data ?? [],
    questions: questionsResult.data ?? [],
    options: optionsResult.data ?? [],
    items: itemsResult.data ?? [],
  };
}

async function saveTest(supabase: SupabaseAdminClient, payload: TestPayload) {
  const row = normalizeTestPayload(payload);

  if (payload.id) {
    const id = normalizeUuid(payload.id, "Test ID");
    const existing = await getTestById(supabase, id);

    const { error } = await supabase
      .from("question_sets")
      .update(row)
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (row.published) {
      await publishAttachedQuestions(supabase, id);
    }

    return { id, slug: existing.slug };
  }

  if (row.published) {
    throw new Error("Yeni testi önce taslak olarak oluştur.");
  }

  const { data, error } = await supabase
    .from("question_sets")
    .insert({
      id: crypto.randomUUID(),
      slug: `${slugifyTr(row.title) || "test"}-${Date.now()}`,
      ...row,
    })
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return data as { id: string; slug: string };
}

async function togglePublication(
  supabase: SupabaseAdminClient,
  testId: unknown,
  published: unknown
) {
  const id = normalizeUuid(testId, "Test ID");
  const nextPublished = Boolean(published);
  const existing = await getTestById(supabase, id);

  if (nextPublished) {
    await publishAttachedQuestions(supabase, id);
  }

  const { error } = await supabase
    .from("question_sets")
    .update({ published: nextPublished })
    .eq("id", id);

  if (error) {
    throw error;
  }

  return { id, slug: existing.slug };
}

async function saveQuestion(
  supabase: SupabaseAdminClient,
  payload: QuestionPayload
) {
  const testId = normalizeUuid(payload.testId, "Test ID");
  const test = await getTestById(supabase, testId);
  const questionId = payload.editingQuestionId
    ? normalizeUuid(payload.editingQuestionId, "Soru ID")
    : crypto.randomUUID();
  const options = normalizeQuestionOptions(payload.options, payload.correct);
  const questionPayload = {
    grade: test.grade,
    topic: test.topic,
    difficulty: test.difficulty,
    question_text: normalizeString(payload.questionText, "Soru metni", 3000),
    question_image_url: normalizeOptionalPublicUrl(
      payload.questionImageUrl,
      "Soru görseli"
    ),
    solution_text: normalizeOptionalString(payload.solutionText, 3000),
    published: test.published,
  };

  if (payload.editingQuestionId) {
    const { error } = await supabase
      .from("questions")
      .update(questionPayload)
      .eq("id", questionId);

    if (error) {
      throw error;
    }
  } else {
    const { error } = await supabase.from("questions").insert({
      id: questionId,
      ...questionPayload,
    });

    if (error) {
      throw error;
    }
  }

  const { data: currentOptions, error: currentOptionsError } = await supabase
    .from("question_options")
    .select("id, label")
    .eq("question_id", questionId);

  if (currentOptionsError) {
    throw currentOptionsError;
  }

  const currentByLabel = new Map(
    ((currentOptions ?? []) as Array<{ id: string; label: string }>).map(
      (option) => [option.label, option.id]
    )
  );
  const optionResults = await Promise.all(
    options.map((option) => {
      const optionPayload = {
        question_id: questionId,
        label: option.label,
        text: option.text,
        is_correct: option.is_correct,
      };
      const optionId = currentByLabel.get(option.label);

      if (optionId) {
        return supabase
          .from("question_options")
          .update(optionPayload)
          .eq("id", optionId);
      }

      return supabase.from("question_options").insert(optionPayload);
    })
  );
  const optionsError = optionResults.find((result) => result.error)?.error;

  if (optionsError) {
    throw optionsError;
  }

  if (!payload.editingQuestionId) {
    const position = Number.isInteger(Number(payload.nextPosition))
      ? Number(payload.nextPosition)
      : 0;
    const { error } = await supabase.from("question_set_items").insert({
      question_set_id: testId,
      question_id: questionId,
      position,
    });

    if (error) {
      throw error;
    }
  }

  return { id: questionId, slug: test.slug };
}

async function addExistingQuestion(
  supabase: SupabaseAdminClient,
  testIdValue: unknown,
  questionIdValue: unknown,
  positionValue: unknown
) {
  const testId = normalizeUuid(testIdValue, "Test ID");
  const questionId = normalizeUuid(questionIdValue, "Soru ID");
  const test = await getTestById(supabase, testId);
  const position = Number.isInteger(Number(positionValue)) ? Number(positionValue) : 0;

  const { error } = await supabase.from("question_set_items").insert({
    question_set_id: testId,
    question_id: questionId,
    position,
  });

  if (error) {
    throw error;
  }

  return { id: testId, slug: test.slug };
}

async function removeQuestion(
  supabase: SupabaseAdminClient,
  testIdValue: unknown,
  questionIdValue: unknown
) {
  const testId = normalizeUuid(testIdValue, "Test ID");
  const questionId = normalizeUuid(questionIdValue, "Soru ID");
  const test = await getTestById(supabase, testId);

  const { error } = await supabase
    .from("question_set_items")
    .delete()
    .eq("question_set_id", testId)
    .eq("question_id", questionId);

  if (error) {
    throw error;
  }

  return { id: testId, slug: test.slug };
}

async function moveQuestions(
  supabase: SupabaseAdminClient,
  testIdValue: unknown,
  orderedQuestionIds: unknown
) {
  const testId = normalizeUuid(testIdValue, "Test ID");
  const test = await getTestById(supabase, testId);

  if (!Array.isArray(orderedQuestionIds)) {
    throw new Error("Soru sırası geçersiz.");
  }

  const ids = orderedQuestionIds.map((id) => normalizeUuid(id, "Soru ID"));
  const results = await Promise.all(
    ids.map((questionId, index) =>
      supabase
        .from("question_set_items")
        .update({ position: index * 10 })
        .eq("question_set_id", testId)
        .eq("question_id", questionId)
    )
  );
  const error = results.find((result) => result.error)?.error;

  if (error) {
    throw error;
  }

  return { id: testId, slug: test.slug };
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      ...(await loadBuilderData(admin.supabase)),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Online test verileri alınamadı.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      action?: string;
      payload?: Record<string, unknown>;
    };
    const payload = body.payload ?? {};
    let result: { id?: string; slug?: string } = {};

    if (body.action === "save-test") {
      result = await saveTest(admin.supabase, payload);
    } else if (body.action === "toggle-publication") {
      result = await togglePublication(
        admin.supabase,
        payload.testId,
        payload.published
      );
    } else if (body.action === "save-question") {
      result = await saveQuestion(admin.supabase, payload);
    } else if (body.action === "add-existing-question") {
      result = await addExistingQuestion(
        admin.supabase,
        payload.testId,
        payload.questionId,
        payload.position
      );
    } else if (body.action === "remove-question") {
      result = await removeQuestion(
        admin.supabase,
        payload.testId,
        payload.questionId
      );
    } else if (body.action === "move-questions") {
      result = await moveQuestions(
        admin.supabase,
        payload.testId,
        payload.orderedQuestionIds
      );
    } else {
      return NextResponse.json(
        { ok: false, message: "Geçersiz test işlemi." },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Online test işlemi tamamlanamadı.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
