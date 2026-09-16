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
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parses a .NET TimeSpan string ("00:00:07.1615505" or "05:48:41.5125251")
 * into hours, minutes and seconds.
 */
function parseTimeSpan(timeSpan: string): { hours: number; minutes: number; seconds: number } {
  if (!timeSpan) return { hours: 0, minutes: 0, seconds: 0 };

  const parts = timeSpan.split(":");
  if (parts.length < 2) return { hours: 0, minutes: 0, seconds: 0 };

  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const secondsPart = parts[2] ? parts[2].split(".")[0] : "0";
  const seconds = parseInt(secondsPart, 10) || 0;

  return { hours, minutes, seconds };
}

/** TimeSpan -> total minutes (rounded). */
function timeSpanToTotalMinutes(timeSpan: string): number {
  const { hours, minutes, seconds } = parseTimeSpan(timeSpan);
  return hours * 60 + minutes + Math.round(seconds / 60);
}

/** TimeSpan -> { hours, minutes }. */
function timeSpanToHoursMinutes(timeSpan: string): { hours: number; minutes: number } {
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
    // The AllTodayAttendance endpoint does not return email/avatar.
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

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const teacherAttendanceService = {
  /**
   * Today's attendance for every teacher in a school.
   * GET /TeacherAttendance/AllTodayAttendance?schoolId={schoolId}
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
   * NOTE: backend endpoint not live yet — will throw if called.
   * Wire this up once `/TeacherAttendance/History` (or equivalent) ships.
   */
  getAttendanceHistory: async (
    filters: AttendanceHistoryFilters,
    page: number,
    pageSize = 20
  ): Promise<PaginatedAttendanceHistory> => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.status && filters.status !== "All") {
        params.set("status", filters.status);
      }
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      const res = await api.get<{
        status: boolean;
        data: { records: RawTeacherAttendanceRecord[]; totalRecords: number };
      }>(`/TeacherAttendance/History?${params.toString()}`);

      const payload = res.data;
      const rawRecords = payload?.data?.records ?? [];
      const totalRecords = payload?.data?.totalRecords ?? 0;

      return {
        records: rawRecords.map(normalizeRecord),
        pagination: { page, pageSize, totalRecords },
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