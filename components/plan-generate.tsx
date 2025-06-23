"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { usePlan } from "@/context/plan";
import { PlanGenerator } from "@/service/plan.service";
import PlanStats from "./plan-stats";
import PlanCard from "./plan-card";
import { Loader, LoaderCircle } from "lucide-react";
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

export default function GeneratePlan() {
  const [formData, setFormData] = useState<{ years: number; month: number }>({
    years: 0,
    month: 0,
  });
  const [planData, setPlanData] = useState<{
    actualMemorizationDays: number;
    totalAyahPerDay: number;
    totalDays: number;
    totalReviewDays: number;
  } | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const totalSurahAndAyah = usePlan();
  const surahAndAyah = totalSurahAndAyah?.surahAndAyah;

  const [plan, setPlan] = useState<planOfHifz[] | null>(null);

  const generatePlanOfHifz = React.useCallback(
    (month: number, years: number) => {
      try {
        const planFun = surahAndAyah
          ? new PlanGenerator(month, years, surahAndAyah).generate()
          : null;
        if (!planFun) return;
        const {
          plan,
          actualMemorizationDays,
          totalAyahPerDay,
          totalDays,
          totalReviewDays,
        } = planFun;
        setPlan(plan);
        setPlanData({
          actualMemorizationDays,
          totalAyahPerDay,
          totalDays,
          totalReviewDays,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [surahAndAyah]
  );

  const handleGeneratePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      generatePlanOfHifz(formData.month, formData.years);
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = () => {
    try {
      setLoading(true);

      if (planData === null && plan === null) return;
      const sendData = {
        ...planData,
        plan: plan,
      };
      console.log(sendData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(pending);

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <form onSubmit={handleGeneratePlan} className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-full space-y-2">
            <Label className="text-base font-medium mb-1.5">عدد السنين</Label>
            <Input
              type="number"
              name="years"
              placeholder="type of years"
              value={formData.years}
              onChange={handleInputChange}
              min={1}
            />
          </div>
          <div className="w-full space-y-2">
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
          <Button
            disabled={loading || pending}
            type="submit"
            className="font-medium text-base flex items-center justify-center"
          >
            {pending ? (
              <Loader className="animate-spin transition-all duration-150" />
            ) : (
              "انشاء الخطه"
            )}
          </Button>
        </div>
      </form>

      {pending ? (
        <div className="flex items-center justify-center">
          <LoaderCircle
            size={60}
            className="animate-spin transition-all duration-1000"
          />
        </div>
      ) : (
        <>
          {plan && planData && plan.length > 0 ? (
            <PlanStats
              handleSubmit={handleSubmit}
              loading={loading}
              plan={plan}
              planData={planData}
            />
          ) : null}

          <div
            className={`${
              plan && plan.length > 0
                ? "dark:border-purple-200/5 border-purple-200/30 border-2"
                : null
            }  rounded-md px-4 py-6`}
          >
            {plan ? (
              <div>
                {plan && plan.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
                    {plan.map((item, index) => (
                      <PlanCard plan={item} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-lg font-medium text-center">
                    لا يوجد خطه للحفظ
                  </div>
                )}
              </div>
            ) : (
              <div className="text-lg font-medium text-center">
                لا يوجد خطه للحفظ
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
