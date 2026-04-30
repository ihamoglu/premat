import "server-only";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_ADMIN_EMAIL = "ihamoglu@gmail.com";

function getConfiguredAdminEmail() {
  return (process.env.ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL).trim().toLowerCase();
}

export function isAdminUser(user?: User | null) {
  if (!user) {
    return false;
  }

  const email = user.email?.trim().toLowerCase() ?? "";
  const role = String(user.app_metadata?.role ?? "").trim().toLowerCase();

  return role === "admin" || email === getConfiguredAdminEmail();
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !isAdminUser(user)) {
    return null;
  }

  return { supabase, user: user! };
}
