import { formatDate, formatDay } from "@/lib/format/format-date";
import { PlanDay } from "@/types/type";
import React from "react";

interface planType {
  plan: PlanDay;
}

export default function PlanCard({ plan }: planType) {
  const getActiviteType = (type: string) => {
    switch (type) {
      case "حفظ":
        return "from-green-500 to-green-400 dark:border-green-600 border-green-500";
      case "مراجعة أسبوعية":
        return "from-indigo-600 to-indigo-500 dark:border-indigo-600 border-indigo-500";
      case "مراجعة الشهر السابق":
        return "from-purple-600 to-purple-500 dark:border-purple-600 border-purple-500";
      case "مراجعة الشهرين السابقين":
        return "from-orange-500 to-orange-400 border-orange-500";
      case "إجازة":
        return "from-gray-500 to-gray-400 border-gray-500";
    }
  };

  return (
    <div className="space-y-2 border border-gray-200 dark:border-gray-800/40 shadow p-2 rounded-lg">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {formatDate(plan.date)}
      </div>
      <div
        className={`font-medium text-white border-2 bg-gradient-to-t text-sm ${getActiviteType(
          plan.review_type
        )} w-fit px-4 py-1 rounded-lg`}
      >
        {plan.review_type}
      </div>
      <div className="flex items-center flex-wrap gap-2 5">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          من سورة{" "}
          <span className="font-bold dark:text-white text-gray-900">
            {plan.from_surah}
          </span>{" "}
          الاية رقم{" "}
          <span className="font-bold dark:text-white text-gray-900">
            {formatDay(plan.from_ayah)}
          </span>
        </div>
        <span className="text-gray-700 dark:text-gray-300">-</span>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          إلى سورة{" "}
          <span className="font-bold dark:text-white text-gray-900">
            {plan.to_surah}
          </span>{" "}
          الاية رقم{" "}
          <span className="font-bold dark:text-white text-gray-900">
            {formatDay(plan.to_ayah)}
          </span>
        </div>
      </div>
    </div>
  );
}
