import React, { useState, useEffect } from "react";
import { ChevronLeft, Download, FileText, ChevronDown, Edit3 } from "lucide-react";

// Define types
type Days = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";

interface WeekAttendance {
  Mon: boolean;
  Tue: boolean;
  Wed: boolean;
  Thu: boolean;
  Fri: boolean;
  Late: number;
}

interface Student {
  id: number;
  name: string;
  weeks: Record<number, WeekAttendance>; // 1 → 13 weeks
}

interface Summary {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

const days: Days[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const AttendanceReport = (): React.JSX.Element => {
  const [summary, setSummary] = useState<Summary>({
    totalStudents: 25,
    present: 0,
    absent: 0,
    late: 0,
    attendancePercentage: 0,
  });

  const [isPublished, setIsPublished] = useState<boolean>(false);

  // Initialize 25 students with 13 weeks of attendance
  const [students, setStudents] = useState<Student[]>(
    Array(25)
      .fill(null)
      .map((_, index) => {
        const weeks: Record<number, WeekAttendance> = {};
        for (let i = 1; i <= 13; i++) {
          weeks[i] = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Late: 0 };
        }
        return {
          id: index + 1,
          name: `Student ${index + 1}`,
          weeks,
        };
      })
  );

  // Calculate summary statistics across all 13 weeks
  useEffect(() => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;

    students.forEach((student) => {
      Object.values(student.weeks).forEach((week) => {
        Object.entries(week).forEach(([key, value]) => {
          if (key === "Late") {
            totalLate += value as number;
          } else {
            if (value === true) totalPresent++;
            else totalAbsent++;
          }
        });
      });
    });

    const totalPossible = students.length * (13 * days.length); // students × 13 weeks × 5 days
    const attendancePercentage = Math.round((totalPresent / totalPossible) * 100);

    setSummary({
      totalStudents: students.length,
      present: totalPresent,
      absent: totalAbsent,
      late: totalLate,
      attendancePercentage,
    });
  }, [students]);

  // Toggle attendance
  const toggleAttendance = (studentId: number, week: number, day: Days) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              weeks: {
                ...student.weeks,
                [week]: {
                  ...student.weeks[week],
                  [day]: !student.weeks[week][day],
                },
              },
            }
          : student
      )
    );
  };

  // Update late count
  const updateLateCount = (studentId: number, week: number, value: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              weeks: {
                ...student.weeks,
                [week]: {
                  ...student.weeks[week],
                  Late: Math.max(0, parseInt(value) || 0),
                },
              },
            }
          : student
      )
    );
  };

  // Calculate % per student
  const calculateStudentPercentage = (student: Student): number => {
    const totalDays = 13 * days.length; // 13 weeks × 5 days
    const presentDays = Object.values(student.weeks).reduce((count, week) => {
      return count + days.reduce((c, day) => c + (week[day] ? 1 : 0), 0);
    }, 0);
    return Math.round((presentDays / totalDays) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium text-gray-900">
              Attendance Report (Cumulative Record per Term)
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300">
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg">
              <FileText className="w-4 h-4 mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Gold International Academy</h2>
              <p className="text-blue-200 text-sm">Excellence in Education</p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-700 rounded-lg px-3 py-2">
              <span className="text-sm">Cumulative Report</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Attendance Report</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-blue-200">Term:</span>
              <p className="font-medium">First Term</p>
            </div>
            <div>
              <span className="text-blue-200">Session:</span>
              <p className="font-medium">2024/2025</p>
            </div>
            <div>
              <span className="text-blue-200">Class:</span>
              <p className="font-medium">JSS 1</p>
            </div>
            <div>
              <span className="text-blue-200">Total School Days:</span>
              <p className="font-medium">110</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-w-[920px] min-w-[120px] mx-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    rowSpan={2}
                    className="sticky left-0 bg-gray-50 border border-gray-200 px-3 py-3 text-left text-sm font-medium text-gray-900 min-w-[60px] z-10"
                  >
                    SN
                  </th>
                  <th
                    rowSpan={2}
                    className="sticky left-[60px] bg-gray-50 border border-gray-200 px-3 py-3 text-left text-sm font-medium text-gray-900 min-w-[200px] z-10"
                  >
                    Students Name
                  </th>
                  {Array.from({ length: 13 }, (_, i) => i + 1).map((week) => (
                    <th
                      key={`week-${week}`}
                      colSpan={7}
                      className="border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-900"
                    >
                      Week {week}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  {Array.from({ length: 13 }, (_, i) => i + 1).flatMap((week) => [
                    ...days.map((day) => (
                      <th
                        key={`w${week}-${day}`}
                        className="border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-700 min-w-[50px]"
                      >
                        {day}
                      </th>
                    )),
                    <th
                      key={`w${week}-late`}
                      className="border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-700 min-w-[50px]"
                    >
                      Late
                    </th>,
                    <th
                      key={`w${week}-percent`}
                      className="border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-700 min-w-[50px]"
                    >
                      %
                    </th>,
                  ])}
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 text-center z-10">
                      {index + 1}
                    </td>
                    <td className="sticky left-[60px] bg-white border border-gray-200 px-3 py-2 text-sm text-gray-900 z-10">
                      <div className="flex items-center space-x-2">
                        <span>{student.name}</span>
                        <Edit3 className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
                      </div>
                    </td>

                    {Array.from({ length: 13 }, (_, i) => i + 1).flatMap((week) => [
                      ...days.map((day) => (
                        <td
                          key={`${student.id}-w${week}-${day}`}
                          className="border border-gray-200 px-2 py-2 text-center"
                        >
                          <button
                            onClick={() => toggleAttendance(student.id, week, day)}
                            className={`w-6 h-6 rounded ${
                              student.weeks[week][day]
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-200 hover:bg-gray-300"
                            } transition-colors`}
                          >
                            {student.weeks[week][day] && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </button>
                        </td>
                      )),
                      <td
                        key={`${student.id}-w${week}-late`}
                        className="border border-gray-200 px-2 py-2 text-center"
                      >
                        <input
                          type="number"
                          min="0"
                          value={student.weeks[week].Late}
                          onChange={(e) => updateLateCount(student.id, week, e.target.value)}
                          className="w-12 h-6 text-xs text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </td>,
                      <td
                        key={`${student.id}-w${week}-percent`}
                        className="border border-gray-200 px-2 py-2 text-center text-xs text-gray-600"
                      >
                        {calculateStudentPercentage(student)}%
                      </td>,
                    ])}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cumulative Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Total Students</span>
                  <p className="text-lg font-semibold text-gray-900">{summary.totalStudents}</p>
                </div>
                <div>
                  <span className="text-gray-600">Present</span>
                  <p className="text-lg font-semibold text-green-600">{summary.present}</p>
                </div>
                <div>
                  <span className="text-gray-600">Absent</span>
                  <p className="text-lg font-semibold text-red-600">{summary.absent}</p>
                </div>
                <div>
                  <span className="text-gray-600">Late</span>
                  <p className="text-lg font-semibold text-yellow-600">{summary.late}</p>
                </div>
                <div>
                  <span className="text-gray-600">Attendance (%)</span>
                  <p className="text-lg font-semibold text-blue-600">
                    {summary.attendancePercentage}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Publish</span>
              <button
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isPublished ? "bg-green-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isPublished ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3">Remarks</h4>
            <div className="space-y-2 text-sm">
              <p className="text-red-600 italic">Average lateness increased in Week 6</p>
              <p className="text-gray-600 italic">Mondays have the highest absenteeism (15%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
