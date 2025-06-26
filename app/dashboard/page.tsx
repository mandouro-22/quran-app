import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const { data: plan, error: errPlan } = await supabase
    .from("plan")
    .select("id")
    .eq("user_id", data.user.id);
  if (errPlan) throw errPlan;
  if (plan) redirect("/dashboard/home");
  redirect("/dashboard/generate-plan");
}
