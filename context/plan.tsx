"use client";
import axios from "axios";
import React from "react";

export interface PlanData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface PlanContextType {
  plan: PlanData[] | null;
}

const PlanContext = React.createContext<PlanContextType | undefined>(undefined);

const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [plan, setPlan] = React.useState<PlanData[] | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_SURAH;
        if (!url) {
          console.error("API URL is not defined in env");
          return;
        }

        const response = await axios.get(url);

        if (response.status !== 200) {
          console.error(response.data.message);
          return;
        }

        setPlan(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <PlanContext.Provider value={{ plan }}>{children}</PlanContext.Provider>
  );
};

const usePlan = () => React.useContext(PlanContext);

export { usePlan, PlanProvider };
