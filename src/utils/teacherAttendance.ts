// utils/teacherAttendanceHistory.ts
// Types + helpers for the teacher attendance history endpoint.

export type AttendanceHistoryStatusFilter = "All" | "Present" | "Late";

export interface AttendanceHistoryFilters {
  dateFrom: string | null; // yyyy-mm-dd
  dateTo: string | null; // yyyy-mm-dd
  status: AttendanceHistoryStatusFilter;
  teacherId?: string | null;
}

export interface AttendanceRecord {
  attendanceId: string;
  teacherId: string;
  teacherName: string;
  date: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  status: string;
  totalHoursWorked: string | null; // .NET TimeSpan, e.g. "07:32:51.6970172"
  lateMinutes: string | null; // .NET TimeSpan, e.g. "01:51:02.5689436"
}

export interface AttendanceSummary {
  totalRecords: number;
  totalPresent: number;
  totalLate: number;
  totalHoursWorked: string; // TimeSpan with days, e.g. "2.12:43:28.4882660"
}

export interface AttendanceHistoryData {
  summary: AttendanceSummary;
  records: AttendanceRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  from: string;
  to: string;
}

export interface AttendanceHistoryResponse {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: AttendanceHistoryData;
}

/** "d.hh:mm:ss.fffffff" | "hh:mm:ss.fffffff" -> total seconds (null if invalid) */
export function parseTimeSpan(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = /^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?$/.exec(value);
  if (!m) return null;
  const [, d, h, min, s] = m;
  return Number(d ?? 0) * 86400 + Number(h) * 3600 + Number(min) * 60 + Number(s);
}

export function formatDuration(value: string | null | undefined): string {
  const total = parseTimeSpan(value);
  if (total === null) return "—";
  if (total < 60) return `${total}s`;
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  return [d ? `${d}d` : "", h ? `${h}h` : "", `${m}m`].filter(Boolean).join(" ");
}

// Backend sends 7 fractional digits and no timezone; Safari chokes on that,
// so trim to milliseconds and parse as local time.
function parseLocal(iso: string): Date {
  return new Date(iso.replace(/(\.\d{3})\d+/, "$1"));
}

export function formatClockTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseLocal(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatHistoryDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseLocal(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** The API occasionally returns the same clock-in twice (different attendanceId). */
export function dedupeRecords(records: AttendanceRecord[]): AttendanceRecord[] {
  const seen = new Set<string>();
  return records.filter((r) => {
    const key = `${r.teacherId}|${r.clockInTime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}