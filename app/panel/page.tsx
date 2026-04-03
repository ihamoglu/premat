import { redirect } from "next/navigation";
import PanelPageClient from "@/components/pages/PanelPageClient";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export default async function PanelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/panel-giris");
  }

  return <PanelPageClient />;
}