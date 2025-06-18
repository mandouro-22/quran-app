"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function Test() {
  const [formData, setFormData] = useState<{ years: number; month: number }>({
    years: 0,
    month: 0,
  });

  const [plan, setPlan] = useState(null);

  const generatePlan = (manth: number, years: number) => {
    const totalAyats = 6236;
    const totalMonth = manth + years * 12;
    const totalDays = totalMonth * 30;
    const ayaPerDay = Math.ceil(totalAyats / totalDays);
    const totalDaysOfWeek = 7;
    const daysName = [
      "السبت",
      "الاحد",
      "الاثنين",
      "الثلاث",
      "الاربع",
      "الخميس",
      "الجمعه",
    ];

    let ayahCounter = 1;
    for (let i = 1; i < totalDays; i++) {
      const dayName = daysName[i % totalDaysOfWeek];
      const fromAyah = ayahCounter;
      const toAyah = Math.min(ayahCounter + ayaPerDay - 1, totalAyats);
      ayahCounter = toAyah + 1;
      console.log(ayahCounter);
      if (ayahCounter > totalAyats) break;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    generatePlan(formData.month, formData.years);
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

        {plan ? <div>Plan Generated</div> : null}
      </div>
    </div>
  );
}
