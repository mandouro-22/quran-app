import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";

interface FromGeneratePlanType {
  handleGeneratePlan: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: {
    years: number;
    month: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  pending: boolean;
}

export default function FromGeneratePlan({
  handleGeneratePlan,
  formData,
  handleInputChange,
  loading,
  pending,
}: FromGeneratePlanType) {
  return (
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
          className="font-medium text-base flex items-center justify-center">
          {pending ? (
            <Loader className="animate-spin transition-all duration-150" />
          ) : (
            "انشاء الخطه"
          )}
        </Button>
      </div>
    </form>
  );
}
