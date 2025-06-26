"use client";
import React from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface DeletePlanModel {
  setShowModel: (value: boolean) => void;
  planId: string;
  handleGeneratePlan: () => Promise<void>;
}

export default function DeletePlanModel({
  setShowModel,
  planId,
  handleGeneratePlan,
}: DeletePlanModel) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const handleDeletePlan = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.from("plan").delete().eq("id", planId);
      if (error) {
        console.error(error.message);
        toast.error(error.message, {
          className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
        });
        return;
      }
      setShowModel(false);
      await handleGeneratePlan();
      toast.success("تم حذف الخطة الجديده بنجاح", {
        className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
      });
      router.push("/dashboard/home");
    } catch (error) {
      console.error("خطأ عام:", error);
    } finally {
      setLoading(true);
    }
  };

  return (
    <div
      className="fixed left-0 top-0 bottom-0 right-0 w-full h-full bg-black/10 backdrop-blur-sm p-4 flex items-center justify-center"
      onClick={() => setShowModel(false)}>
      <div
        className="dark:bg-white/10 bg-black/20 rounded-[10px] backdrop-blur-sm md:w-[50%] xl:w-[600px] py-5 px-6 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}>
        <div
          className="absolute right-4 top-3 cursor-pointer"
          onClick={() => setShowModel(false)}>
          <X className="active:text-red-600 hover:text-red-600 text-white" />
        </div>
        <div className="flex flex-col gap-2.5">
          <h1 className="text-lg font-bold text-white text-center">
            هل تريد حذف الخطة الحالية
          </h1>
          <p className="text-sm text-gray-100 leading-[150%] max-w-md text-center mx-auto">
            لديك خطة حالياً قيد العمل. عند تسجيل خطة جديدة سيتم إلغاء الخطة
            الحالية نهائياً. هل أنت متأكد من الاستمرار؟
          </p>
        </div>
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              className="text-sm border-red-500 border bg-red-500 hover:bg-red-600 active:bg-red-600"
              onClick={handleDeletePlan}
              disabled={loading}>
              {loading ? "جارى حذف الخطه السابقة ..." : "حذف الخطة"}
            </Button>
            <Button
              variant={"outline"}
              onClick={() => setShowModel(false)}
              disabled={loading}>
              الغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
