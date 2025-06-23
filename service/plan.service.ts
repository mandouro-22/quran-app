import { Plan, PlanDay } from "@/types/type";

interface SurahAndAyahType {
  name: string;
  numberOfAyahs: number;
}

interface RevisionType {
  fromSurah: number;
  fromAyah: number;
  toSurah: number;
  toAyah: number;
  date: Date;
}

class SurahProgressTracker {
  private currentSurahIndex = 0;
  private currentAyahsInSurah = 1;
  private surahs: SurahAndAyahType[];
  constructor(surahs: SurahAndAyahType[]) {
    this.surahs = surahs;
  }

  getNextAyahRange(count: number) {
    let remaining = count;
    const fromAyah = this.currentAyahsInSurah;
    const fromSurah = this.currentSurahIndex;

    while (remaining > 0 && this.currentSurahIndex < this.surahs.length) {
      const ayahsLeft =
        this.surahs[this.currentSurahIndex].numberOfAyahs -
        this.currentAyahsInSurah +
        1;

      if (remaining <= ayahsLeft) {
        this.currentAyahsInSurah += remaining;
        remaining = 0;
      } else {
        remaining -= ayahsLeft;
        this.currentSurahIndex++;
        this.currentAyahsInSurah = 1;
      }
    }

    const toSurah =
      this.currentSurahIndex < this.surahs.length
        ? this.currentSurahIndex
        : this.surahs.length - 1;
    const toAyah =
      this.currentSurahIndex < this.surahs.length
        ? this.currentAyahsInSurah - 1
        : this.surahs[this.surahs.length - 1].numberOfAyahs;

    return {
      fromAyah,
      fromSurah,
      toAyah,
      toSurah,
    };
  }
}

class RevisionManager {
  private weekly: RevisionType[] = [];
  private monthly: RevisionType[] = [];
  private twoMonthly: RevisionType[] = [];

  addRevision(revision: RevisionType) {
    this.weekly.push(revision);
    this.monthly.push(revision);
    this.twoMonthly.push(revision);
  }

  getWeekly() {
    return this.weekly;
  }
  getMonthly() {
    return this.monthly;
  }
  getTwoMonthly() {
    return this.twoMonthly;
  }

  clearWeekly() {
    this.weekly = [];
  }
  clearMonthly() {
    this.monthly = [];
  }
  clearTwoMonthly() {
    this.twoMonthly = [];
  }
}

export class PlanGenerator {
  private readonly DayOfWeek = [
    "السبت",
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  private readonly totalAyah: number;
  private readonly totalDays: number;
  private readonly actualMemorizationDays: number;
  private readonly ayahPerDay: number;
  private readonly tracker: SurahProgressTracker;
  private readonly revisionManager = new RevisionManager();
  private totalAyahsMemorized = 0;
  private totalReviewDays = 0;
  private readonly planOfHifz: PlanDay[] = [];

  constructor(
    private month: number,
    private years: number,
    private surahs: SurahAndAyahType[],
    private startDate = new Date()
  ) {
    this.totalAyah = this.surahs.reduce((sum, s) => sum + s.numberOfAyahs, 0);
    const totalMonth = years * 12 + month;
    this.totalDays = Math.floor(totalMonth * 30.42); // تصحيح متوسط أيام الشهر

    const weeklyReviewDays = Math.floor(this.totalDays / 7); // يوم واحد كل أسبوع
    const monthlyReviewDays = Math.floor(this.totalDays / 30) * 2; // يومان كل شهر
    const twoMonthlyReviewDays = Math.floor(this.totalDays / 60) * 7; // 6 أيام مراجعة + يوم إجازة

    this.totalReviewDays =
      weeklyReviewDays + monthlyReviewDays + twoMonthlyReviewDays;
    this.actualMemorizationDays = this.totalDays - this.totalReviewDays;
    this.ayahPerDay = Math.ceil(this.totalAyah / this.actualMemorizationDays);
    this.tracker = new SurahProgressTracker(this.surahs);
  }

  generate(): Plan {
    let day = 0;
    while (day < this.totalDays && this.totalAyahsMemorized < this.totalAyah) {
      const currentDay = new Date(this.startDate);
      currentDay.setDate(currentDay.getDate() + day);
      const dayName = this.DayOfWeek[day % 7];

      // التحقق من أيام المراجعة والإجازة
      const reviewDaysUsed = this.generateReviewDays(day, currentDay);
      if (reviewDaysUsed > 0) {
        day += reviewDaysUsed;
        continue;
      }

      // إضافة يوم حفظ
      const range = this.tracker.getNextAyahRange(this.ayahPerDay);
      if (range) {
        const actualAyahsToday = Math.min(
          this.ayahPerDay,
          this.totalAyah - this.totalAyahsMemorized
        );
        this.totalAyahsMemorized += actualAyahsToday;

        const plan: PlanDay = {
          day: dayName,
          from_surah: this.surahs[range.fromSurah]?.name ?? "غير معرف",
          from_ayah: range.fromAyah,
          to_surah: this.surahs[range.toSurah]?.name ?? "غير معرف",
          to_ayah: range.toAyah,
          review_type: "حفظ",
          is_review: false,
          date: currentDay,
        };
        this.planOfHifz.push(plan);
        this.revisionManager.addRevision({ ...range, date: currentDay });
      }
      day++;
    }

    return {
      actualMemorizationDays: this.actualMemorizationDays,
      plan: this.planOfHifz,
      totalAyahPerDay: this.ayahPerDay,
      totalDays: this.totalDays,
      totalReviewDays: this.totalReviewDays,
    };
  }

  private generateReviewDays(day: number, currentDay: Date): number {
    const addSingleReview = (
      chunk: RevisionType[],
      reviewType: string,
      offset: number = 0
    ) => {
      if (chunk.length === 0) return;
      const first = chunk[0];
      const last = chunk[chunk.length - 1];
      this.planOfHifz.push({
        day: this.DayOfWeek[(day + offset) % 7] || "غير معرف",
        from_surah: this.surahs[first.fromSurah]?.name ?? "غير معرف",
        from_ayah: first.fromAyah,
        to_surah: this.surahs[last.toSurah]?.name ?? "غير معرف",
        to_ayah: last.toAyah,
        review_type: reviewType,
        date: new Date(currentDay.getTime() + offset * 86400000),
        is_review: true,
      });
    };

    // مراجعة كل شهرين (6 أيام مراجعة + يوم إجازة)
    if (
      day > 0 &&
      day % 60 === 59 &&
      this.revisionManager.getTwoMonthly().length > 0
    ) {
      const all = this.revisionManager.getTwoMonthly();
      const chunkSize = Math.ceil(all.length / 6);

      for (let i = 0; i < 6; i++) {
        const chunk = all.slice(i * chunkSize, (i + 1) * chunkSize);
        addSingleReview(chunk, `مراجعة الشهرين السابقين`, i);
      }

      this.revisionManager.clearTwoMonthly();
      return 7; // 6 أيام مراجعة + يوم إجازة
    }

    // مراجعة شهرية (يومان)
    if (
      day > 0 &&
      day % 30 === 29 &&
      this.revisionManager.getMonthly().length > 0
    ) {
      const all = this.revisionManager.getMonthly();
      const chunkSize = Math.ceil(all.length / 2);

      for (let i = 0; i < 2; i++) {
        const chunk = all.slice(i * chunkSize, (i + 1) * chunkSize);
        addSingleReview(chunk, `مراجعة الشهر السابق`, i);
      }

      this.revisionManager.clearMonthly();
      return 2; // يومان للمراجعة
    }

    // مراجعة أسبوعية (يوم واحد)
    if (
      day > 0 &&
      day % 7 === 6 &&
      this.revisionManager.getWeekly().length > 0
    ) {
      const all = this.revisionManager.getWeekly();
      addSingleReview(all, "مراجعة أسبوعية");

      this.revisionManager.clearWeekly();
      return 1; // يوم واحد للمراجعة
    }

    return 0; // لا مراجعة
  }
}
