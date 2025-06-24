export interface PlanDay {
  id?: string;
  day: string;
  from_surah: string;
  from_ayah: number;
  to_surah: string;
  to_ayah: number;
  review_type: string;
  date: Date;
  is_review: boolean;
}

export interface PlanStatsType {
  totalAyahPerDay: number;
  totalDays: number;
  totalReviewDays: number;
  actualMemorizationDays: number;
  totalVacationDays: number;
}

export interface Plan {
  plan: PlanDay[];
  totalAyahPerDay: number;
  totalDays: number;
  totalReviewDays: number;
  actualMemorizationDays: number;
  totalVacationDays: number;
}
