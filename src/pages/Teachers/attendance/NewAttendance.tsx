import React, { useState, useEffect } from "react";
import { Check, X, Clock, Save, RotateCcw, ArrowLeft } from "lucide-react";

const NewAttendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [students, setStudents] = useState<
    Array<{
      id: number | string;
      firstName: string;
      lastName: string;
      studentId: string;
      photo: string;
      present: boolean | null;
      absent: boolean | null;
      late: boolean | null;
      time: string | null;
    }>
  >([
    {
      id: 1001,
      firstName: "Jason",
      lastName: "Ethan",
      studentId: "29488757575",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1002,
      firstName: "Emma",
      lastName: "Wilson",
      studentId: "29488757576",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1003,
      firstName: "Michael",
      lastName: "Brown",
      studentId: "29488757577",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1004,
      firstName: "Sarah",
      lastName: "Davis",
      studentId: "29488757578",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1005,
      firstName: "David",
      lastName: "Miller",
      studentId: "29488757579",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1006,
      firstName: "Lisa",
      lastName: "Garcia",
      studentId: "29488757580",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1007,
      firstName: "John",
      lastName: "Martinez",
      studentId: "29488757581",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
    {
      id: 1008,
      firstName: "Ashley",
      lastName: "Rodriguez",
      studentId: "29488757582",
      photo: "/api/placeholder/40/40",
      present: null,
      absent: null,
      late: null,
      time: null,
    },
  ]);

  const formatDate = (date: Date) => {
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options as Intl.DateTimeFormatOptions);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAttendanceChange = (
    studentId: number | string,
    type: "present" | "absent" | "late"
  ) => {
    if (isSubmitted) return;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.id === studentId) {
          const currentTime = getCurrentTime();
          return {
            ...student,
            present: type === "present" ? true : false,
            absent: type === "absent" ? true : false,
            late: type === "late" ? true : false,
            time: currentTime,
          };
        }
        return student;
      })
    );
  };

  //   const clearAttendance = (studentId: number | string) => {
  //     if (isSubmitted) return;

  //     setStudents((prev) =>
  //       prev.map((student) => {
  //         if (student.id === studentId) {
  //           return {
  //             ...student,
  //             present: null,
  //             absent: null,
  //             late: null,
  //             time: null,
  //           };
  //         }
  //         return student;
  //       })
  //     );
  //   };

  const clearAllAttendance = () => {
    if (isSubmitted) return;

    setStudents((prev) =>
      prev.map((student) => ({
        ...student,
        present: null,
        absent: null,
        late: null,
        time: null,
      }))
    );
  };

  const submitAttendance = () => {
    setIsSubmitted(true);
    alert("Attendance submitted successfully!");
  };

  const resetSubmission = () => {
    setIsSubmitted(false);
  };

  const getSummaryStats = () => {
    const totalStudents = students.length;
    const present = students.filter((s) => s.present === true).length;
    const absent = students.filter((s) => s.absent === true).length;
    const late = students.filter((s) => s.late === true).length;
    const attendancePercentage =
      totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;

    return { totalStudents, present, absent, late, attendancePercentage };
  };

  const stats = getSummaryStats();

  return (
    <div className="p-2 sm:p-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">New Attendance</h1>
        </div>

        {/* Header */}
        <div className="bg-white rounded-t-lg shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button className="text-gray-600 hover:text-gray-800 sm:block hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1 sm:flex-none">
              <p className="text-sm sm:text-base text-gray-600">{formatDate(currentDate)}</p>
            </div>
            <button className="text-gray-600 hover:text-gray-800 sm:block hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base">
              Date
            </button>
            <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base">
              Session
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">SN</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    Photo
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    First Name
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">
                    Last Name
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium hidden md:table-cell">
                    Student ID
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    Time
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    Present
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    Absent
                  </th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                    Late
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                      {student.id}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                        {student.firstName.charAt(0)}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                      <div className="sm:hidden">
                        <div className="font-medium">{student.firstName}</div>
                        <div className="text-xs text-gray-500">{student.lastName}</div>
                        <div className="text-xs text-gray-500 md:hidden">{student.studentId}</div>
                      </div>
                      <div className="hidden sm:block">{student.firstName}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                      {student.lastName}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                      {student.studentId}
                    </td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                      {student.time && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm">{student.time}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={student.present === true}
                        disabled={isSubmitted}
                        onChange={() => handleAttendanceChange(student.id, "present")}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 rounded focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={student.absent === true}
                        disabled={isSubmitted}
                        onChange={() => handleAttendanceChange(student.id, "absent")}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 rounded focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-3">
                      <input
                        type="checkbox"
                        checked={student.late === true}
                        disabled={isSubmitted}
                        onChange={() => handleAttendanceChange(student.id, "late")}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 rounded focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-b-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="w-full lg:w-auto">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                Summary Section
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full lg:max-w-2xl">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Students</div>
                  <div className="text-lg sm:text-2xl font-semibold text-blue-600 bg-blue-50 rounded-lg py-2 px-2 sm:px-3">
                    {stats.totalStudents}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Present</div>
                  <div className="text-lg sm:text-2xl font-semibold text-green-600 bg-green-50 rounded-lg py-2 px-2 sm:px-3">
                    {stats.present}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Absent</div>
                  <div className="text-lg sm:text-2xl font-semibold text-red-600 bg-red-50 rounded-lg py-2 px-2 sm:px-3">
                    {stats.absent}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Late</div>
                  <div className="text-lg sm:text-2xl font-semibold text-yellow-600 bg-yellow-50 rounded-lg py-2 px-2 sm:px-3">
                    {stats.late}
                  </div>
                </div>
                <div className="text-center col-span-2 sm:col-span-1">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Attendance %</div>
                  <div className="text-lg sm:text-2xl font-semibold text-purple-600 bg-purple-50 rounded-lg py-2 px-2 sm:px-3">
                    {stats.attendancePercentage}%
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {!isSubmitted && (
                <>
                  <button
                    onClick={clearAllAttendance}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear All
                  </button>
                  <button
                    onClick={submitAttendance}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </>
              )}

              {isSubmitted && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base">Attendance Submitted</span>
                  </div>
                  <button
                    onClick={resetSubmission}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Edit Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAttendance;
