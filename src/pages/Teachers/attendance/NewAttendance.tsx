import React, { useState, useEffect, useContext } from "react";
import { Check, Clock, ArrowLeft, Users, Loader2, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import "../../../Styles/customScrollBar.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { useAuth } from "../../../Context/Auth/useAuth";
import {
  fetchStudentsFailure,
  fetchStudentsStart,
  fetchStudentsSuccess,
} from "../../../Store/Student/studentSlice";
import Select from "react-select";
import {
  fetchSessionFailure,
  fetchSessionStart,
  fetchSessionSuccess,
} from "../../../Store/sessionSlice";
import { sessionService } from "../../../Services/Session";
import { attendanceService } from "../../../Services/Attendance";
import { AppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";

interface Student {
  id: string; // UUID from API (studentId field)
  firstName: string;
  lastName: string;
  studentId: string; // Student number for display (studentId from API)
  photo: string | null;
  classroomId: string;
  studentNo: string;
}

interface AttendanceState extends Student {
  present: boolean | null;
  absent: boolean | null;
  late: boolean | null;
  time: string | null;
}

interface AttendancePayload {
  classroomId: string;
  sessionId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  timeIn: string;
  status: number; // 0=Present, 1=Absent, 2=Late
}

interface SummaryStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

interface OptionType {
  value: string | number | undefined;
  label: string;
}

type AttendanceType = "present" | "absent" | "late";

const NewAttendance: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const fetchedStudents = useSelector((state: RootState) => state.getStudentsByClassId.listRecords);
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getClassrooms.loading);
  const error = useSelector((state: RootState) => state.getClassrooms.error);

  const [attendanceState, setAttendanceState] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sessionOptions: OptionType[] = sessions.map((session: any) => ({
    value: session?.sessionId,
    label: session?.sessionId,
  }));

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleSelectChange = (selectedOption: OptionType | null) => {
    setSelectedSession(selectedOption ? String(selectedOption.value) : "");
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setCurrentDate(newDate);
  };

  // Format date for input value (YYYY-MM-DD)
  const getInputDateValue = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Sync fetchedStudents → local attendance state
  useEffect(() => {
    if (fetchedStudents && fetchedStudents.length > 0) {
      setAttendanceState(
        fetchedStudents.map((student: any) => ({
          ...student,
          present: null,
          absent: null,
          late: null,
          time: null,
        }))
      );
    } else {
      setAttendanceState([]);
    }
  }, [fetchedStudents]);

  // Fixed: Fetch on component mount
  useEffect(() => {
    fetchClassroom();
  }, []);

  const fetchClassroom = async () => {
    dispatch(fetchSessionStart());
    dispatch(fetchClassroomsStart());
    try {
      if (user?.role === "Teacher") {
        const classroomData = await classroomService.getClassroomByTeacherId(user?.id);
        const data = await sessionService.getAllRegisteredSessions(user?.schoolId);

        dispatch(fetchSessionSuccess(data));
        dispatch(fetchClassroomsSuccess(classroomData));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      dispatch(fetchSessionFailure((err as Error).message));
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCurrentTime = (): string => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Fetch students by class
  const fetchStudentsForClass = async (classKey: string): Promise<void> => {
    dispatch(fetchStudentsStart());
    setLoading(true);
    try {
      const response = await classroomService.getStudentsByClassroomId(classKey);

      // Fixed: Check if response has the expected structure
      if (!response || !Array.isArray(response)) {
        dispatch(fetchStudentsFailure("Invalid response structure"));
        setAttendanceState([]);
        return;
      }

      // Map API response to match component structure
      const mappedStudents: any = response.map((student: any) => ({
        id: student.studentId, // UUID as unique identifier
        firstName: student.firstname,
        lastName: student.lastname,
        studentId: student.studentId, // Student number for display
        studentNo: student.studentNo, // Student number for display
        classroomId: student.classroomId,
      }));

      // Update Redux state
      dispatch(fetchStudentsSuccess(mappedStudents));

      // OPTIONAL: Directly set attendance state as fallback
      // This ensures UI updates even if Redux has issues
      setAttendanceState(
        mappedStudents.map((student: any) => ({
          ...student,
          present: null,
          absent: null,
          late: null,
          time: null,
        }))
      );
    } catch (error) {
      console.error("Error fetching students:", error);
      dispatch(fetchStudentsFailure((error as Error).message));
      setAttendanceState([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedClassKey = e.target.value;
    setSelectedClass(selectedClassKey);
    setIsSubmitted(false);

    if (selectedClassKey) {
      fetchStudentsForClass(selectedClassKey);
    } else {
      setAttendanceState([]);
    }
  };

  const handleAttendanceChange = (studentId: string, type: AttendanceType): void => {
    if (isSubmitted) return;

    setAttendanceState((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              present: type === "present" ? true : false,
              absent: type === "absent" ? true : false,
              late: type === "late" ? true : false,
              time: getCurrentTime(),
            }
          : student
      )
    );
  };

  const clearAllAttendance = (): void => {
    if (isSubmitted) return;

    setAttendanceState((prev) =>
      prev.map((student) => ({
        ...student,
        present: null,
        absent: null,
        late: null,
        time: null,
      }))
    );
  };

  const submitAttendance = async (): Promise<void> => {
    if (!selectedClass) {
      toast.success(" Class is not selected!");
      return;
    }

    if (!selectedSession) {
      toast.success("Session is not selected!");
      return;
    }

    const markedStudents = attendanceState.filter(
      (s) => s.present !== null || s.absent !== null || s.late !== null
    );

    if (markedStudents.length === 0) {
      return;
    }

    // Format attendance data for API
    const attendancePayload = markedStudents.map((student) => ({
      classroomId: student.classroomId,
      sessionId: selectedSession,
      studentId: student?.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      timeIn: student.time || getCurrentTime(),
      status: student.absent ? 0 : student.present ? 1 : 2, // 1=Present, 0=Absent, 2=Late
      date: getInputDateValue(currentDate),
      termId: user?.termId
    }));

    try {
      setLoading(true);
      const res = await attendanceService.saveAttendance(attendancePayload);

      if (res) {
        notifySuccess("Attendance Created Successfully");
        setIsSubmitted(false);
        navigate("/teacher/attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSummaryStats = (): SummaryStats => {
    const totalStudents = attendanceState.length;
    const present = attendanceState.filter((s) => s.present === true).length;
    const absent = attendanceState.filter((s) => s.absent === true).length;
    const late = attendanceState.filter((s) => s.late === true).length;
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
        <div className="bg-white rounded-t-lg shadow-sm p-3 sm:p-4 border-b">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
            {/* Date Section */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <label className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4" />
                Date <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={getInputDateValue(currentDate)}
                  onChange={handleDateChange}
                  disabled={isSubmitted}
                  max={getInputDateValue(new Date())}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {/* <p className="text-sm text-gray-600">{formatDate(currentDate)}</p> */}
              </div>
            </div>

            {/* Controls Section */}
            <div className="w-full lg:w-auto grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              {/* Session Select */}
              <div className="w-full lg:w-48">
                <label className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  Session <span className="text-red-500">*</span>
                </label>
                <Select
                  options={sessionOptions}
                  value={getSelectedOption(selectedSession, sessionOptions)}
                  onChange={handleSelectChange}
                  placeholder="Select Session"
                  className="text-sm w-full"
                  isSearchable
                  required
                />
              </div>

              {/* Class Select */}
              <div className="w-full lg:w-48">
                <label className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  disabled={isSubmitted}
                  className="w-full px-3 sm:px-4 py-2 bg-orange-500 text-white border-none outline-none rounded-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Class</option>
                  {fetchedRecord.map((cls: any, index: number) => (
                    <option key={index} value={cls.classroomId}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Count Badge */}
              {selectedClass && (
                <div className="w-full sm:w-auto">
                  <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm h-10">
                    <Users className="w-4 h-4" />
                    <span>{attendanceState.length} Students</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white shadow-sm p-8 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-4" />
            <p className="text-gray-600">Loading students...</p>
          </div>
        )}

        {/* No Class */}
        {!selectedClass && !loading && (
          <div className="bg-white shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
            <p className="text-gray-600">
              Choose a class from the dropdown above to view and mark attendance for students.
            </p>
          </div>
        )}

        {/* No Students */}
        {selectedClass && !loading && attendanceState.length === 0 && (
          <div className="bg-white shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">No students are enrolled in this class.</p>
          </div>
        )}

        {/* Table */}
        {!loading && attendanceState.length > 0 && (
          <>
            <div className="bg-white shadow-sm">
              <div className="overflow-x-auto parent-scrollbar">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-orange-500 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">SN</th>
                      <th className="px-4 py-3 text-left">Photo</th>
                      <th className="px-4 py-3 text-left">First Name</th>
                      <th className="px-4 py-3 text-left hidden sm:table-cell">Last Name</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Student ID</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-left">Present</th>
                      <th className="px-4 py-3 text-left">Absent</th>
                      <th className="px-4 py-3 text-left">Late</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceState.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.firstName.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">{student.firstName}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{student.lastName}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{student.studentNo}</td>
                        <td className="px-4 py-3">
                          {student.time && (
                            <div className="flex items-center gap-1 text-green-600">
                              <Clock className="w-4 h-4" />
                              <span>{student.time}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={student.present === true}
                            disabled={isSubmitted}
                            onChange={() => handleAttendanceChange(student.id, "present")}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={student.absent === true}
                            disabled={isSubmitted}
                            onChange={() => handleAttendanceChange(student.id, "absent")}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={student.late === true}
                            disabled={isSubmitted}
                            onChange={() => handleAttendanceChange(student.id, "late")}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-b-lg shadow-sm p-4">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary Section</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p>Total Students</p>
                      <p className="font-bold text-blue-600">{stats.totalStudents}</p>
                    </div>
                    <div className="text-center">
                      <p>Present</p>
                      <p className="font-bold text-green-600">{stats.present}</p>
                    </div>
                    <div className="text-center">
                      <p>Absent</p>
                      <p className="font-bold text-red-600">{stats.absent}</p>
                    </div>
                    <div className="text-center">
                      <p>Late</p>
                      <p className="font-bold text-yellow-600">{stats.late}</p>
                    </div>
                    <div className="text-center">
                      <p>Attendance %</p>
                      <p className="font-bold text-purple-600">{stats.attendancePercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isSubmitted ? (
                    <>
                      <button
                        onClick={clearAllAttendance}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={submitAttendance}
                        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-3">
                      <span className="text-green-600 flex items-center">
                        <Check className="w-5 h-5 mr-2" /> Submitted
                      </span>
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
