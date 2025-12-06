"use client";

import React from "react";
import { getActiviteType } from "@/components/plan-card";
import { formatDate, formatDay } from "@/lib/format/format-date";
import { PlanDay } from "@/types/type";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import Pagination from "@/components/pagination";
import { supabase } from "@/lib/supabase/client";

interface DailyLog {
  id: string;
  user_id: string;
  created_at: string;
}

export default function DailyLog() {
  const [plan, setPlan] = React.useState<PlanDay[] | null>();
  const [count, setCount] = React.useState<number | null>(null);
  const [pagination, setpagintaion] = React.useState<{
    totalPage: number;
    currentPage: number;
    pageSize: number;
  }>({
    totalPage: 0,
    currentPage: 1,
    pageSize: 20,
  });

  const visible = {
    opacity: 1,
    y: 0,
  };
  const initial = "hidden";
  const animate = "visible";

  const offset = (pagination.currentPage - 1) * pagination.pageSize;
  React.useEffect(() => {
    const handleGetAllPlan = async () => {
      try {
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

        const { data, error, count } = await supabase
          .from("plan_item")
          .select("*", { count: "exact" })
          .eq("user_id", user.data.user.id)
          .eq("plan_id", planId.id)
          .order("date", { ascending: true })
          .limit(pagination.pageSize)
          .range(offset, offset + pagination.pageSize - 1);

        if (error) {
          throw new Error(error.message);
        }

        const calc = Math.ceil((count ?? 0) / pagination.pageSize);
        setpagintaion((prev) => ({ ...prev, totalPage: calc }));
        setCount(count);
        setPlan(data);
      } catch (error) {
        console.error(error);
      }
    };

    handleGetAllPlan();
  }, [offset, pagination.pageSize]);
  return (
    <section className="sm:py-8">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              y: -100,
            },
            visible: visible,
          }}
          transition={{
            duration: 1,
          }}
          className="space-y-6"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
            السجل
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-gray-200">
            لخطة التحفيظ القـــــــــران الكريم خلال{" "}
            <span className="underline decoration-purple-400 decoration-slice decoration-4 text-gray-900 dark:text-white">
              {formatDay(count!)}
            </span>{" "}
            يوم
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
          {plan && plan.length > 0 ? (
            plan.map((item) => (
              <motion.div
                initial={initial}
                animate={animate}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -50,
                  },
                  visible: visible,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
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
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={initial}
              animate={animate}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 100,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              transition={{
                duration: 1,
              }}
            >
              لم تقم بتسجيل الخطه من الاساس
            </motion.div>
          )}
        </div>
      </div>
      {/* TODO: Make pagination component */}
      {plan ? (
        <Pagination pagination={pagination} setpagintaion={setpagintaion} />
      ) : null}
    </section>
  );
}
