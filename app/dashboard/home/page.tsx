import Dashboard from "@/components/dashboard";
import HeaderDashboard from "@/components/header-dashboard";
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
        <HeaderDashboard fullName={profileData?.full_name} />

        <Dashboard planStats={data} />
      </div>
    </section>
  );
}
