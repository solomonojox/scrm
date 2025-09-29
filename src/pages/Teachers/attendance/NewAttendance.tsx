import React, { useState, useEffect } from "react";
import { Check, X, Clock, Save, RotateCcw, ArrowLeft, Users, Loader2 } from "lucide-react";
import '../../../Styles/customScrollBar.css';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  studentId: string;
  photo: string;
  present: boolean | null;
  absent: boolean | null;
  late: boolean | null;
  time: string | null;
}

interface ClassData {
  name: string;
  students: Student[];
}

interface SummaryStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

type AttendanceType = "present" | "absent" | "late";

const NewAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);

  // Mock class data with students
  const classData: Record<string, ClassData> = {
    jss1: {
      name: "JSS 1",
      students: [
        {
          id: 1001,
          firstName: "Jason",
          lastName: "Ethan",
          studentId: "JSS1/001",
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
          studentId: "JSS1/002",
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
          studentId: "JSS1/003",
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
          studentId: "JSS1/004",
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
          studentId: "JSS1/005",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
      ],
    },
    jss2: {
      name: "JSS 2",
      students: [
        {
          id: 2001,
          firstName: "Alice",
          lastName: "Johnson",
          studentId: "JSS2/001",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 2002,
          firstName: "Robert",
          lastName: "Smith",
          studentId: "JSS2/002",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 2003,
          firstName: "Lisa",
          lastName: "Garcia",
          studentId: "JSS2/003",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 2004,
          firstName: "John",
          lastName: "Martinez",
          studentId: "JSS2/004",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 2005,
          firstName: "Ashley",
          lastName: "Rodriguez",
          studentId: "JSS2/005",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 2006,
          firstName: "James",
          lastName: "Wilson",
          studentId: "JSS2/006",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
      ],
    },
    jss3: {
      name: "JSS 3",
      students: [
        {
          id: 3001,
          firstName: "sophia",
          lastName: "Taylor",
          studentId: "JSS3/001",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 3002,
          firstName: "William",
          lastName: "Anderson",
          studentId: "JSS3/002",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 3003,
          firstName: "Olivia",
          lastName: "Thomas",
          studentId: "JSS3/003",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 3004,
          firstName: "Benjamin",
          lastName: "Jackson",
          studentId: "JSS3/004",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
      ],
    },
    sss1: {
      name: "SSS 1",
      students: [
        {
          id: 4001,
          firstName: "Charlotte",
          lastName: "White",
          studentId: "SSS1/001",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4002,
          firstName: "Daniel",
          lastName: "Harris",
          studentId: "SSS1/002",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4003,
          firstName: "Mia",
          lastName: "Clark",
          studentId: "SSS1/003",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4004,
          firstName: "Ethan",
          lastName: "Lewis",
          studentId: "SSS1/004",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4005,
          firstName: "Isabella",
          lastName: "Walker",
          studentId: "SSS1/005",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4006,
          firstName: "Alexander",
          lastName: "Hall",
          studentId: "SSS1/006",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
        {
          id: 4007,
          firstName: "Grace",
          lastName: "Allen",
          studentId: "SSS1/007",
          photo: "/api/placeholder/40/40",
          present: null,
          absent: null,
          late: null,
          time: null,
        },
      ],
    },
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Simulate API call to fetch students
  const fetchStudentsForClass = async (classKey: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (classData[classKey]) {
        setStudents(classData[classKey].students);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedClassKey = e.target.value;
    setSelectedClass(selectedClassKey);
    setIsSubmitted(false); // Reset submission state

    if (selectedClassKey) {
      fetchStudentsForClass(selectedClassKey);
    } else {
      setStudents([]);
    }
  };

  const handleAttendanceChange = (studentId: number, type: AttendanceType): void => {
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

  const clearAllAttendance = (): void => {
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

  const submitAttendance = (): void => {
    if (!selectedClass) {
      alert("Please select a class first!");
      return;
    }

    if (students.length === 0) {
      alert("No students found for the selected class!");
      return;
    }

    const markedStudents = students.filter(
      (s) => s.present !== null || s.absent !== null || s.late !== null
    );

    if (markedStudents.length === 0) {
      alert("Please mark attendance for at least one student!");
      return;
    }

    setIsSubmitted(true);
    alert(
      `Attendance submitted successfully for ${classData[selectedClass]?.name}!\nTotal students marked: ${markedStudents.length}`
    );
  };

  const resetSubmission = (): void => {
    setIsSubmitted(false);
  };

  const getSummaryStats = (): SummaryStats => {
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
          <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer" />
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
            <select
              name="Class"
              id="Class"
              value={selectedClass}
              onChange={handleClassChange}
              disabled={isSubmitted}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-orange-500 text-white border-none outline-none rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option className="bg-gray-500" value="">
                Select Class
              </option>
              {Object.entries(classData).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.name}
                </option>
              ))}
            </select>

            {selectedClass && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <Users className="w-4 h-4" />
                <span>{students.length} Students</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white shadow-sm p-8 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600">
              Loading students for {classData[selectedClass]?.name}...
            </p>
          </div>
        )}

        {/* No Class Selected */}
        {!selectedClass && !loading && (
          <div className="bg-white shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
            <p className="text-gray-600">
              Choose a class from the dropdown above to view and mark attendance for students.
            </p>
          </div>
        )}

        {/* No Students Found */}
        {selectedClass && !loading && students.length === 0 && (
          <div className="bg-white shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              No students are enrolled in {classData[selectedClass]?.name}.
            </p>
          </div>
        )}

        {/* Table - Only show when students are loaded */}
        {!loading && students.length > 0 && (
          <>
            <div className="bg-white shadow-sm">
              <div className="overflow-x-auto parent-scrollbar">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-orange-500 text-white">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
                        SN
                      </th>
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
                          {index + 1}
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
                            <div className="text-xs text-gray-500 md:hidden">
                              {student.studentId}
                            </div>
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
                    Summary Section - {classData[selectedClass]?.name}
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
                        <span className="font-medium text-sm sm:text-base">
                          Attendance Submitted
                        </span>
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
          </>
        )}
      </div>
    </div>
  );
};

export default NewAttendance;
