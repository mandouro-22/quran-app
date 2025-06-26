import Dashboard from "@/components/dashboard";
import { formatHijriDate } from "@/lib/format/format-date";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
// import { PlanStatsType } from "@/types/type";
import React from "react";

export default async function Home() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single();

  const { data, error } = await supabase
    .from("plan")
    .select("*")
    .eq("user_id", user?.user?.id)
    .single();

  if (error && !data) {
    console.error(error.message);
    return redirect("/dashboard/generate-plan");
  }

  return (
    <section className="sm:py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col items-start gap-2.5 space-y-3">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-700 dark:text-gray-200">
            {formatHijriDate(new Date())}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-2xl md:text-4xl font-extrabold">
            <span>أهلا بك يا</span>
            <h1 className="underline decoration-purple-400 decoration-slice decoration-4 text-gray-900 dark:text-white">
              {profileData?.full_name}
            </h1>
            <span>فى موقع قرآنى</span>
          </div>
        </div>

        <Dashboard planStats={data} />
      </div>
    </section>
  );
}
