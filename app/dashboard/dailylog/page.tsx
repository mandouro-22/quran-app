"use client";

import { getActiviteType } from "@/components/plan-card";
import { formatDate, formatDay } from "@/lib/format/format-date";
import { createClient } from "@/lib/supabase/client";
import { PlanDay } from "@/types/type";
import { Check, LoaderCircle } from "lucide-react";
import React from "react";

interface DailyLog {
  id: string;
  user_id: string;
  created_at: string;
}

export default function DailyLog() {
  const [totalDays, setTotalDays] = React.useState<number>(0);
  const [plan, setPlan] = React.useState<PlanDay[] | null>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const handleGetAllPlan = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        const user = await supabase.auth.getUser();
        if (user.error) {
          throw new Error(user.error.message);
        }

        const { data: planId, error: errPlan } = await supabase
          .from("plan")
          .select("id")
          .eq("user_id", user.data.user.id)
          .single();

        if (errPlan) {
          throw new Error(errPlan.message);
        }

        const { data, error } = await supabase
          .from("plan_item")
          .select("*", { count: "exact" })
          .eq("user_id", user.data.user.id)
          .eq("plan_id", planId.id)
          .order("date", { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setTotalDays(data.length);

        setPlan(data);

        console.log(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    handleGetAllPlan();
  }, []);

  if (loading) {
    <div className="flex items-center justify-center">
      <LoaderCircle
        size={30}
        className="animate-spin transition-all duration-1000"
      />
    </div>;
  }

  return (
    <section className="sm:py-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
            السجل
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
            لخطة التحفيظ القـــــــــران الكريم خلال{" "}
            <span className="underline decoration-purple-400 decoration-slice decoration-4 text-gray-900 dark:text-white">
              {totalDays}
            </span>{" "}
            يوم
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
          {plan && plan.length > 0 ? (
            plan.map((item) => (
              <div
                key={item.id}
                className="space-y-2 border border-gray-200 dark:border-gray-800/40 shadow p-2 rounded-lg relative"
              >
                {item.is_review ? (
                  <div className="absolute left-2 top-2 bg-gradient-to-t to-green-400 from-green-700 w-6 h-6 rounded-full flex items-center justify-center mr-auto">
                    <Check size={18} className="text-white" />
                  </div>
                ) : null}
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {formatDate(new Date(item.date))}
                </div>
                <div
                  className={`font-medium text-white border-2 bg-gradient-to-t text-sm ${getActiviteType(
                    item.review_type
                  )} w-fit px-4 py-1 rounded-lg`}
                >
                  {item.review_type}
                </div>
                {item.review_type !== "إجازة" ? (
                  <div className="flex items-center flex-wrap gap-2.5">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      من سورة{" "}
                      <span className="font-bold dark:text-white text-gray-900">
                        {item.from_surah}
                      </span>{" "}
                      الاية رقم{" "}
                      <span className="font-bold dark:text-white text-gray-900">
                        {formatDay(item.from_ayah)}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">-</span>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      إلى سورة{" "}
                      <span className="font-bold dark:text-white text-gray-900">
                        {item.to_surah}
                      </span>{" "}
                      الاية رقم{" "}
                      <span className="font-bold dark:text-white text-gray-900">
                        {formatDay(item.to_ayah)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="">لم تقم بتسجيل الخطه من الاساس</div>
          )}
        </div>
      </div>
    </section>
  );
}
