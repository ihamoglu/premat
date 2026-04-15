import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PanelLoginPageClient from "@/components/pages/PanelLoginPageClient";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PanelLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && isAdminEmail(user.email)) {
    redirect("/panel");
  }

  return <PanelLoginPageClient />;
}