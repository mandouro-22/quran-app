"use client";

import { formatDay } from "@/lib/format/format-date";
import { PlanDay, PlanStatsType } from "@/types/type";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { supabase } from "@/lib/supabase/client";

interface DashboardProps {
  planStats: PlanStatsType & {
    id: string;
    user_id: string;
    created_at: string;
  };
}

export default function Dashboard({ planStats }: DashboardProps) {
  const [data, setData] = useState<PlanDay | null>(null);
  const [review, setReview] = useState<{ is_review: boolean }[] | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [numberOfDaysHifz, setNumberOfDaysHifz] = useState<
    DashboardProps[] | []
  >([]);

  const [reviewNumber, setReviewNumber] = useState<DashboardProps[] | []>([]);
  useEffect(() => {
    const fetchTodayTask = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("plan_item")
        .select("*")
        .eq("plan_id", planStats.id)
        .eq("user_id", planStats.user_id)
        .eq("date", today)
        .single();

      if (error) {
        console.error(error);
        return;
      }
      const { data: numberDayOfHifz, error: errorDaysOfHifz } = await supabase
        .from("plan_item")
        .select("*", { count: "exact" })
        .eq("plan_id", planStats.id)
        .eq("user_id", planStats.user_id)
        .eq("is_review", true);
      if (errorDaysOfHifz) {
        console.error(errorDaysOfHifz);
        return;
      }
      const {
        data: totalReviewAndDays,
        error: errReview,
        count,
      } = await supabase
        .from("plan_item")
        .select("is_review", { count: "exact" })
        .eq("plan_id", planStats.id)
        .eq("user_id", planStats.user_id);
      if (errReview) {
        console.error(errorDaysOfHifz);
        return;
      }

      setReview(totalReviewAndDays);
      setCount(count);
      const hifzLength = numberDayOfHifz.filter(
        (item) => item.review_type === "حفظ",
      );
      const reviewLength = numberDayOfHifz.filter(
        (item) =>
          item.review_type === "مراجعة أسبوعية" ||
          item.review_type === "مراجعة الشهر السابق" ||
          item.review_type === "مراجعة الشهرين السابقين",
      );
      setNumberOfDaysHifz(hifzLength);
      setReviewNumber(reviewLength);

      setData(data);
    };

    fetchTodayTask();
  }, [planStats]);

  const handleUpdate = async (itemId: string) => {
    const { data, error } = await supabase
      .from("plan_item")
      .update({ is_review: true })
      .eq("id", itemId)
      .eq("user_id", planStats.user_id)
      .eq("plan_id", planStats.id)
      .select("*")
      .single();

    if (error) {
      console.error("خطأ في التحديث:", error);
      toast.error(error.message, {
        className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
      });
      return;
    }
    setData(data);
    toast.success("تم التحديث بنجاح!", {
      className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
    });
  };

  const AllTaskReviewed = useCallback(() => {
    if (!review) return;
    const filter = review.filter((item) => item.is_review === true);
    return filter.length;
  }, [review]);

  const transition = {
    duration: 1,
  };
  const visible = {
    opacity: 1,
    x: 0,
  };
  const initial = "hidden";
  const animate = "visible";

  if (!data) return;

  return (
    <div className="my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: 200,
            },
            visible: visible,
          }}
          transition={transition}
          className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-t from-pink-700 via-purple-700 to-indigo-700"
        >
          <div className="absolute inset-0 backdrop-blur-[10px] blur-2xl bg-white/10 pointer-events-none z-10" />
          <div className="relative z-10 flex flex-col items-start text-white space-y-2.5">
            <h3 className="text-2xl font-semibold">الخطة الحالية</h3>
            <h1 className="text-4xl font-extrabold">
              ختــــــــــــم القـــــــــران
            </h1>
            <p className="mt-1 text-xl">
              فى {formatDay(planStats.totalDays)} يـــــــــــــوم
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: -200,
            },
            visible: visible,
          }}
          transition={transition}
          className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-t via-orange-500 from-orange-600 to-orange-600"
        >
          <div className="absolute inset-0 backdrop-blur-[20px] bg-white/5 pointer-events-none z-10" />
          <div className="relative z-10 flex flex-col items-start text-white space-y-2.5">
            {AllTaskReviewed() !== count ? (
              <>
                <h3 className="text-xl font-semibold">مهمة اليوم</h3>
                <h1 className="text-3xl font-extrabold">{data.review_type}</h1>
                {data.review_type !== "إجازة" ? (
                  <div className="flex items-center flex-wrap gap-2.5">
                    <div className="text-base text-gray-100">
                      من سورة{" "}
                      <span className="font-bold text-white">
                        {data.from_surah}
                      </span>{" "}
                      الاية رقم{" "}
                      <span className="font-bold text-white">
                        {formatDay(data.from_ayah)}
                      </span>
                    </div>
                    <span className="text-gray-100">-</span>
                    <div className="text-base text-gray-100">
                      إلى سورة{" "}
                      <span className="font-bold text-white">
                        {data.to_surah}
                      </span>{" "}
                      الاية رقم{" "}
                      <span className="font-bold text-white">
                        {formatDay(data.to_ayah)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="text-white font-bold text-xl text-center mt-6">
                <span className="text-3xl">🎯</span> كل المهام تمت بنجاح، بارك
                الله فيك!
              </div>
            )}
          </div>

          {AllTaskReviewed() !== count ? (
            data.is_review === false ? (
              <div
                className={`grid ${data.review_type === "إجازة" ? "grid-cols-1" : "grid-cols-2"} gap-2 relative z-10 mt-6`}
              >
                {data.review_type === "إجازة" ? (
                  <div
                    className="col-span-1 bg-white/20 text-white font-bold py-2 px-4 rounded-xl backdrop-blur-sm transition text-center opacity-50 cursor-not-allowed"
                    role="link"
                    aria-disabled="true"
                  >
                    إجازة
                  </div>
                ) : (
                  <Link
                    href={`/dashboard/home/surah/${data.id}`}
                    className="col-span-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl backdrop-blur-sm transition text-center"
                  >
                    {data.review_type === "حفظ"
                      ? "ابدأ الحفظ"
                      : data.review_type.includes("مراجعة")
                        ? "ابدأ المراجعة"
                        : null}
                  </Link>
                )}
                {data.review_type !== "إجازة" && (
                  <button
                    type="button"
                    className="col-span-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl backdrop-blur-sm transition text-center"
                    onClick={() => handleUpdate(data.id as string)}
                  >
                    أنهيت المهمة
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 relative z-10 mt-6">
                <p className="col-span-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl backdrop-blur-sm transition text-center">
                  لقد اتممت الحفظ بنجاح 🎉
                </p>
              </div>
            )
          ) : null}
        </motion.div>
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: 200,
            },
            visible: visible,
          }}
          transition={transition}
          className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-t from-violet-700 via-purple-600 to-violet-700"
        >
          <div className="absolute inset-1 backdrop-blur-[20px] rounded-2xl bg-white/5 pointer-events-none z-10" />
          <div className="relative z-10 flex flex-col items-start text-white space-y-2.5">
            <h3 className="text-xl font-semibold">عدد الايام التى تم حفظها</h3>
            <h1 className="text-3xl font-extrabold">
              {numberOfDaysHifz.length ?? 0}{" "}
              {numberOfDaysHifz.length === 1 ? "يوم" : "أيام"}
            </h1>
          </div>
        </motion.div>
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: -200,
            },
            visible: visible,
          }}
          transition={transition}
          className="relative rounded-2xl overflow-hidden p-8 bg-gradient-to-t from-violet-700 via-purple-600 to-violet-700"
        >
          <div className="absolute inset-1 backdrop-blur-[20px] rounded-2xl bg-white/5 pointer-events-none z-10" />
          <div className="relative z-10 flex flex-col items-start text-white space-y-2.5">
            <h3 className="text-xl font-semibold">
              عدد الايام التى تم مراجعتها
            </h3>
            <h1 className="text-3xl font-extrabold">
              {reviewNumber.length ?? 0}
            </h1>
          </div>
        </motion.div>
      </div>

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
        transition={transition}
        className="w-full flex items-center my-6"
      >
        <Link
          href={"/dashboard/dailylog"}
          className="w-full flex items-center justify-center bg-purple-400/20 hover:bg-purple-500/30 dark:bg-white/20 dark:hover:bg-white/30 dark:text-white font-bold py-3 px-4 rounded-xl backdrop-blur-sm transition"
        >
          تابع سجلك اليومى
        </Link>
      </motion.div>
    </div>
  );
}
