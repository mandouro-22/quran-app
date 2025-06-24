export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
}

export function formatDay(day: number) {
  return new Intl.NumberFormat("ar-EG").format(day);
}

export function formatHijriDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    calendar: "islamic",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
