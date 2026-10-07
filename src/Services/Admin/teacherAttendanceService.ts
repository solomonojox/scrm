// src/Services/Admin/teacherAttendanceService.ts
//
// Data-access layer for Teacher Attendance.
// Talks to the real backend via the shared axios instance (`api`).

import api from "../api";
import {
  AttendanceHistoryFilters,
  AttendanceSummary,
  PaginatedAttendanceHistory,
  RawAttendanceResponse,
  RawTeacherAttendanceRecord,
  TeacherAttendanceRecord,
  TeacherSummary,
} from "../../Types/Admin/attendance";

// ---------------------------------------------------------------------------
// History endpoint types (kept local so the shared Types file stays untouched)
// ---------------------------------------------------------------------------

export interface AttendanceHistorySummary {
  totalRecords: number;
  totalPresent: number;
  totalLate: number;
  totalHoursWorked: string; // TimeSpan with days, e.g. "2.12:43:28.4882660"
}

interface RawAttendanceHistoryResponse {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: {
    summary: AttendanceHistorySummary;
    records: RawTeacherAttendanceRecord[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    from: string;
    to: string;
  };
}

export type AttendanceHistoryResult = PaginatedAttendanceHistory & {
  summary?: AttendanceHistorySummary;
};

// TODO: replace with however you get the school id (auth store, localStorage, etc.)
const getSchoolId = (): string => localStorage.getItem("schoolId") ?? "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parses a .NET TimeSpan string ("00:00:07.1615505", "05:48:41.5125251" or
 * with days: "2.12:43:28.4882660") into hours, minutes and seconds.
 * Days are folded into hours.
 */
function parseTimeSpan(
  timeSpan: string | null | undefined
): { hours: number; minutes: number; seconds: number } {
  if (!timeSpan) return { hours: 0, minutes: 0, seconds: 0 };

  let days = 0;
  let rest = timeSpan;
  const dayMatch = timeSpan.match(/^(\d+)\.(\d{1,2}:.*)$/);
  if (dayMatch) {
    days = parseInt(dayMatch[1], 10) || 0;
    rest = dayMatch[2];
  }

  const parts = rest.split(":");
  if (parts.length < 2) return { hours: 0, minutes: 0, seconds: 0 };

  const hours = (parseInt(parts[0], 10) || 0) + days * 24;
  const minutes = parseInt(parts[1], 10) || 0;
  const secondsPart = parts[2] ? parts[2].split(".")[0] : "0";
  const seconds = parseInt(secondsPart, 10) || 0;

  return { hours, minutes, seconds };
}

/** TimeSpan -> total minutes (rounded). */
function timeSpanToTotalMinutes(timeSpan: string | null | undefined): number {
  const { hours, minutes, seconds } = parseTimeSpan(timeSpan);
  return hours * 60 + minutes + Math.round(seconds / 60);
}

/** TimeSpan -> { hours, minutes }. */
function timeSpanToHoursMinutes(
  timeSpan: string | null | undefined
): { hours: number; minutes: number } {
  const { hours, minutes, seconds } = parseTimeSpan(timeSpan);
  const totalMinutes = minutes + Math.round(seconds / 60);
  return {
    hours: hours + Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}

/** "2026-09-15T13:48:41.5125251" -> "2026-09-15". */
function extractDate(isoDateTime: string): string | null {
  if (!isoDateTime) return null;
  const datePart = isoDateTime.split("T")[0];
  return datePart || null;
}

/**
 * Normalizes one raw attendance API record into the shape the UI uses.
 */
function normalizeRecord(raw: RawTeacherAttendanceRecord): TeacherAttendanceRecord {
  const teacher: TeacherSummary = {
    teacherId: raw.teacherId,
    teacherName: raw.teacherName,
    // The attendance endpoints do not return email/avatar.
    // Leave them blank so the UI renders cleanly; merge from a teacher
    // lookup later if you need them.
    teacherEmail: "",
    avatarUrl: null,
  };

  return {
    id: raw.attendanceId,
    teacher,
    date: extractDate(raw.clockInTime),
    clockInTime: raw.clockInTime || null,
    clockOutTime: raw.clockOutTime || null,
    status: raw.status,
    lateMinutes: timeSpanToTotalMinutes(raw.lateMinutes),
    hoursWorked: timeSpanToHoursMinutes(raw.totalHoursWorked),
  };
}

/**
 * The records endpoint sometimes returns the same clock-in twice under
 * different attendanceIds. Keep the first one.
 */
function dedupeRaw(records: RawTeacherAttendanceRecord[]): RawTeacherAttendanceRecord[] {
  const seen = new Set<string>();
  return records.filter((r) => {
    const key = `${r.teacherId}|${r.clockInTime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const teacherAttendanceService = {
  /**
   * Today's attendance for every teacher in a school.
   * GET /api/TeacherAttendance/AllTodayAttendance?schoolId={schoolId}
   */
  getTodayAttendance: async (schoolId: string): Promise<TeacherAttendanceRecord[]> => {
    try {
      const res = await api.get<RawAttendanceResponse>(
        `/api/TeacherAttendance/AllTodayAttendance?schoolId=${encodeURIComponent(schoolId)}`
      );
      const payload = res.data;
      if (!payload?.status || !Array.isArray(payload.data)) {
        return [];
      }
      return payload.data.map(normalizeRecord);
    } catch (error: any) {
      console.error(
        "getTodayAttendance error:",
        error?.response?.data?.message || error.message
      );
      throw error;
    }
  },

  /**
   * Summary cards derived from today's attendance.
   * There is no dedicated summary endpoint yet, so we compute it client-side.
   */
  getAttendanceSummary: async (schoolId: string): Promise<AttendanceSummary> => {
    try {
      const res = await api.get<RawAttendanceResponse>(
        `/api/TeacherAttendance/AllTodayAttendance?schoolId=${encodeURIComponent(schoolId)}`
      );
      const payload = res.data;
      const records = payload?.status && Array.isArray(payload.data) ? payload.data : [];

      const clockedInToday = records.filter(
        (r) => r.clockInTime && r.clockInTime.length > 0
      ).length;
      const lateToday = records.filter((r) => r.status === "Late").length;

      // Without a dedicated teachers endpoint we treat today's records as
      // the current roster. Swap this out when a teacher-count endpoint exists.
      const totalTeachers = records.length;
      const notClockedIn = Math.max(0, totalTeachers - clockedInToday);

      return { totalTeachers, clockedInToday, lateToday, notClockedIn };
    } catch (error: any) {
      console.error(
        "getAttendanceSummary error:",
        error?.response?.data?.message || error.message
      );
      throw error;
    }
  },

  /**
   * Filtered + paginated attendance history.
   * GET /api/TeacherAttendance/Records?schoolId&from&to&teacherId&status&page&pageSize
   *
   * - The API has no name/email search, so `filters.search` is applied
   *   client-side to the records of the requested page.
   * - `to` is sent as end-of-day so the selected date is included.
   */
  getAttendanceHistory: async (
    filters: AttendanceHistoryFilters,
    page: number,
    pageSize = 20,
    schoolId: string
  ): Promise<AttendanceHistoryResult> => {
    try {
      const params: Record<string, string | number> = { schoolId, page, pageSize };
      if (filters.dateFrom) params.from = `${filters.dateFrom}T00:00:00`;
      if (filters.dateTo) params.to = `${filters.dateTo}T23:59:59`;
      if (filters.status && filters.status !== "All") {
        params.status = filters.status;
      }

      const res = await api.get<RawAttendanceHistoryResponse>(
        "/api/TeacherAttendance/Records",
        { params }
      );

      const payload = res.data;
      if (!payload?.status || !payload.data) {
        throw new Error(payload?.responseMessage || "Failed to load attendance history");
      }

      let records = dedupeRaw(payload.data.records ?? []).map(normalizeRecord);

      const q = filters.search?.trim().toLowerCase();
      if (q) {
        records = records.filter((r) => r.teacher.teacherName.toLowerCase().includes(q));
      }

      return {
        records,
        pagination: {
          page: payload.data.page ?? page,
          pageSize: payload.data.pageSize ?? pageSize,
          totalRecords: payload.data.totalCount ?? 0,
        },
        summary: payload.data.summary,
      };
    } catch (error: any) {
      console.error(
        "getAttendanceHistory error:",
        error?.response?.data?.message || error.message
      );
      throw error;
    }
  },
};