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
  if (errPlan) {
    console.error("Error fetching plan:", errPlan);
    // throw Error(errPlan.message);
  }

  console.log(plan);

  if (plan) redirect("/dashboard/home");
  return redirect("/dashboard/generate-plan");
}
