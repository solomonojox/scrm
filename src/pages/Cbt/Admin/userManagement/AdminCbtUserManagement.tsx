import React, { useState, useMemo, useEffect } from "react";
import { UserPlus } from "lucide-react";
import AdminCbtUserTable from "./AdminCbtUserTable";
import AdminCbtUserForm from "./AdminCbtUserForm";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useAuth } from "../../../../Context/Auth/useAuth";
import {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
} from "../../../../Store/Student/studentSlice";
import {
  fetchTeacherStart,
  fetchTeacherSuccess,
  fetchTeacherFailure,
} from "../../../../Store/Teachers/teacherSlice";

const AdminCbtUserManagement = () => {
  // Old UI logic — still works
  const [activeTab, setActiveTab] = useState<any>("students");
  const [showModal, setShowModal] = useState(false);

  // New Logic
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const fetchedStudentRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedTeacherRecord = useSelector((state: RootState) => state.getTeacher.listRecords);
  const fetchedStudentLoading = useSelector((state: RootState) => state.getStudent.loading);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // Fetch students & teachers on mount
  useEffect(() => {
    if (!fetchedStudentLoading && cbtUser?.schoolId) {
      fetchStudents();
    }
  }, [cbtUser?.schoolId]);

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery("");
  }, [activeTab]);

  const fetchStudents = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchTeacherStart());

    try {
      const data = await cbtAdminService.getAllStudents(cbtUser?.schoolId);
      const teachers = await cbtAdminService.getAllTeachers(cbtUser?.schoolId);

      dispatch(fetchStudentsSuccess(data?.data));
      dispatch(fetchTeacherSuccess(teachers?.data));
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchStudentsFailure(msg));
      dispatch(fetchTeacherFailure(msg));
    }
  };

  // Filter based on active tab
  const filteredRecords = useMemo(() => {
    // Choose the correct data source based on active tab
    const sourceData = activeTab === "students" ? fetchedStudentRecord : fetchedTeacherRecord;

    // Ensure we always work with an array
    let filtered = Array.isArray(sourceData) ? sourceData : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((record: any) => {
        if (activeTab === "students") {
          // Student search fields
          return (
            record.firstname?.toLowerCase().includes(q) ||
            record.lastname?.toLowerCase().includes(q) ||
            record.homeAddress?.toLowerCase().includes(q) ||
            record.guardianId?.toLowerCase().includes(q)
          );
        } else {
          // Teacher search fields (adjust field names based on your data structure)
          return (
            record.firstname?.toLowerCase().includes(q) ||
            record.lastname?.toLowerCase().includes(q) ||
            record.email?.toLowerCase().includes(q) ||
            record.subject?.toLowerCase().includes(q) ||
            record.phoneNumber?.toLowerCase().includes(q)
          );
        }
      });
    }

    return filtered;
  }, [fetchedStudentRecord, fetchedTeacherRecord, searchQuery, activeTab]);

  // Pagination Logic with safety checks
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  return (
    <div className="p-6 font-sans">
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
            {/* Tabs */}
            <div className="bg-orange-100 rounded-full flex p-1">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-1 rounded-full text-sm font-medium ${activeTab === "students" ? "bg-orange-500 text-white" : "text-gray-700"
                  }`}
              >
                Students
              </button>

              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-1 rounded-full text-sm font-medium ${activeTab === "teachers" ? "bg-orange-500 text-white" : "text-gray-700"
                  }`}
              >
                Teachers
              </button>
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {activeTab === "students" ? "Add Student" : "Add Teacher"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-orange-100 rounded-lg px-4 py-2"
          />
        </div>

        {(
          /* TABLE */
          <AdminCbtUserTable
            activeTab={activeTab}
            users={currentRecords}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AdminCbtUserForm activeTab={activeTab} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminCbtUserManagement;
