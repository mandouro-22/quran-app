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

interface PlanDay {
  day: string;
  from_surah: string;
  from_ayah: number;
  to_surah: string;
  to_ayah: number;
  review_type: string;
  date: Date;
  is_review: boolean;
}

// interface AyahRange {
//   fromSurah: number;
//   fromAyah: number;
//   toSurah: number;
//   toAyah: number;
// }

class SurahProgressTracker {
  private currentSurrahIndex = 0;
  private currentAyahsInSurah = 1;
  private surahs: SurahAndAyahType[];
  constructor(surahs: SurahAndAyahType[]) {
    this.surahs = surahs;
  }

  getNextAyahRenge(count: number) {
    let ramining = count;
    const fromAyah = this.currentAyahsInSurah;
    const fromSurah = this.currentSurrahIndex;

    while (ramining > 0 && this.currentSurrahIndex < this.surahs.length) {
      const ayahsLeft =
        this.surahs[this.currentSurrahIndex].numberOfAyahs -
        this.currentAyahsInSurah;

      if (ramining <= ayahsLeft) {
        this.currentAyahsInSurah += ramining;
        ramining = 0;
      } else {
        ramining -= ayahsLeft;
        this.currentSurrahIndex++;
        this.currentAyahsInSurah = 1;
      }

      const toSurah =
        this.currentSurrahIndex < this.surahs.length
          ? this.currentSurrahIndex
          : this.surahs.length - 1;
      const toAyah =
        this.currentSurrahIndex < this.surahs.length
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
    return (this.weekly = []);
  }
  clearMonthly() {
    return (this.monthly = []);
  }
  clearTwoMonthly() {
    return (this.twoMonthly = []);
  }
}

export class PlanGenerator {
  private readonly DayOfWeek = [
    ,
    "السبت",
    "الاحد",
    "الاتنين",
    "الثلاثاء",
    "الاربعاء",
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
  private readonly planOfHifz: PlanDay[] = [];
  constructor(
    private month: number,
    private years: number,
    private surahs: SurahAndAyahType[],
    private startDate = new Date()
  ) {
    this.totalAyah = this.surahs.reduce((sum, s) => sum + s.numberOfAyahs, 0);
    const totalMonth = years * 12 + month;
    this.totalDays = Math.floor(totalMonth * 30.44);

    const weeklyReviewDays = Math.floor(this.totalDays / 7);
    const monthlyReviewDays = Math.floor(this.totalDays / 30) * 2;
    const twoMonthlyReviewDays = Math.floor(this.totalDays / 60) * 6;

    const totalReviewDays =
      weeklyReviewDays + monthlyReviewDays + twoMonthlyReviewDays;
    this.actualMemorizationDays = this.totalDays - totalReviewDays;
    this.ayahPerDay = Math.ceil(this.totalAyah / this.actualMemorizationDays);
    this.tracker = new SurahProgressTracker(this.surahs);
  }

  // generate Plan
  generate(): PlanDay[] {
    for (
      let day = 0;
      day < this.totalDays && this.totalAyahsMemorized < this.totalAyah;
      day++
    ) {
      const currentDay = new Date(this.startDate);
      currentDay.setDate(currentDay.getDate() + day);
      const dayName = this.DayOfWeek[day % 7];

      const isReviewDay = this.generateReviewDays(day, currentDay);

      if (!isReviewDay) {
        const range = this.tracker.getNextAyahRenge(this.ayahPerDay);

        if (range) {
          const actualAyahsToday = Math.min(
            this.ayahPerDay,
            this.totalAyah - this.totalAyahsMemorized
          );
          this.totalAyahsMemorized += actualAyahsToday;

          const plan: PlanDay = {
            day: dayName as string,
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
      }
    }

    return this.planOfHifz;
  }

  private generateReviewDays(day: number, currentDay: Date) {
    const addSingleReview = (
      chunk: RevisionType[],
      reviewType: string,
      offset: number = 0
    ) => {
      if (chunk.length === 0) return;
      const first = chunk[0];
      const last = chunk[chunk.length - 1];
      this.planOfHifz.push({
        day: this.DayOfWeek[(day + offset) % 7] || "غير معروف",
        from_surah: this.surahs[first.fromSurah]?.name ?? "غير معروف",
        from_ayah: first.fromAyah,
        to_surah: this.surahs[last.toSurah]?.name ?? "غير معروف",
        to_ayah: last.toAyah,
        review_type: reviewType,
        date: new Date(currentDay.getTime() + offset * 86400000),
        is_review: true,
      });
    };

    if (
      day > 0 &&
      day % 60 === 59 &&
      this.revisionManager.getTwoMonthly().length > 0
    ) {
      const all = this.revisionManager.getTwoMonthly();
      const chunkSize = Math.ceil(all.length / 6);

      for (let i = 0; i < 6; i++) {
        const chunk = all.slice(i * chunkSize, (i + 1) * chunkSize);
        addSingleReview(chunk, `مراجعة الشهرين السابقين - الجزء ${i + 1}`, i);
      }

      this.planOfHifz.push({
        day: this.DayOfWeek[(day + 6) % 7] || "غير معرف",
        from_surah: "",
        from_ayah: 0,
        to_surah: "",
        to_ayah: 0,
        review_type: "إجازة",
        date: new Date(currentDay.getTime() + 6 * 86400000),
        is_review: true,
      });

      this.revisionManager.clearTwoMonthly();
      return true;
    }

    if (
      day > 0 &&
      day % 30 === 29 &&
      this.revisionManager.getTwoMonthly().length > 0
    ) {
      const all = this.revisionManager.getMonthly();
      const chunkSize = Math.ceil(all.length / 2);

      for (let i = 0; i < 2; i++) {
        const chunk = all.slice(i * chunkSize, i + 1 * chunkSize);
        addSingleReview(chunk, `مراجعة الشهر السابق - الجزء ${i + 1}`, i);
      }

      this.revisionManager.clearMonthly();
      return true;
    }

    if (
      day > 0 &&
      day % 7 === 6 &&
      this.revisionManager.getTwoMonthly().length > 0
    ) {
      const all = this.revisionManager.getWeekly();
      addSingleReview(all, "مراجعة أسبوعية");
      this.revisionManager.clearWeekly();
      return true;
    }
  }
}
