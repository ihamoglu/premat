import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-server";

export async function GET() {
  const admin = await requireAdmin();

  return NextResponse.json({
    ok: true,
    isAdmin: Boolean(admin),
    userEmail: admin?.user.email ?? null,
  });
}
