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

export function GenrateExpiry(hours: number = 720): Date {
  const expiryTime = new Date().getTime() + hours * 60 * 60 * 1000;
  return new Date(expiryTime);
}

export const formatVideoExpiry = (expiresAt: Date | string | null): string => {
  if (!expiresAt) {
    return "Lifetime Access";
  }

  const now = new Date().getTime();
  const expiryTime = new Date(expiresAt).getTime();
  const diffMs = expiryTime - now;

  // If already expired
  if (diffMs <= 0) {
    return "Rental Expired";
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // If greater than 72 hours, display in days
  if (diffHours > 72) {
    const diffDays = Math.floor(diffHours / 24);
    return `Expires in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  }

  // Display in hours for <= 72 hours (e.g., 48 hours, 12 hours)
  if (diffHours > 0) {
    return `Expires in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  }

  // Fallback to minutes if under 1 hour remaining
  const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
  return `Expires in ${diffMinutes} min${diffMinutes > 1 ? "s" : ""}`;
};
