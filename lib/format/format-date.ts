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
