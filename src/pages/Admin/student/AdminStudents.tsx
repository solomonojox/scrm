import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchStudentsFailure,
  fetchStudentsStart,
  fetchStudentsSuccess,
} from "../../../Store/Student/studentSlice";
import { studentService } from "../../../Services/Student/StudentService";
import StudentTable from "./StudentTable";
import StudentForm from "./StudentForm";
import { FaRegBell, FaSearch } from "react-icons/fa";
import { BiMessageAlt } from "react-icons/bi";
import { classroomService } from "../../../Services/Classroom";
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from "../../../Store/Admin/classroomSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from "../../../Store/Guardian/guardianSlice";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from "../../../Store/Teachers/teacherSlice";
import { sessionService } from "../../../Services/Session";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";
import { useAuth } from "../../../Context/Auth/useAuth";
import AdminStudentDetails from "./AdminStudentDetails";

const AdminStudents: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getStudent.loading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<'all' | number>('all');
  const [editData, setEditData] = useState<any>(null);
  const [viewData, setViewData] = useState<any>(null);   // ← new

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (classFilter !== 'all') {
      filtered = filtered.filter((student: any) =>
        student.enteredClass === classFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((student: any) =>
        student.firstname?.toLowerCase().includes(query) ||
        student.lastname?.toLowerCase().includes(query) ||
        student.address?.toLowerCase().includes(query) ||
        student.classroomName?.toLowerCase().includes(query) ||
        student.guardianName?.toLowerCase().includes(query) ||
        student.guardianId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, classFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    if (!fetchedLoading) fetchStudents();
  }, [dispatch]);

  const fetchStudents = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchClassroomsStart());
    dispatch(fetchGuardiansStart());
    dispatch(fetchTeacherStart());
    dispatch(fetchSessionStart());
    try {
      const data        = await studentService.getAll(localStorage.getItem('schoolId'));
      const classRoom   = await classroomService.getAllClassrooms(localStorage.getItem('schoolId'));
      const guardian    = await guardianService.getAll(localStorage.getItem('schoolId'));
      const teachers    = await teacherService.getAll(localStorage.getItem('schoolId'));
      const session     = await sessionService.getAllRegisteredSessions(localStorage.getItem('schoolId'));
      dispatch(fetchStudentsSuccess(data));
      dispatch(fetchClassroomsSuccess(classRoom));
      dispatch(fetchGuardiansSuccess(guardian));
      dispatch(fetchTeacherSuccess(teachers));
      dispatch(fetchSessionSuccess(session));
    } catch (err) {
      dispatch(fetchStudentsFailure((err as Error).message));
      dispatch(fetchClassroomsFailure((err as Error).message));
      dispatch(fetchGuardiansFailure((err as Error).message));
      dispatch(fetchTeacherFailure((err as Error).message));
      dispatch(fetchSessionFailure((err as Error).message));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await studentService.delete(id);
      await fetchStudents();
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditFromDetails = (student: any) => {
    setEditData(student);
    setViewData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">

        {/* Header — always visible */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-1 mb-4">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <div className="flex items-center rounded-full px-3 py-1 space-x-2">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                className="w-14 h-14 rounded-full"
                alt="Admin"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">{user?.schoolName.toLocaleUpperCase()}</div>
                <div className="text-gray-400">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail view or table */}
        {viewData ? (
          <AdminStudentDetails
            student={viewData}
            onBack={() => setViewData(null)}
            onEdit={handleEditFromDetails}
            onDelete={async (id: any) => {
              await handleDelete(id);
              setViewData(null);
            }}
          />
        ) : (
          <StudentTable
            students={currentRecords}
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onAddStudent={() => setIsModalOpen(true)}
            searchQuery={searchQuery}
            classFilter={classFilter}
            onClassFilterChange={setClassFilter}
            onRefresh={fetchStudents}
            setEditData={setEditData}
            onViewStudent={setViewData}   // ← pass down to table
          />
        )}

        {isModalOpen && (
          <StudentForm
            onClose={() => { setIsModalOpen(false); setEditData(null); }}
            onSubmitSuccess={() => { setIsModalOpen(false); fetchStudents(); }}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminStudents;