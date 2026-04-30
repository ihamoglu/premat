import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PanelPageClient from "@/components/pages/PanelPageClient";
import { requireAdmin } from "@/lib/admin-server";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const admin = await requireAdmin();

  if (!admin) {
    redirect("/panel-giris");
  }

  return <PanelPageClient />;
}
