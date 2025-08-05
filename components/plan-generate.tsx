"use client";

import React, { useState } from "react";
import { usePlan } from "@/context/plan";
import { PlanGenerator } from "@/service/plan.service";
import PlanStats from "./plan-stats";
import PlanCard from "./plan-card";
import { LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import DeletePlanModel from "./delete-plan-model";
import FromGeneratePlan from "./form-generate-plan";
import { motion } from "motion/react";

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

interface GeneratePlanProps {
  userId: string;
}

export default function GeneratePlan({ userId }: GeneratePlanProps) {
  const [formData, setFormData] = useState<{ years: number; month: number }>({
    years: 0,
    month: 0,
  });
  const [planData, setPlanData] = useState<{
    actualMemorizationDays: number;
    totalAyahPerDay: number;
    totalDays: number;
    totalReviewDays: number;
    totalVacationDays: number;
  } | null>(null);

  const visible = {
    opacity: 1,
    y: 0,
  };
  const initial = "hidden";
  const animate = "visible";

  const [pending, setPending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [planId, setPlanId] = useState<string | null>(null);

  const totalSurahAndAyah = usePlan();
  const surahAndAyah = totalSurahAndAyah?.surahAndAyah;
  const router = useRouter();

  const [plan, setPlan] = useState<planOfHifz[] | null>(null);
  const generatePlanOfHifz = React.useCallback(
    async (month: number, years: number) => {
      const planFun = surahAndAyah
        ? await new PlanGenerator(month, years, surahAndAyah).generate()
        : null;
      if (!planFun) return;
      const {
        plan,
        actualMemorizationDays,
        totalAyahPerDay,
        totalDays,
        totalReviewDays,
        totalVacationDays,
      } = planFun;
      setPlan(plan);

      setPlanData({
        actualMemorizationDays,
        totalAyahPerDay,
        totalDays,
        totalReviewDays,
        totalVacationDays,
      });
    },
    [surahAndAyah]
  );

  const handleGeneratePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPending(true);
      await generatePlanOfHifz(formData.month, formData.years);
    } catch (err) {
      console.error(err);
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

  const handleCheckPlanExists = async () => {
    const supabase = createClient();
    const { data: plan, error: errPlan } = await supabase
      .from("plan")
      .select("id")
      .eq("user_id", userId);
    if (errPlan) {
      console.error(errPlan.message);
      toast.error(errPlan.message, {
        className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
      });
      return;
    }

    if (plan && plan.length > 0) {
      setPlanId(plan[0].id);
      setShowModel(true);
      return;
    }

    await handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (planData === null && plan === null) return;

      if (!plan || !planData) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("plan")
        .insert({ id: uuidv4(), ...planData, user_id: userId })
        .select("id")
        .single();

      if (error) {
        console.error("خطأ في إدراج الخطة:", error.message);
        toast.error(error.message, {
          className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
        });
        return;
      }

      if (data) {
        const items = plan.map((item) => ({
          id: uuidv4(),
          user_id: userId,
          plan_id: data.id,
          date: item.date,
          day: item.day,
          from_surah: item.from_surah,
          from_ayah: item.from_ayah,
          to_surah: item.to_surah,
          to_ayah: item.to_ayah,
          is_review: item.is_review,
          review_type: item.review_type,
        }));

        const batchSize = 50;
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize);
          const { error: planItemErr } = await supabase
            .from("plan_item")
            .insert(batch)
            .select("*");

          if (planItemErr) {
            console.error(`خطأ في دفعة رقم ${i / batchSize + 1}:`, planItemErr);
            console.error("الدفعة الفاشلة:", batch);
            toast.error(planItemErr.message, {
              className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
            });
            return;
          } else {
            console.log(`تم إدراج دفعة رقم ${i / batchSize + 1} بنجاح`);
          }
        }

        toast.success("تم حفظ الخطة بنجاح", {
          className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
        });
        router.push("/dashboard/home");
      }
    } catch (error) {
      console.error("خطأ عام:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showModel ? (
        <DeletePlanModel
          planId={planId!}
          setShowModel={setShowModel}
          handleGeneratePlan={handleSubmit}
        />
      ) : null}

      <div className="flex-1 w-full flex flex-col gap-12">
        <FromGeneratePlan
          handleGeneratePlan={handleGeneratePlan}
          formData={formData}
          handleInputChange={handleInputChange}
          loading={loading}
          pending={pending}
        />

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
                handleCheckPlanExists={handleCheckPlanExists}
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
              }  rounded-md px-4 py-6`}>
              {plan ? (
                <div>
                  {plan && plan.length > 0 ? (
                    <motion.div
                      initial={initial}
                      animate={animate}
                      variants={{
                        hidden: {
                          opacity: 0,
                        },
                        visible: visible,
                      }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut",
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 my-3">
                      {plan.map((item, index) => (
                        <PlanCard plan={item} key={index} />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-lg font-medium text-center">
                      لا يوجد خطه للحفظ
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={initial}
                  animate={animate}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 50,
                    },
                    visible: visible,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className="text-lg font-medium text-center">
                  لا يوجد خطه للحفظ
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
