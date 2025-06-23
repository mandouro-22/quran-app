import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GeneratePlan from "@/components/plan-generate";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <GeneratePlan />
    </div>
  );
}
