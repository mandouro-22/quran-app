"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { usePlan } from "@/context/plan";
import { PlanGenerator } from "@/service/plan.service";
// import { generatePlan } from "@/service/plan.service";
interface planOfHifz {
  day: string;
  from_surah: string;
  from_ayah: number;
  to_surah: string;
  to_ayah: number;
  review_type: string;
  date: Date;
  is_review: boolean;
}

export default function Test() {
  const [formData, setFormData] = useState<{ years: number; month: number }>({
    years: 0,
    month: 0,
  });

  const totalSurahAndAyah = usePlan();
  const surahAndAyah = totalSurahAndAyah?.surahAndAyah;

  const [plan, setPlan] = useState<planOfHifz[] | null>(null);

  const generatePlanOfHifz = React.useCallback(
    (month: number, years: number) => {
      const planFun = surahAndAyah
        ? new PlanGenerator(month, years, surahAndAyah).generate()
        : null;
      if (!planFun) return;
      setPlan(planFun);
    },
    [surahAndAyah]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    generatePlanOfHifz(formData.month, formData.years);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-full">
            <Label className="text-base font-medium mb-1.5">عدد السنين</Label>
            <Input
              type="number"
              name="years"
              placeholder="type of years"
              value={formData.years}
              onChange={handleInputChange}
            />
          </div>
          <div className="w-full">
            <Label className="text-base font-medium mb-1.5">عدد الشهور</Label>
            <Input
              type="number"
              name="month"
              placeholder="type of month"
              value={formData.month}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button type="submit" className="font-medium text-xl">
            انشاء الخطه
          </Button>
        </div>
      </form>

      <div className="border-green-400 border rounded-md px-4 py-6">
        <div className="text-lg text-center underline decoration-blue-400 decoration-slice decoration-2">
          تم انشاء خطه الحفظ
        </div>

        {plan ? (
          <div>
            {plan && plan.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
                {plan.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-2 border border-gray-500 p-2 rounded-lg">
                    <div className="text-lg font-medium">
                      {item.day} {item.date.toDateString()}
                    </div>
                    <div className="text-lg font-medium bg-blue-300 w-fit px-4 py-1 rounded-lg">
                      {item.review_type}
                    </div>
                    <div className="text-lg font-medium">
                      {item.from_surah} {item.from_ayah}
                    </div>
                    <div className="text-lg font-medium">
                      {item.to_surah} {item.to_ayah}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-lg font-medium">لا يوجد خطه حفظ</div>
            )}
          </div>
        ) : (
          <div className="text-lg font-medium">لا يوجد خطه حفظ</div>
        )}
      </div>
    </div>
  );
}
