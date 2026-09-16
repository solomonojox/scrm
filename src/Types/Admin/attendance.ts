// src/Types/Admin/attendance.ts

export type AttendanceTab = "today" | "history";

export type AttendanceHistoryStatusFilter =
  | "All"
  | "Present"
  | "Late"
  | "Absent"
  | "Clocked Out";

export interface TeacherSummary {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  avatarUrl: string | null;
}

export interface TeacherAttendanceRecord {
  id: string;
  teacher: TeacherSummary;
  date: string | null;
  clockInTime: string | null;
  clockOutTime: string | null;
  status: string;
  lateMinutes: number;
  hoursWorked: {
    hours: number;
    minutes: number;
  };
}

export interface AttendanceSummary {
  totalTeachers: number;
  clockedInToday: number;
  lateToday: number;
  notClockedIn: number;
}

export interface AttendanceHistoryFilters {
  search: string;
  dateFrom: string | null;
  dateTo: string | null;
  status: AttendanceHistoryStatusFilter;
}

export interface PaginatedAttendanceHistory {
  records: TeacherAttendanceRecord[];
  pagination: {
    page: number;
    pageSize: number;
    totalRecords: number;
  };
}

// ---------------------------------------------------------------------------
// Raw API response types (exactly matching the backend contract)
// ---------------------------------------------------------------------------
export interface RawTeacherAttendanceRecord {
  attendanceId: string;
  teacherId: string;
  teacherName: string;
  clockInTime: string;   // "2026-09-15T13:48:41.5125251"
  clockOutTime: string;  // "2026-09-15T13:48:48.6740756"
  status: string;        // "Late" | "Present" | "Absent" | ...
  totalHoursWorked: string; // .NET TimeSpan e.g. "00:00:07.1615505"
  lateMinutes: string;      // .NET TimeSpan e.g. "05:48:41.5125251"
}

export interface RawAttendanceResponse {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: RawTeacherAttendanceRecord[];
}