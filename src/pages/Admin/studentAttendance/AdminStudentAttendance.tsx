import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaSync, FaUsers, FaUserCheck, FaUserTimes, FaPercentage } from "react-icons/fa";
import { AppDispatch, RootState } from "../../../Store/store";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { classrooms } from "../../../Types/classroomTypes";
import { AttendanceRecord } from "../../../Types/Admin/attendance";
import { studentAttendanceService } from "../../../Services/Admin/studentAttendance";
import { getErrorMessage } from "../../../utils/getErrorMessage";

type StatusFilter = "all" | "present" | "absent";

const STATUS_CONFIG: Record<number, { label: string; className: string }> = {
  1: { label: "Present", className: "bg-green-100 text-green-700" },
  0: { label: "Absent", className: "bg-red-100 text-red-700" },
};

const recordsPerPage = 20;

// Local date (YYYY-MM-DD). Avoids toISOString(), which is UTC and can be off by a day.
const getTodayKey = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const toDateKey = (iso: string) => iso.split("T")[0];

const formatDate = (dateKey: string) =>
  new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const formatTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }) : "—";

const AdminStudentAttendance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const classroomList: classrooms[] = useSelector(
    (state: RootState) => state.getClassrooms.listRecords,
  );

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If the date input is cleared, fall back to today
  const effectiveDate = selectedDate || getTodayKey();

  const selectedClass = useMemo(
    () => classroomList.find((c) => c.classroomId === selectedClassId),
    [classroomList, selectedClassId],
  );

  // 1. Make sure classrooms are loaded
  useEffect(() => {
    if (classroomList.length > 0) return;
    const fetchClassrooms = async () => {
      dispatch(fetchClassroomsStart());
      try {
        const data = await classroomService.getClassroomBySchoolId(
          localStorage.getItem("schoolId"),
        );
        dispatch(fetchClassroomsSuccess(data));
      } catch (err) {
        dispatch(fetchClassroomsFailure((err as Error).message));
      }
    };
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // 2. Default to the first classroom once the list is available
  useEffect(() => {
    if (!selectedClassId && classroomList.length > 0) {
      setSelectedClassId(classroomList[0].classroomId);
    }
  }, [classroomList, selectedClassId]);

  // 3. Fetch attendance whenever class or date changes (or on manual refresh)
  useEffect(() => {
    if (!selectedClassId) return;

    const schoolId = localStorage.getItem("schoolId");
    if (!schoolId) {
      setError("School ID not found. Please log in again.");
      return;
    }

    let ignore = false; // prevents stale responses overwriting newer ones

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await studentAttendanceService.getByDate(
          schoolId,
          selectedClassId,
          effectiveDate,
        );
        if (ignore) return;
        setRecords(data);
        setCurrentPage(1);
      } catch (err) {
        if (ignore) return;
        const msg = getErrorMessage(err) || "Failed to load attendance";
        setRecords([]);
        setError(msg);
        toast.error(msg);
        console.error("Attendance fetch failed:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [selectedClassId, effectiveDate, refreshKey]);

  // 4. Filtering
  const searchedRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => `${r.firstName} ${r.lastName}`.toLowerCase().includes(q));
  }, [records, searchQuery]);

  const filteredRecords = useMemo(() => {
    return searchedRecords.filter((r) => {
      if (statusFilter === "present") return r.status === 1;
      if (statusFilter === "absent") return r.status === 0;
      return true;
    });
  }, [searchedRecords, statusFilter]);

  // 5. Stats (ignore status filter so the cards stay meaningful)
  const stats = useMemo(() => {
    const present = searchedRecords.filter((r) => r.status === 1).length;
    const absent = searchedRecords.filter((r) => r.status === 0).length;
    const total = searchedRecords.length;
    return { total, present, absent, rate: total ? Math.round((present / total) * 100) : 0 };
  }, [searchedRecords]);

  // 6. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / recordsPerPage));
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Student Attendance</h1>
            <p className="text-sm text-gray-600">
              Home <span className="text-orange-500 font-semibold">: Attendance</span>
              {selectedClass && (
                <span className="text-gray-500">
                  {" "}
                  · {selectedClass.name} · {formatDate(effectiveDate)}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading || !selectedClassId}
            className="inline-flex items-center gap-2 border bg-white px-3 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <FaSync className={`text-orange-500 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FaUsers />}
            label="Total Students"
            value={stats.total}
            tone="bg-orange-100 text-orange-600"
          />
          <StatCard
            icon={<FaUserCheck />}
            label="Present"
            value={stats.present}
            tone="bg-green-100 text-green-600"
          />
          <StatCard
            icon={<FaUserTimes />}
            label="Absent"
            value={stats.absent}
            tone="bg-red-100 text-red-600"
          />
          <StatCard
            icon={<FaPercentage />}
            label="Attendance Rate"
            value={`${stats.rate}%`}
            tone="bg-blue-100 text-blue-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Classroom</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={classroomList.length === 0}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-50"
            >
              {classroomList.length === 0 && <option value="">Loading classes…</option>}
              {classroomList.map((c) => (
                <option key={c.classroomId} value={c.classroomId}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              max={getTodayKey()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                resetPage();
              }}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Student name"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetPage();
                }}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Student</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Loading attendance…
                  </td>
                </tr>
              ) : currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No attendance records for {formatDate(effectiveDate)}
                  </td>
                </tr>
              ) : (
                currentRecords.map((r, index) => {
                  const status = STATUS_CONFIG[r.status] ?? {
                    label: "Unknown",
                    className: "bg-gray-100 text-gray-600",
                  };
                  return (
                    <tr
                      key={`${r.studentId}-${r.attendanceDate}`}
                      className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="p-3 text-gray-500">
                        {(currentPage - 1) * recordsPerPage + index + 1}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="p-3">{formatDate(toDateKey(r.attendanceDate))}</td>
                      {/* <td className="p-3">{formatTime(r.timeIn)}</td> */}
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredRecords.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 border rounded ${
                currentPage === 1
                  ? "bg-white text-black border-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages} ({filteredRecords.length} records)
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 border rounded ${
                currentPage === totalPages
                  ? "bg-white text-black border-gray-600 cursor-not-allowed"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: string;
}> = ({ icon, label, value, tone }) => (
  <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${tone}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminStudentAttendance;