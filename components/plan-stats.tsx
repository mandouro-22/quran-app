import { formatDate, formatDay } from "@/lib/format/format-date";
import { PlanDay, PlanStatsType } from "@/types/type";
import React from "react";

interface PlanStats {
  plan: PlanDay[];
  planData: PlanStatsType | null;
  loading: boolean;
  handleSubmit: () => void;
}

export default function PlanStats({
  plan,
  planData,
  loading,
  handleSubmit,
}: PlanStats) {
  return (
    <div className="">
      <h1 className="text-7xl font-extrabold font-readex">خطة التحفيظ</h1>
      <div className="flex items-start flex-col gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 my-4">
          <div className="ml-4  inline-block py-2 px-4 md:py-4 md:px-8 text-white bg-gradient-to-t from-purple-800 to-purple-700/80 dark:from-purple-800/70 dark:to-purple-700 border-purple-500 border-2 rounded-2xl  flex-col justify-center text-center w-fit">
            <h1 className="text-lg font-semibold">ستنتهي من ختمة القرآن في</h1>
            <p>{plan && formatDate(plan[plan.length - 1].date)}</p>
          </div>
          <div className="ml-4 inline-block py-2 px-4 md:py-4 md:px-8 text-white bg-gradient-to-t to-indigo-700/80 from-indigo-800/90 dark:to-indigo-700/30 dark:from-indigo-800/70 border-indigo-500 dark:border-indigo-600/40 shadow border-2 rounded-2xl  flex-col justify-center text-center w-fit">
            <h1 className="text-lg font-semibold">عدد أيام الحفظ</h1>
            <p>
              {planData?.actualMemorizationDays
                ? formatDay(planData.actualMemorizationDays)
                : 0}{" "}
              يوم
            </p>
          </div>
          <div className="ml-4 inline-block py-2 px-4 md:py-4 md:px-8 text-white bg-gradient-to-t to-indigo-700/80 from-indigo-800/90 dark:to-indigo-700/30 dark:from-indigo-800/70 border-indigo-500 dark:border-indigo-600/40 shadow border-2 rounded-2xl  flex-col justify-center text-center w-fit">
            <h1 className="text-lg font-semibold">عدد أيام المراجعه</h1>
            <p>
              {planData?.totalReviewDays
                ? formatDay(planData.totalReviewDays)
                : null}{" "}
              يوم
            </p>
          </div>
        </div>
        <div className="">
          <div className="ml-4 inline-block py-2 px-4 md:py-4 md:px-8 text-white bg-gradient-to-t to-indigo-700/80 from-indigo-800/90 dark:to-indigo-700/30 dark:from-indigo-800/70 border-indigo-500 dark:border-indigo-600/40 shadow border-2 rounded-2xl  flex-col justify-center text-center w-fit">
            <h1 className="text-lg font-semibold">الورد اليومى للحفظ</h1>
            <p>
              {planData?.totalAyahPerDay
                ? formatDay(planData.totalAyahPerDay)
                : null}{" "}
              {planData && planData.totalAyahPerDay > 10 ? "آيــه" : "آيــات"}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="ml-4 mt-4 inline-block py-2 px-4 md:py-4 md:px-8 bg-gradient-to-t to-orange-400 from-orange-500  shadow border-2 border-orange-400 rounded-2xl  flex-col justify-center text-center w-fit text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          تسجيل خريطه الحفظ
        </button>
      </div>
    </div>
  );
}
