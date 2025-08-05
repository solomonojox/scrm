// src/pages/Student/Student.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from "../../../Store/classroomSlice";
import { guardianService } from "../../../Services/Guardian/guardian";
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from "../../../Store/Guardian/guardianSlice";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from "../../../Store/Teachers/teacherSlice";
import { sessionService } from "../../../Services/Session";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";
// import { StudentType } from "../../../Types/Student/studentTypes";

const AdminStudents: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getStudent.loading);
  const error = useSelector((state: RootState) => state.getStudent.error);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<'all' | number>('all');
  const [editData, setEditData] = useState<any>(null);
  const recordsPerPage = 5;

  // Filter students based on search and class filter
  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    // Apply class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter((student: any) =>
        student.enteredClass === classFilter
      );
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((student: any) =>
        student.firstname?.toLowerCase().includes(query) ||
        student.lastname?.toLowerCase().includes(query) ||
        student.homeAddress?.toLowerCase().includes(query) ||
        student.guardianId?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, classFilter]);

  // Pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch students
  useEffect(() => {
    if (!fetchedLoading) {
      fetchStudents();
    }
  }, [dispatch]);

  const fetchStudents = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchClassroomsStart());
    dispatch(fetchGuardiansStart());
    dispatch(fetchTeacherStart());
    dispatch(fetchSessionStart());
    try {
      const data = await studentService.getAll();
      const classRoom = await classroomService.getAllClassrooms();
      const guardian = await guardianService.getAll();
      const teachers = await teacherService.getAll();
      const session = await sessionService.getAllRegisteredSessions();
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

  const handleAddStudent = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmitSuccess = () => {
    setIsModalOpen(false);
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <ToastContainer />
      <div className="max-w-full mx-auto">
        {/* Header */}
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
                src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                className="w-14 h-14 rounded-full"
                alt="Admin"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">Gold Academy</div>
                <div className="text-gray-400">Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Component */}
        <StudentTable
          students={currentRecords}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onAddStudent={handleAddStudent}
          searchQuery={searchQuery}
          classFilter={classFilter}
          onClassFilterChange={setClassFilter}
          onRefresh={fetchStudents}
          setEditData={setEditData}
        />

        {/* Form Modal */}
        {isModalOpen && (
          <StudentForm
            onClose={() => setIsModalOpen(false)}
            onSubmitSuccess={handleFormSubmitSuccess}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminStudents;