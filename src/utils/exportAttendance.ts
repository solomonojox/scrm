// src/utils/exportAttendance.ts
import { TeacherAttendanceRecord } from "../Types/Admin/attendance";
import { formatClockTime, formatHistoryDate } from "./duration";

interface ExportOptions {
  includeDate: boolean;
  filename?: string;
  title?: string;
}

/**
 * Exports attendance records to a CSV file (Excel-compatible).
 */
export function exportAttendanceToExcel(
  records: TeacherAttendanceRecord[],
  options: ExportOptions
): void {
  if (records.length === 0) return;

  const headers = [
    ...(options.includeDate ? ["Date"] : []),
    "Teacher",
    "Email",
    "Clock In",
    "Clock Out",
    "Status",
    "Late By",
    "Hours Worked",
  ];

  const rows = records.map((r) => [
    ...(options.includeDate ? [formatHistoryDate(r.date)] : []),
    r.teacher.teacherName,
    r.teacher.teacherEmail,
    formatClockTime(r.clockInTime),
    formatClockTime(r.clockOutTime),
    r.status,
    r.lateMinutes > 0 ? `${r.lateMinutes} min` : "—",
    `${r.hoursWorked.hours}h ${r.hoursWorked.minutes}m`,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${options.filename || "attendance-export"}-${new Date()
      .toISOString()
      .split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports attendance records to a PDF via a print-friendly window.
 */
export function exportAttendanceToPdf(
  records: TeacherAttendanceRecord[],
  options: ExportOptions
): void {
  if (records.length === 0) return;

  const title = options.title || "Teacher Attendance Report";
  const dateGenerated = new Date().toLocaleString();

  const tableHeaders = [
    ...(options.includeDate ? ["Date"] : []),
    "Teacher",
    "Email",
    "Clock In",
    "Clock Out",
    "Status",
    "Late By",
    "Hours Worked",
  ];

  const tableRows = records
    .map((r) => {
      const cells = [
        ...(options.includeDate ? [formatHistoryDate(r.date)] : []),
        r.teacher.teacherName,
        r.teacher.teacherEmail,
        formatClockTime(r.clockInTime),
        formatClockTime(r.clockOutTime),
        r.status,
        r.lateMinutes > 0 ? `${r.lateMinutes} min` : "—",
        `${r.hoursWorked.hours}h ${r.hoursWorked.minutes}m`,
      ];
      return `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 20px; margin-bottom: 8px; }
        .meta { color: #666; font-size: 12px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: 600; }
        tr:nth-child(even) { background-color: #fafafa; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">Generated on ${dateGenerated} · ${records.length} record(s)</p>
      <table>
        <thead>
          <tr>${tableHeaders.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}