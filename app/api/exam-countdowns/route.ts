import { NextResponse } from "next/server";
import {
  getFallbackExamCountdowns,
  mapExamCountdownRow,
  mergeWithFallbacks,
  type ExamCountdownRow,
} from "@/lib/exam-countdowns";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("exam_countdowns")
      .select("exam_key, label, exam_at, active, updated_at")
      .eq("active", true);

    if (error) {
      throw error;
    }

    const rows = ((data ?? []) as ExamCountdownRow[])
      .map(mapExamCountdownRow)
      .filter((item) => item !== null);

    return NextResponse.json({
      ok: true,
      source: "supabase",
      countdowns: mergeWithFallbacks(rows),
    });
  } catch {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      countdowns: getFallbackExamCountdowns(),
    });
  }
}
