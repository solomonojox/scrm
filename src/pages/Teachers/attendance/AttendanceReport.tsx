import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";

const AttendanceReport = () => {
  const [session, setSession] = useState("2024/2025");
  const [term, setTerm] = useState("First Term");
  const [team, setTeam] = useState("First Team");
  const [selectedWeeks, setSelectedWeeks] = useState([1, 2]); // Default show 2 weeks
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [activeTab, setActiveTab] = useState("table"); // 'table' or 'chart'

  // Sample data with more students and weeks
  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "John Smith",
      weeks: [
        {
          week: 1,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: false },
            wed: { present: true, late: true },
            thu: { present: false, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 1,
          percentage: 80,
        },
        {
          week: 2,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: false },
            wed: { present: true, late: false },
            thu: { present: true, late: true },
            fri: { present: false, late: false },
          },
          lateCount: 1,
          percentage: 80,
        },
        {
          week: 3,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: false },
            wed: { present: true, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 0,
          percentage: 100,
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      weeks: [
        {
          week: 1,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: false },
            wed: { present: true, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 0,
          percentage: 100,
        },
        {
          week: 2,
          days: {
            mon: { present: false, late: false },
            tue: { present: true, late: true },
            wed: { present: true, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 1,
          percentage: 80,
        },
        {
          week: 3,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: true },
            wed: { present: false, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 1,
          percentage: 80,
        },
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      weeks: [
        {
          week: 1,
          days: {
            mon: { present: false, late: false },
            tue: { present: false, late: false },
            wed: { present: true, late: true },
            thu: { present: true, late: false },
            fri: { present: false, late: false },
          },
          lateCount: 1,
          percentage: 40,
        },
        {
          week: 2,
          days: {
            mon: { present: true, late: false },
            tue: { present: true, late: false },
            wed: { present: true, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 0,
          percentage: 100,
        },
      ],
    },
    {
      id: 4,
      name: "Emily Davis",
      weeks: [
        {
          week: 1,
          days: {
            mon: { present: true, late: true },
            tue: { present: true, late: true },
            wed: { present: true, late: false },
            thu: { present: true, late: false },
            fri: { present: true, late: false },
          },
          lateCount: 2,
          percentage: 100,
        },
        {
          week: 2,
          days: {
            mon: { present: true, late: false },
            tue: { present: false, late: false },
            wed: { present: false, late: false },
            thu: { present: true, late: true },
            fri: { present: true, late: false },
          },
          lateCount: 1,
          percentage: 60,
        },
      ],
    },
  ]);

  // Available weeks for selection
  const availableWeeks = [1, 2, 3, 4, 5, 6];

  // Toggle week selection
  const toggleWeek = (week: number) => {
    setSelectedWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week].sort()
    );
  };

  // Handle attendance toggle
  const toggleAttendance = (
    studentId: number | string,
    week: number,
    day: number,
    type: string
  ) => {
    if (!isEditing) return;

    setAttendanceData((prevData) =>
      prevData.map((student) => {
        if (student.id === studentId) {
          const updatedWeeks = student.weeks.map((w) => {
            if (w.week === week) {
              const updatedDays = { ...w.days };
              if (type === "present") {
                updatedDays[day] = {
                  present: !updatedDays[day].present,
                  late: updatedDays[day].present ? false : updatedDays[day].late,
                };
              } else if (type === "late") {
                updatedDays[day] = {
                  present: true, // Must be present to be late
                  late: !updatedDays[day].late,
                };
              }

              // Recalculate late count and percentage
              const lateCount = Object.values(updatedDays).filter((day) => day.late).length;
              const presentCount = Object.values(updatedDays).filter((day) => day.present).length;
              const percentage = Math.round((presentCount / 5) * 100);

              return {
                ...w,
                days: updatedDays,
                lateCount,
                percentage,
              };
            }
            return w;
          });
          return { ...student, weeks: updatedWeeks };
        }
        return student;
      })
    );
  };

  // Filter students based on search
  const filteredStudents = attendanceData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortConfig.key === "percentage") {
      const aPercent = getStudentOverallPercentage(a);
      const bPercent = getStudentOverallPercentage(b);
      return sortConfig.direction === "asc" ? aPercent - bPercent : bPercent - aPercent;
    }
    return 0;
  });

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  // Calculate student overall percentage
  const getStudentOverallPercentage = (student: any) => {
    const totalWeeks = student.weeks.length;
    if (totalWeeks === 0) return 0;
    const totalPercentage = student.weeks.reduce(
      (sum: number, week: any) => sum + week.percentage,
      0
    );
    return Math.round(totalPercentage / totalWeeks);
  };

  // Calculate cumulative summary
  const calculateSummary = () => {
    let totalStudents = attendanceData.length;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalDays = 0;

    attendanceData.forEach((student) => {
      student.weeks.forEach((week) => {
        Object.values(week.days).forEach((day) => {
          totalDays++;
          if (day.present) {
            totalPresent++;
            if (day.late) totalLate++;
          } else {
            totalAbsent++;
          }
        });
      });
    });

    const attendancePercentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;

    return {
      totalStudents,
      present: totalPresent,
      absent: totalAbsent,
      late: totalLate,
      percentage: attendancePercentage,
    };
  };

  const summary = calculateSummary();

  // Get status icon with click handler
  const getStatusIcon = (
    studentId: number | string,
    week: number,
    day: number,
    present: boolean,
    late: boolean
  ) => {
    const baseClass =
      "w-6 h-6 rounded cursor-pointer transition-all duration-200 flex items-center justify-center text-sm";

    if (!present) {
      return (
        <div
          className={`${baseClass} bg-red-100 text-red-600 hover:bg-red-200`}
          onClick={() => toggleAttendance(studentId, week, day, "present")}
          title="Click to mark present"
        >
          ❌
        </div>
      );
    }

    if (late) {
      return (
        <div
          className={`${baseClass} bg-yellow-100 text-yellow-600 hover:bg-yellow-200`}
          onClick={() => toggleAttendance(studentId, week, day, "late")}
          title="Click to remove late mark"
        >
          ⚠️
        </div>
      );
    }

    return (
      <div
        className={`${baseClass} bg-green-100 text-green-600 hover:bg-green-200`}
        onClick={() => toggleAttendance(studentId, week, day, "present")}
        title="Click to mark absent"
      >
        ✅
      </div>
    );
  };

  // Weekly statistics for chart view
  const weeklyStats = availableWeeks.map((week) => {
    const weekData = attendanceData.flatMap((student) =>
      student.weeks.filter((w) => w.week === week)
    );

    const totalDays = weekData.length * 5;
    const presentDays = weekData.reduce(
      (sum, w) => sum + Object.values(w.days).filter((day) => day.present).length,
      0
    );

    return {
      week,
      percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0,
    };
  });

  return (
    <div className="attendance-report p-4 lg:p-6 bg-white rounded-lg shadow-lg max-w-full mx-auto">
      <div className="flex flex-col gap-2" onClick={() => window.history.back()}>
        <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
      </div>
      {/* Header with Controls */}
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Gold International Academy
        </h1>
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">Attendance Report</h2>

        <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-8 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="text-lg font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Session:</label>
            <input
              type="text"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="text-lg font-semibold border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Weeks:</label>
            <div className="flex flex-wrap gap-1">
              {availableWeeks.map((week) => (
                <button
                  key={week}
                  onClick={() => toggleWeek(week)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedWeeks.includes(week)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isEditing
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isEditing ? "Finish Editing" : "Edit Attendance"}
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleSort("name")}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sort by Name{" "}
              {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </button>
            <button
              onClick={() => handleSort("percentage")}
              className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Sort by %{" "}
              {sortConfig.key === "percentage" && (sortConfig.direction === "asc" ? "↑" : "↓")}
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("table")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "table"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "chart"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Chart View
          </button>
        </div>

        <hr className="border-gray-300 my-4" />
      </div>

      {/* Chart View */}
      {activeTab === "chart" && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Attendance Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {weeklyStats.map((stat) => (
              <div key={stat.week} className="text-center">
                <div className="text-sm font-medium text-gray-600">Week {stat.week}</div>
                <div className="text-2xl font-bold text-blue-600">{stat.percentage}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {activeTab === "table" && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Session Name</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    rowSpan="2"
                    className="border border-gray-300 px-2 lg:px-4 py-2 font-semibold sticky left-0 bg-gray-100 z-10"
                  >
                    SN
                  </th>
                  <th
                    rowSpan="2"
                    className="border border-gray-300 px-2 lg:px-4 py-2 font-semibold sticky left-12 bg-gray-100 z-10 min-w-[120px]"
                  >
                    Students Name
                  </th>

                  {/* Dynamic Week Headers */}
                  {selectedWeeks.map((week) => (
                    <th
                      key={week}
                      colSpan="7"
                      className="border border-gray-300 px-2 py-2 font-semibold text-center bg-blue-50"
                    >
                      Week {week}
                    </th>
                  ))}
                </tr>

                <tr className="bg-gray-50">
                  {selectedWeeks.flatMap((week) =>
                    ["Mon", "Tue", "Wed", "Thu", "Fri", "Late", "%"].map((day, index) => (
                      <th
                        key={`${week}-${day}`}
                        className="border border-gray-300 px-1 lg:px-2 py-1 font-medium text-xs lg:text-sm"
                      >
                        {day}
                      </th>
                    ))
                  )}
                </tr>
              </thead>

              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-300 px-2 lg:px-4 py-2 text-center font-medium sticky left-0 bg-white z-10">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 lg:px-4 py-2 font-medium sticky left-12 bg-white z-10 min-w-[120px]">
                      {student.name}
                    </td>

                    {/* Dynamic Week Data */}
                    {selectedWeeks.map((week) => {
                      const weekData = student.weeks.find((w) => w.week === week);
                      return weekData ? (
                        <>
                          {["mon", "tue", "wed", "thu", "fri"].map((day) => (
                            <td
                              key={`${week}-${day}`}
                              className="border border-gray-300 px-1 py-1 text-center"
                            >
                              {getStatusIcon(
                                student.id,
                                week,
                                day,
                                weekData.days[day].present,
                                weekData.days[day].late
                              )}
                            </td>
                          ))}
                          <td className="border border-gray-300 px-1 py-1 text-center font-medium">
                            {weekData.lateCount}
                          </td>
                          <td className="border border-gray-300 px-1 py-1 text-center font-medium bg-blue-50">
                            {weekData.percentage}%
                          </td>
                        </>
                      ) : (
                        <td
                          colSpan="7"
                          className="border border-gray-300 px-2 py-1 text-center text-gray-400"
                        >
                          No data
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-8 p-4 lg:p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cumulative Summary */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Cumulative Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-semibold">{summary.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Present:</span>
                <span className="font-semibold text-green-600">{summary.present}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Absent:</span>
                <span className="font-semibold text-red-600">{summary.absent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Late:</span>
                <span className="font-semibold text-yellow-600">{summary.late}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Attendance (%):</span>
                <span className="font-semibold text-blue-600">{summary.percentage}%</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Remarks</h4>
            <div className="space-y-2 text-gray-700">
              <p className="italic">• Average attendance increased in Week 3</p>
              <p className="italic">• Overall attendance shows improvement compared to last term</p>
              <p className="italic">• Late arrivals decreased by 5% this week</p>
              <p className="italic">• {sortedStudents[0]?.name} has the best attendance record</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-end">
        <button className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          📄 Print Report
        </button>
        <button className="px-4 lg:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          📊 Export PDF
        </button>
        <button className="px-4 lg:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
          💾 Save Report
        </button>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 lg:gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 text-green-600 rounded flex items-center justify-center">
            ✅
          </div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-100 text-yellow-600 rounded flex items-center justify-center">
            ⚠️
          </div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-100 text-red-600 rounded flex items-center justify-center">
            ❌
          </div>
          <span>Absent</span>
        </div>
        {isEditing && (
          <div className="flex items-center gap-1 text-blue-600 font-medium">
            <span>✏️</span>
            <span>Click icons to edit</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
