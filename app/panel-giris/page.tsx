import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PanelLoginPageClient from "@/components/pages/PanelLoginPageClient";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin-server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PanelLoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminUser(user)) {
    redirect("/panel");
  }

  return <PanelLoginPageClient />;
}
