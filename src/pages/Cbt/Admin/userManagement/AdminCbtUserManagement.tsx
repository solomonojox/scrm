import React, { useState, useMemo, useEffect } from "react";
import { UserPlus } from "lucide-react";
import AdminCbtUserTable from "./AdminCbtUserTable";
import AdminCbtUserForm from "./AdminCbtUserForm";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";


const AdminCbtUserManagement = () => {

  // Old UI logic — still works
  const [activeTab, setActiveTab] = useState<any>("students");
  const [showModal, setShowModal] = useState(false);

  // ✅ New Logic
  const { user } = useAuth();   
  const dispatch = useDispatch<AppDispatch>();

  const fetchedRecord = useSelector((state: RootState) => state.getStudent.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getStudent.loading);

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<"all" | number>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // ✅ Fetch students & related data
  useEffect(() => {
    if (!fetchedLoading) {
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchTeacherStart());

    try {
      const schoolId: any = localStorage.getItem("schoolId");

      const data = await cbtAdminService.getAllStudents(schoolId);
      const teachers = await cbtAdminService.getAllTeachers(schoolId);


      dispatch(fetchStudentsSuccess(data));
      dispatch(fetchTeacherSuccess(teachers));

      
    } catch (err) {
      const msg = (err as Error).message;
      dispatch(fetchStudentsFailure(msg));
      dispatch(fetchTeacherFailure(msg));

    }
  };

  // ✅ Filter using your new logic
  const filteredRecords = useMemo(() => {
    // Ensure we always work with an array
    let filtered = Array.isArray(fetchedRecord) ? fetchedRecord : [];

    if (classFilter !== "all") {
      filtered = filtered.filter((student: any) => student.enteredClass === classFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student: any) =>
          student.firstname?.toLowerCase().includes(q) ||
          student.lastname?.toLowerCase().includes(q) ||
          student.homeAddress?.toLowerCase().includes(q) ||
          student.guardianId?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, classFilter]);

  // ✅ Pagination Logic with safety checks
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  // ✅ Show loading state
  if (fetchedLoading) {
    return (
      <div className="p-6 font-sans">
        <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 font-sans">
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">

        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

          <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">

            {/* ✅ Tabs */}
            <div className="bg-orange-100 rounded-full flex p-1">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeTab === "students" ? "bg-orange-500 text-white" : "text-gray-700"
                }`}
              >
                Students
              </button>

              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  activeTab === "teachers" ? "bg-orange-500 text-white" : "text-gray-700"
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

        {/* ✅ Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-orange-100 rounded-lg px-4 py-2"
          />
        </div>

        {/* ✅ TABLE */}
        <AdminCbtUserTable
          activeTab={activeTab}
          users={currentRecords}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <AdminCbtUserForm
          activeTab={activeTab}
          closeModal={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminCbtUserManagement;