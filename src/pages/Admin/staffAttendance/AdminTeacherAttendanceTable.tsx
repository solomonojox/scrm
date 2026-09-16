// src/components/Admin/AdminTeacherAttendanceTable.tsx
import { useMemo, useState } from "react";
import { TeacherAttendanceRecord } from "../../../Types/Admin/attendance";
import { Avatar } from "../../../components/Admin/Avatar";
import {
  formatClockTime,
  formatHoursWorked,
  formatLateMinutes,
} from "../../../utils/duration";
import { Drawer } from "../../../components/Admin/Drawer";
import { Skeleton } from "../../../components/Admin/Skeleton";
import {
  exportAttendanceToExcel,
  exportAttendanceToPdf,
} from "../../../utils/exportAttendance";
import { FaFileExcel, FaFilePdf, FaSearch, FaTimes } from "react-icons/fa";

interface AdminTeacherAttendanceTableProps {
  records: TeacherAttendanceRecord[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

const STATUS_BADGE: Record<string, string> = {
  Present: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  ClockedIn: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  ClockedOut: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  Late: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  NotClockedIn: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  Absent: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
};

const STATUS_LABEL: Record<string, string> = {
  Present: "Clocked In",
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

export function AdminTeacherAttendanceTable({
  records,
  isLoading,
  error,
  onRetry,
}: AdminTeacherAttendanceTableProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<TeacherAttendanceRecord | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.teacher.teacherName.toLowerCase().includes(q) ||
        r.teacher.teacherEmail.toLowerCase().includes(q)
    );
  }, [records, query]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          Today&apos;s Teacher Attendance
        </h2>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-80">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teacher by name..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                exportAttendanceToExcel(filtered, {
                  includeDate: false,
                  filename: "todays-teacher-attendance",
                })
              }
              disabled={filtered.length === 0}
              title="Export to Excel"
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFileExcel className="h-4 w-4 text-green-600" />
              <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              type="button"
              onClick={() =>
                exportAttendanceToPdf(filtered, {
                  includeDate: false,
                  title: "Today's Teacher Attendance",
                })
              }
              disabled={filtered.length === 0}
              title="Export to PDF"
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFilePdf className="h-4 w-4 text-red-500" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isLoading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          message={
            records.length === 0
              ? "No teacher attendance has been recorded today."
              : "No teachers found"
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Teacher",
                  "Clock In",
                  "Clock Out",
                  "Status",
                  "Late By",
                  "Hours Worked",
                  "Action",
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
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={r.teacher.teacherName} src={r.teacher.avatarUrl} />
                      <span className="font-medium text-gray-900">
                        {r.teacher.teacherName}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatClockTime(r.clockInTime)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatClockTime(r.clockOutTime)}
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
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => setSelected(r)}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Attendance Details">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar
                name={selected.teacher.teacherName}
                src={selected.teacher.avatarUrl}
                size="lg"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {selected.teacher.teacherName}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <DetailRow label="Clock In" value={formatClockTime(selected.clockInTime)} />
              <DetailRow
                label="Clock Out"
                value={formatClockTime(selected.clockOutTime)}
              />
              <DetailRow label="Status" value={<StatusBadge status={selected.status} />} />
              <DetailRow
                label="Late By"
                value={formatLateMinutes(selected.lateMinutes)}
              />
              <DetailRow
                label="Hours Worked"
                value={formatHoursWorked(selected.hoursWorked)}
              />
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="mt-1 text-gray-900">{value}</dd>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
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
      <p className="text-sm text-gray-600">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
      >
        Try Again
      </button>
    </div>
  );
}