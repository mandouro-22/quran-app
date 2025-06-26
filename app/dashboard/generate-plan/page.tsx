import GeneratePlan from "@/components/plan-generate";
import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function page() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <GeneratePlan userId={data.user.id as string} />
    </div>
  );
}
