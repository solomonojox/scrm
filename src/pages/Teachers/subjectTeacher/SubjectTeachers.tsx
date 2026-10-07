import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { FaSearch, FaSync, FaPlus, FaUserPlus, FaBookOpen } from "react-icons/fa";
import { AppDispatch, RootState } from "../../../Store/store";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { classrooms } from "../../../Types/classroomTypes";
import { Subject } from "../../../Types/Teacher/subjectTeacher";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { useAuth } from "../../../Context/Auth/useAuth";
import AddSubjectModal from "./AddSubjectModal";
import SubjectTeachersModal from "./SubjectTeachersModal";
import { subjectTeacherService } from "../../../Services/Teachers/subject/subjectTeacher";

const TeacherSubjects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const classroomList: classrooms[] = useSelector(
    (state: RootState) => state.getClassrooms.listRecords,
  );

  // localStorage is set at login; user (from context) is the fallback
  const schoolId = localStorage.getItem("schoolId") || user?.schoolId || "";

  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [teachersModalSubject, setTeachersModalSubject] = useState<Subject | null>(null);

  const selectedClass = useMemo(
    () => classroomList.find((c) => c.classroomId === selectedClassId),
    [classroomList, selectedClassId],
  );

  // 1. Make sure classrooms are loaded
  useEffect(() => {
    if (classroomList.length > 0 || !schoolId) return;
    const fetchClassrooms = async () => {
      dispatch(fetchClassroomsStart());
      try {
        const data = await classroomService.getClassroomBySchoolId(schoolId);
        dispatch(fetchClassroomsSuccess(data));
      } catch (err) {
        dispatch(fetchClassroomsFailure((err as Error).message));
      }
    };
    fetchClassrooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, schoolId]);

  // 2. Default to the first classroom
  useEffect(() => {
    if (!selectedClassId && classroomList.length > 0) {
      setSelectedClassId(classroomList[0].classroomId);
    }
  }, [classroomList, selectedClassId]);

  // 3. Fetch subjects when the class changes (or on refresh)
  useEffect(() => {
    if (!selectedClassId || !schoolId) return;

    let ignore = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await subjectTeacherService.getByClass(schoolId, selectedClassId);
        if (ignore) return;
        setSubjects(data.filter((s) => !s.isDeleted));
      } catch (err) {
        if (ignore) return;
        const msg = getErrorMessage(err) || "Failed to load subjects";
        setSubjects([]);
        setError(msg);
        toast.error(msg);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [selectedClassId, schoolId, refreshKey]);

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return subjects;
    return subjects.filter(
      (s) =>
        s.subjectName?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q),
    );
  }, [subjects, searchQuery]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Subjects</h1>
            <p className="text-sm text-gray-600">
              Home <span className="text-orange-500 font-semibold">: Subjects</span>
              {selectedClass && <span className="text-gray-500"> · {selectedClass.name}</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={loading || !selectedClassId}
              className="inline-flex items-center gap-2 border bg-white px-3 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <FaSync className={`text-orange-500 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setAddOpen(true)}
              disabled={!selectedClassId}
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-orange-600 disabled:opacity-50"
            >
              <FaPlus />
              Add Subject
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Subject name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="p-3">Subject</th>
                <th className="p-3">Description</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Loading subjects…
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500">
                    <FaBookOpen className="mx-auto mb-2 text-2xl text-gray-300" />
                    {searchQuery
                      ? "No subjects match your search"
                      : "No subjects for this classroom yet"}
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((s, index) => (
                  <tr
                    key={s.subjectId}
                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-3 text-gray-500">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-800 capitalize">{s.subjectName}</td>
                    <td className="p-3 text-gray-600 max-w-xs truncate">
                      {s.description || "—"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setTeachersModalSubject(s)}
                        className="inline-flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm hover:text-orange-500 hover:border-orange-300"
                      >
                        <FaUserPlus />
                        Teachers
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {addOpen && selectedClass && (
        <AddSubjectModal
          schoolId={schoolId}
          classroomId={selectedClass.classroomId}
          classroomName={selectedClass.name}
          onClose={() => setAddOpen(false)}
          onAdded={refresh}
        />
      )}

      {teachersModalSubject && (
        <SubjectTeachersModal
          schoolId={schoolId}
          subject={teachersModalSubject}
          onClose={() => setTeachersModalSubject(null)}
        />
      )}
    </div>
  );
};

export default TeacherSubjects;