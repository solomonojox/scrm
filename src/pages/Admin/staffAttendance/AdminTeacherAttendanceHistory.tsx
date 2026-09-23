// components/AdminTeacherAttendanceHistory.tsx
import { useEffect, useMemo, useState } from 'react';
import { AttendanceHistoryFilters, AttendanceHistoryStatusFilter } from '../../../Types/Admin/attendance';
import { formatClockTime, formatHistoryDate, formatLateMinutes, formatHoursWorked } from '../../../utils/duration';
import { Skeleton } from '../../../components/Admin/Skeleton';
import { exportAttendanceToExcel, exportAttendanceToPdf } from '../../../utils/exportAttendance';
import { FaChevronLeft, FaChevronRight, FaFileExcel, FaFilePdf, FaSearch, FaTimes } from 'react-icons/fa';
import {
  AttendanceHistoryResult,
  teacherAttendanceService,
} from '../../../Services/Admin/teacherAttendanceService';
import { useAuth } from '../../../Context/Auth/useAuth';

const STATUS_OPTIONS: AttendanceHistoryStatusFilter[] = [
  "All",
  "Present",
  "Late",
  "Absent",
  "Clocked Out",
];

const STATUS_BADGE: Record<string, string> = {
  Present: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  ClockedIn: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  ClockedOut: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  Late: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  NotClockedIn: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  Absent: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
};

const STATUS_LABEL: Record<string, string> = {
  Present: "Present",
  ClockedIn: "Clocked In",
  ClockedOut: "Clocked Out",
  Late: "Late",
  NotClockedIn: "Not Clocked In",
  Absent: "Absent",
};

function StatusBadge({ status }: { status: string }) {
  const classes =
    STATUS_BADGE[status] ?? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
  const label = STATUS_LABEL[status] ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

/** .NET TimeSpan ("2.12:43:28.4882660") -> "60h 43m". */
function formatTotalHours(timeSpan: string | undefined): string {
  if (!timeSpan) return "—";
  const m = /^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})/.exec(timeSpan);
  if (!m) return "—";
  const hours = Number(m[1] ?? 0) * 24 + Number(m[2]);
  return `${hours}h ${Number(m[3])}m`;
}

const SEARCH_DEBOUNCE_MS = 300;
const PAGE_SIZE = 20;

export function AdminTeacherAttendanceHistory() {
  // Search filters live as the admin types (debounced). Date range and
  // status stay a draft/applied pair — they only take effect once
  // "Apply Filters" is clicked.
  const { user } = useAuth()
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [draftDateFrom, setDraftDateFrom] = useState<string | null>(null);
  const [draftDateTo, setDraftDateTo] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<AttendanceHistoryStatusFilter>("All");

  const [appliedDateFrom, setAppliedDateFrom] = useState<string | null>(null);
  const [appliedDateTo, setAppliedDateTo] = useState<string | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<AttendanceHistoryStatusFilter>("All");

  const [page, setPage] = useState(1);

  const [result, setResult] = useState<AttendanceHistoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<"excel" | "pdf" | null>(null);

  const filters: AttendanceHistoryFilters = useMemo(
    () => ({
      search: appliedSearch,
      dateFrom: appliedDateFrom,
      dateTo: appliedDateTo,
      status: appliedStatus,
    }),
    [appliedSearch, appliedDateFrom, appliedDateTo, appliedStatus]
  );

  // Debounce the search box into appliedSearch and jump back to page 1
  // whenever it actually changes what's being queried.
  useEffect(() => {
    const handle = setTimeout(() => {
      setAppliedSearch(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  async function load(activeFilters: AttendanceHistoryFilters, pageToLoad: number) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await teacherAttendanceService.getAttendanceHistory(activeFilters, pageToLoad, PAGE_SIZE, user?.schoolId);
      setResult(res);
    } catch {
      setError("Unable to load teacher attendance.\nPlease try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load(filters, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  function handleApply() {
    setPage(1);
    setAppliedDateFrom(draftDateFrom);
    setAppliedDateTo(draftDateTo);
    setAppliedStatus(draftStatus);
  }

  function handleReset() {
    setSearchInput("");
    setAppliedSearch("");
    setDraftDateFrom(null);
    setDraftDateTo(null);
    setDraftStatus("All");
    setAppliedDateFrom(null);
    setAppliedDateTo(null);
    setAppliedStatus("All");
    setPage(1);
  }

  const records = result?.records ?? [];
  const summary = result?.summary;
  const total = result?.pagination.totalRecords ?? 0;
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Export pulls every record matching the current filters, not just the
  // current page, since that's what "export" usually means to an admin.
  async function handleExport(kind: "excel" | "pdf") {
    if (total === 0 || isExporting) return;
    setIsExporting(kind);
    try {
      const full = await teacherAttendanceService.getAttendanceHistory(filters, 1, total, user?.schoolId);
      if (kind === "excel") {
        exportAttendanceToExcel(full.records, {
          includeDate: true,
          filename: "teacher-attendance-history",
        });
      } else {
        exportAttendanceToPdf(full.records, {
          includeDate: true,
          title: "Teacher Attendance History",
        });
      }
    } catch {
      // Best-effort: if the export fetch fails, the existing error state
      // for the table (from `load`) already covers the "try again" path.
    } finally {
      setIsExporting(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900">Attendance History</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleExport("excel")}
            disabled={total === 0 || isExporting !== null}
            title="Export to Excel"
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaFileExcel className="h-4 w-4 text-green-600" />
            <span className="hidden sm:inline">
              {isExporting === "excel" ? "Exporting..." : "Excel"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={total === 0 || isExporting !== null}
            title="Export to PDF"
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaFilePdf className="h-4 w-4 text-red-500" />
            <span className="hidden sm:inline">
              {isExporting === "pdf" ? "Exporting..." : "PDF"}
            </span>
          </button>
        </div>
      </div>

      {/* Summary (from the history endpoint, covers the whole date range) */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 border-b border-gray-200 p-4 lg:grid-cols-4">
          {[
            { label: "Total Records", value: summary.totalRecords, tone: "text-gray-900" },
            { label: "Present", value: summary.totalPresent, tone: "text-green-700" },
            { label: "Late", value: summary.totalLate, tone: "text-amber-700" },
            { label: "Total Hours Worked", value: formatTotalHours(summary.totalHoursWorked), tone: "text-gray-900" },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className={`mt-1 text-lg font-semibold ${card.tone}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1 mt-5">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search teacher by name..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Date From</label>
          <input
            type="date"
            value={draftDateFrom ?? ""}
            onChange={(e) => setDraftDateFrom(e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Date To</label>
          <input
            type="date"
            value={draftDateTo ?? ""}
            onChange={(e) => setDraftDateTo(e.target.value || null)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as AttendanceHistoryStatusFilter)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={handleApply}
            className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 truncate"
          >
            Apply Filters
          </button>
          <button
            onClick={handleReset}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      {error ? (
        <ErrorState message={error} onRetry={() => load(filters, page)} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : records.length === 0 ? (
        <EmptyState message="No attendance records found" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Date",
                  "Teacher",
                  "Clock In",
                  "Clock Out",
                  "Status",
                  "Late By",
                  "Hours Worked",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatHistoryDate(r.date)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium capitalize text-gray-900">
                    {r.teacher.teacherName.toLowerCase()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatClockTime(r.clockInTime)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {r.clockOutTime ? (
                      formatClockTime(r.clockOutTime)
                    ) : (
                      <span className="text-xs italic text-gray-400">No clock-out</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatLateMinutes(r.lateMinutes)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatHoursWorked(r.hoursWorked)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && total > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 p-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing {rangeStart}–{rangeEnd} of {total} records
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="px-2 text-sm font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <FaChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <FaTimes className="h-6 w-6 text-red-500" />
      <p className="whitespace-pre-line text-sm text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  );
}