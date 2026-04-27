import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import {
  examCountdownKeys,
  getFallbackExamCountdowns,
  isExamCountdownKey,
  mapExamCountdownRow,
  mergeWithFallbacks,
  type ExamCountdown,
  type ExamCountdownKey,
  type ExamCountdownRow,
} from "@/lib/exam-countdowns";
import { createClient } from "@/lib/supabase/server";

type CountdownPayload = {
  countdowns?: Array<{
    examKey?: string;
    label?: string;
    examAt?: string;
  }>;
};

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAdminEmail(user.email)) {
    return null;
  }

  return supabase;
}

export async function GET() {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("exam_countdowns")
      .select("exam_key, label, exam_at, active, updated_at");

    if (error) {
      throw error;
    }

    const rows = ((data ?? []) as ExamCountdownRow[])
      .map(mapExamCountdownRow)
      .filter((item) => item !== null);

    return NextResponse.json({
      ok: true,
      countdowns: mergeWithFallbacks(rows),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Sınav tarihleri alınamadı.";

    return NextResponse.json(
      {
        ok: false,
        message,
        countdowns: getFallbackExamCountdowns(),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await ensureAdmin();

    if (!supabase) {
      return NextResponse.json(
        { ok: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as CountdownPayload;
    const payload = validatePayload(body);

    const { data, error } = await supabase
      .from("exam_countdowns")
      .upsert(payload, { onConflict: "exam_key" })
      .select("exam_key, label, exam_at, active, updated_at");

    if (error) {
      throw error;
    }

    revalidatePath("/");
    revalidatePath("/araclar");
    revalidatePath("/araclar/sinava-kac-gun-kaldi");

    const rows = ((data ?? []) as ExamCountdownRow[])
      .map(mapExamCountdownRow)
      .filter((item) => item !== null);

    return NextResponse.json({
      ok: true,
      countdowns: mergeWithFallbacks(rows),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Sınav tarihleri kaydedilemedi.";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

function validatePayload(body: CountdownPayload) {
  const countdowns = body.countdowns ?? [];
  const byKey = new Map<ExamCountdownKey, ExamCountdown>();

  countdowns.forEach((item) => {
    if (!item.examKey || !isExamCountdownKey(item.examKey)) {
      throw new Error("Geçersiz sınav anahtarı.");
    }

    const label = item.label?.trim() || item.examKey.toUpperCase();
    const examAt = item.examAt?.trim();

    if (!examAt || Number.isNaN(new Date(examAt).getTime())) {
      throw new Error(`${label} için geçerli bir sınav tarihi girin.`);
    }

    byKey.set(item.examKey, {
      examKey: item.examKey,
      label,
      examAt,
      active: true,
    });
  });

  for (const key of examCountdownKeys) {
    if (!byKey.has(key)) {
      const fallback = getFallbackExamCountdowns().find(
        (item) => item.examKey === key
      )!;
      byKey.set(key, fallback);
    }
  }

  return examCountdownKeys.map((key) => {
    const item = byKey.get(key)!;

    return {
      exam_key: item.examKey,
      label: item.label,
      exam_at: item.examAt,
      active: true,
      updated_at: new Date().toISOString(),
    };
  });
}
