// src/utils/duration.ts

/**
 * Formats an ISO datetime string into a readable clock time (e.g., "1:48 PM")
 */
export function formatClockTime(isoDateTime: string | null): string {
  if (!isoDateTime) return "—";

  try {
    const date = new Date(isoDateTime);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
}

/**
 * Formats a date string into a readable date (e.g., "Sep 15, 2026")
 */
export function formatHistoryDate(dateString: string | null): string {
  if (!dateString) return "—";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/**
 * Formats late minutes into a readable string (e.g., "5h 48m")
 */
export function formatLateMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return "—";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Formats hours worked into a readable string (e.g., "7h 30m")
 */
export function formatHoursWorked(hoursWorked: {
  hours: number;
  minutes: number;
}): string {
  const { hours, minutes } = hoursWorked;

  if (!hours && !minutes) return "0m";

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}