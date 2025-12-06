import React from "react";
import { Loader } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { motion } from "motion/react";

interface FromGeneratePlanType {
  handleGeneratePlan: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: {
    years: number;
    month: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  pending: boolean;
  totalPlan?: number;
}

export default function FromGeneratePlan({
  handleGeneratePlan,
  formData,
  handleInputChange,
  loading,
  pending,
  totalPlan,
}: FromGeneratePlanType) {
  const visible = {
    opacity: 1,
    x: 0,
  };
  const initial = "hidden";
  const animate = "visible";
  return (
    <form onSubmit={handleGeneratePlan} className="space-y-4">
      <div className="flex items-center gap-3">
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: 50,
            },
            visible: visible,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="w-full space-y-2"
        >
          <Label className="text-base font-medium mb-1.5">عدد السنين</Label>
          <Input
            type="number"
            name="years"
            placeholder="type of years"
            value={formData.years}
            onChange={handleInputChange}
            min={1}
          />
        </motion.div>
        <motion.div
          initial={initial}
          animate={animate}
          variants={{
            hidden: {
              opacity: 0,
              x: -50,
            },
            visible: visible,
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="w-full space-y-2"
        >
          <Label className="text-base font-medium mb-1.5">عدد الشهور</Label>
          <Input
            type="number"
            name="month"
            placeholder="type of month"
            value={formData.month}
            onChange={handleInputChange}
          />
        </motion.div>
      </div>
      <motion.div
        initial={initial}
        animate={animate}
        variants={{
          hidden: {
            opacity: 0,
            y: 50,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        className="flex items-center justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || pending || totalPlan! > 0}
          type="submit"
          className="font-medium text-base flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white shadow h-9 px-4 py-2 transition-all rounded-lg"
        >
          {pending ? (
            <Loader className="animate-spin transition-all duration-150" />
          ) : (
            "انشاء الخطه"
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}
