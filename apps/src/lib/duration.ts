type DurationStyle = "timestamp" | "human";

/**
 * Formats a duration in seconds (or milliseconds) into a clean string.
 * @param totalSeconds - Duration in seconds (e.g. 74.5 -> "1:14")
 * @param style - "timestamp" (12:45 / 1:05:30) or "human" (12m 45s / 1h 05m)
 */
export const formatDuration = (
  totalSeconds: number | null | undefined,
  style: DurationStyle = "timestamp",
): string => {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds <= 0) {
    return style === "timestamp" ? "0:00" : "0s";
  }

  const roundedSeconds = Math.round(totalSeconds);
  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const seconds = roundedSeconds % 60;

  if (style === "human") {
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || (hours === 0 && minutes === 0))
      parts.push(`${seconds}s`);
    return parts.join(" ");
  }

  // "timestamp" style (YouTube / Video Player format)
  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${minutes}:${pad(seconds)}`;
};
