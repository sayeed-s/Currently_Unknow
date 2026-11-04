// src/lib/utils/date.ts

export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  // Output example: "Oct 24, 2026"
}

export function formatTimeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(secondsAgo / secondsInUnit);
    if (interval >= 1) {
      return rtf.format(-interval, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return "Just now";
}

export function GenrateExpiry() {
  const date = new Date();
  date.setHours(date.getHours() + 48);
  return date;
}
