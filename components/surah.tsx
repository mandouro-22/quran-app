"use client";

import { usePlan } from "@/context/plan";
import { createClient } from "@/lib/supabase/client";
import axios from "axios";
import { BookOpen, Loader, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { formatDay } from "@/lib/format/format-date";
import toast from "react-hot-toast";

type AyahType = {
  numberInSurah: number;
  text: string;
};

type SurahResult = {
  name: string;
  surahOfNumber: number;
  ayahs: AyahType[];
};

export default function SurahCom() {
  const surah = usePlan();
  const pathname = usePathname();
  const id = pathname.split("/").slice(-1).join("");
  const [surahAndAyah, setSurahAndAyah] = React.useState<SurahResult[] | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<{
    user_id: string;
    plan_id: string;
  } | null>(null);
  const router = useRouter();

  const getSurahFromNumber = React.useCallback(
    async (
      fromSurahNumber: number,
      toSurahNumber: number,
      from_ayah: number,
      to_ayah: number
    ): Promise<SurahResult[]> => {
      try {
        const result: SurahResult[] = [];
        const url = process.env.NEXT_PUBLIC_API_SURAH;

        for (
          let surahNum = fromSurahNumber;
          surahNum <= toSurahNumber;
          surahNum++
        ) {
          const res = await axios.get(`${url}/${surahNum}/ar.alafasy`);

          if (res.status !== 200) {
            throw new Error(
              `Failed to fetch surah data. Status: ${res.status}, Message: ${res.statusText}`
            );
          }

          let ayahs = res.data.data.ayahs;

          if (surahNum === fromSurahNumber) {
            ayahs = ayahs.slice(from_ayah - 1);
          }

          if (surahNum === toSurahNumber) {
            ayahs = ayahs.slice(0, to_ayah);
          }

          result.push({
            name: res.data.data.name,
            surahOfNumber: res.data.data.number,
            ayahs: ayahs,
          });
        }

        return result;
      } catch (err) {
        console.error(`Error fetching surah`, err);
        return [];
      }
    },
    []
  );

  React.useEffect(() => {
    const handleFetchData = async () => {
      const supabase = createClient();

      const user = await supabase.auth.getUser();
      if (user.error) {
        throw new Error(user.error.message);
      }

      const { data: planId, error: errPlan } = await supabase
        .from("plan")
        .select("id")
        .eq("user_id", user.data.user.id)
        .single();

      if (errPlan) {
        throw new Error(errPlan.message);
      }

      setUserInfo({ user_id: user.data.user.id, plan_id: planId.id });

      const { data, error } = await supabase
        .from("plan_item")
        .select("*")
        .eq("user_id", user.data.user.id)
        .eq("plan_id", planId.id)
        .eq("id", id)
        .single();
      if (error) {
        throw new Error(error.message);
      }

      if (!surah?.surahAndAyah) return;

      const fromSurahNumber = surah.surahAndAyah.find(
        (item) => item.name === data.from_surah
      );
      const toSurahNumber = surah.surahAndAyah.find(
        (item) => item.name === data.to_surah
      );

      if (fromSurahNumber && toSurahNumber) {
        const ayahsAndSurah = await getSurahFromNumber(
          fromSurahNumber.number,
          toSurahNumber.number,
          data.from_ayah,
          data.to_ayah
        );
        if (ayahsAndSurah) {
          setSurahAndAyah(ayahsAndSurah);
        }
      }
    };
    handleFetchData();
  }, [id, surah, getSurahFromNumber]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      if (!userInfo) return;
      const { error } = await supabase
        .from("plan_item")
        .update({ is_review: true })
        .eq("id", id)
        .eq("user_id", userInfo?.user_id)
        .eq("plan_id", userInfo?.plan_id)
        .select("*")
        .single();

      if (error) {
        console.error("خطأ في التحديث:", error);
        toast.error(error.message, {
          className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
        });
        return;
      }

      toast.success("تم الحفظ بنجاح!", {
        className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
      });
      router.push("/dashboard/home");
    } catch (error) {
      console.error(error);
      toast.error("فشل تسجيل الحفظ حاول مره اخرى فى وقت لاحق", {
        className: "dark:bg-[#333] dark:text-[#fff] rounded-[10px]",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 py-8 sm:px-6 md:px-8 max-w-5xl mx-auto font-amiri">
        <div className="mb-12">
          <h1 className="text-6xl font-extrabold">حفظ الورد اليومى</h1>
        </div>

        <div className="space-y-12">
          {surahAndAyah?.map((surah, i) => (
            <div key={i} className="group relative">
              <div className="absolute -inset-1 bg-purple-300/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 dark:bg-gradient-to-r dark:from-violet-400/20 dark:via-indigo-400/20 dark:to-violet-400/20" />

              <Card className="relative overflow-hidden border bg-white text-gray-800 border-purple-200 dark:border-violet-400/20 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-indigo-900/90 dark:to-purple-900/90 dark:text-violet-100 shadow-2xl backdrop-blur-xl">
                <div className="bg-purple-100 text-gray-800 p-8 relative backdrop-blur-sm dark:bg-gradient-to-r dark:from-violet-900/80 dark:via-purple-800/80 dark:to-indigo-900/80 dark:text-violet-100">
                  <div className="flex justify-between flex-wrap gap-2 items-center">
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-purple-300/30 rounded-full blur-lg dark:bg-violet-400/30" />
                        <div className="relative p-4 rounded-full shadow-lg bg-purple-500 dark:bg-gradient-to-br dark:from-violet-600 dark:to-indigo-600">
                          <BookOpen className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="text-right">
                        <h2 className="text-4xl font-bold font-arabic text-gray-800 drop-shadow dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-violet-100 dark:to-indigo-100">
                          سورة {surah.name}
                        </h2>
                        <p className="text-lg text-gray-700 font-arabic dark:text-violet-200/90">
                          السورة رقم {formatDay(surah.surahOfNumber)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-purple-300 text-gray-800 px-6 py-3 rounded-2xl border border-purple-400/30 dark:bg-gradient-to-br dark:from-violet-600/80 dark:to-indigo-600/80 dark:text-white dark:border-violet-400/30 backdrop-blur-sm">
                      <span className="font-medium">
                        {formatDay(surah.ayahs.length)} آية
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-0">
                  {surah.ayahs.map((ayah, j) => (
                    <div
                      key={`${surah.surahOfNumber}-${ayah.numberInSurah}`}
                      className="group/ayah relative hover:bg-purple-50 transition-all duration-500 dark:hover:bg-gradient-to-r dark:hover:from-indigo-950/30 dark:hover:via-violet-950/30 dark:hover:to-indigo-950/30"
                    >
                      {j > 0 && (
                        <div className="absolute top-0 left-8 right-8 h-px bg-purple-200 dark:bg-gradient-to-r dark:from-transparent dark:via-violet-400/30 dark:to-transparent" />
                      )}

                      <div className="flex items-start p-4 md:p-8 space-x-6 rtl:space-x-reverse">
                        <div className="flex-shrink-0 relative">
                          <div className="absolute -inset-1 bg-purple-300/30 rounded-full blur-md opacity-0 group-hover/ayah:opacity-100 transition-opacity duration-300 dark:bg-violet-400/30" />
                          <div className="w-14 h-14 flex items-center justify-center text-lg font-bold rounded-full border-2 border-purple-300 shadow-xl bg-purple-500 text-white group-hover/ayah:scale-110 transition-transform duration-300 dark:bg-gradient-to-br dark:from-violet-600 dark:via-indigo-500 dark:to-violet-600 dark:border-violet-300/50">
                            {ayah.numberInSurah}
                          </div>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-2xl leading-loose text-gray-800 font-arabic font-medium transition-colors duration-300 group-hover/ayah:text-purple-800 dark:text-violet-50 dark:group-hover/ayah:text-violet-100 drop-shadow">
                            {ayah.text}
                          </p>
                          <div className="flex justify-end mt-4 opacity-0 group-hover/ayah:opacity-100 transition-opacity duration-500">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="w-8 h-px bg-purple-400 dark:bg-gradient-to-r dark:from-transparent dark:to-violet-400" />
                              <Star className="w-3 h-3 text-purple-400 dark:text-violet-400" />
                              <div className="w-8 h-px bg-purple-400 dark:bg-gradient-to-l dark:from-transparent dark:to-violet-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            className="col-span-1 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl backdrop-blur-sm transition text-center"
            onClick={() => handleUpdate()}
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin transition-all duration-150" />
            ) : (
              "تأكيد إتمام الحفظ"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
