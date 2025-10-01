import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FaTimes, FaFilter, FaSync, FaSearch } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import imageAssets from "../../../assets/imageAssets";
import { classrooms } from "../../../Types/classroomTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {
  fetchClassroomStudentsFailure,
  fetchClassroomStudentsStart,
  fetchClassroomStudentsSuccess,
} from "../../../Store/Admin/classroomStudentsSlice";
import { classroomService } from "../../../Services/Classroom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { schoolFeeService } from "../../../Services/Schfee";

interface ViewClassroomModalProps {
  closeViewModal: () => void;
  classroomDetails?: classrooms;
}

type PaymentFilter = "all" | "paid" | "unpaid";

interface StudentWithPayment extends classrooms {
  hasPaid?: boolean;
}

const ViewClassroomModal: React.FC<ViewClassroomModalProps> = ({
  closeViewModal,
  classroomDetails,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getStudentsByClassId.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getStudentsByClassId.loading);
  const error = useSelector((state: RootState) => state.getStudentsByClassId.error);
  
  const [teacherFirstname, setTeacherFirstname] = useState<string>("");
  const [teacherLastname, setTeacherLastname] = useState<string>("");
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [currentSession, setCurrentSession] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [showPaymentFilter, setShowPaymentFilter] = useState(false);
  
  const classroomId = classroomDetails?.classroomId;
  const teacherId = classroomDetails?.teacherId;
  const recordsPerPage = 5;

  // Fetch classroom students - memoized with useCallback
  const fetchClassroomStudents = useCallback(async () => {
    if (!classroomId || !teacherId) return;
    
    dispatch(fetchClassroomStudentsStart());
    try {
      const data = await classroomService.getStudentsByClassroomId(classroomId);
      
      // Extract session from first student
      const session = data[0]?.currentSession || "";
      setCurrentSession(session);
      
      // Fetch teacher and fee data in parallel
      const [teacherData, feeData] = await Promise.all([
        teacherService.getById(teacherId),
        session ? schoolFeeService.getClassFeeForSession(classroomId, session) : Promise.resolve(0)
      ]);

      setTeacherFirstname(teacherData?.firstname || "");
      setTeacherLastname(teacherData?.lastname || "");
      setFeeAmount(feeData || 0);

      dispatch(fetchClassroomStudentsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
    }
  }, [classroomId, teacherId, dispatch]);

  // Fetch on mount only
  useEffect(() => {
    fetchClassroomStudents();
  }, [fetchClassroomStudents]);

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    const total = fetchedRecord.length;
    // TODO: Replace with actual payment status from API
    // This assumes you have a hasPaid property or similar
    const paid = fetchedRecord.filter((s: StudentWithPayment) => s.hasPaid).length;
    const unpaid = total - paid;
    
    return { total, paid, unpaid };
  }, [fetchedRecord]);

  // Filter records based on search and payment filter
  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    // Payment filter - TODO: Replace with actual payment status field
    if (paymentFilter !== "all") {
      filtered = filtered.filter((student: StudentWithPayment) => {
        if (paymentFilter === "paid") return student.hasPaid;
        if (paymentFilter === "unpaid") return !student.hasPaid;
        return true;
      });
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((student: classrooms) =>
        student.firstname?.toLowerCase().includes(query) ||
        student.lastname?.toLowerCase().includes(query) ||
        student.studentNo?.toLowerCase().includes(query) ||
        student.gender?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, paymentFilter]);

  // Pagination calculations
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const totalRecords = filteredRecords.length;

  // Export functions
  const exportToExcel = () => {
    const exportData = filteredRecords.map((student: classrooms, index: number) => ({
      SN: index + 1,
      StudentID: student.studentNo,
      FirstName: student.firstname,
      LastName: student.lastname,
      Gender: student.gender,
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, `${classroomDetails?.name}_students.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `${classroomDetails?.name} - Student List`;
    const headers = [["SN", "Student ID", "First Name", "Last Name", "Gender"]];

    const data = filteredRecords.map((student: classrooms, index: number) => [
      index + 1,
      student.studentNo || "",
      student.firstname || "",
      student.lastname || "",
      student.gender || "",
    ]);

    doc.text(title, 14, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 126, 0] },
    });

    doc.save(`${classroomDetails?.name}_students.pdf`);
  };

  // Event handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRecords.map((c) => c.classroomId));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });
  };

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={fetchClassroomStudents}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b sticky top-0 z-10">
          <h1 className="text-lg sm:text-2xl font-semibold text-gray-800">
            View Classroom
          </h1>
          <button
            onClick={closeViewModal}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-60px)]">
          {/* Orange Background Container */}
          <div className="bg-orange-500 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              {/* Form Section */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[120px]">
                      Name:
                    </label>
                    <input
                      type="text"
                      value={classroomDetails?.name || ""}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[120px]">
                      Capacity:
                    </label>
                    <input
                      type="text"
                      value={classroomDetails?.capacity || ""}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[120px]">
                      Teacher Name:
                    </label>
                    <input
                      type="text"
                      value={`${teacherFirstname} ${teacherLastname}`.trim() || "Loading..."}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[120px]">
                      Total Students:
                    </label>
                    <input
                      type="text"
                      value={paymentStats.total}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[160px]">
                      School Fee:
                    </label>
                    <input
                      type="text"
                      value={formatAmount(feeAmount)}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[160px]">
                      Students Paid:
                    </label>
                    <input
                      type="text"
                      value={paymentStats.paid}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-white font-semibold text-sm min-w-[160px]">
                      Students Owing:
                    </label>
                    <input
                      type="text"
                      value={paymentStats.unpaid}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 border border-white/50 text-white placeholder-white/70 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Book Image */}
              <div className="flex-shrink-0 flex justify-center lg:justify-end">
                <div className="w-32 h-32 lg:w-40 lg:h-40">
                  <img
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    src={imageAssets.book}
                    alt="book"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8">
            {/* Search Bar */}
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80 mb-4">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>

            {/* Breadcrumb & Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <p className="text-sm text-gray-600">
                Classroom{" "}
                <span className="text-orange-500 font-semibold">
                  : All Students in {classroomDetails?.name}
                </span>
              </p>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <button
                    onClick={() => setShowPaymentFilter(!showPaymentFilter)}
                    className="flex items-center gap-2 border px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    <FaFilter className="text-orange-500" />
                    <span className="text-sm">Filter</span>
                  </button>
                  {showPaymentFilter && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                      <div className="py-1">
                        {[
                          { value: "all", label: "All Students" },
                          { value: "paid", label: "Paid" },
                          { value: "unpaid", label: "Unpaid" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setPaymentFilter(option.value as PaymentFilter);
                              setShowPaymentFilter(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              paymentFilter === option.value
                                ? "bg-orange-100 text-orange-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={exportToExcel}
                  title="Export to Excel"
                  className="border p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <img className="h-6 w-6" src={imageAssets.excelLogo} alt="Excel" />
                </button>

                <button
                  onClick={exportToPDF}
                  title="Export to PDF"
                  className="border p-2 rounded hover:bg-gray-100 transition-colors"
                >
                  <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
                </button>

                <button
                  onClick={fetchClassroomStudents}
                  title="Refresh"
                  className="border p-2 rounded hover:bg-gray-100 transition-colors"
                  disabled={fetchedLoading}
                >
                  <FaSync className={`text-orange-500 ${fetchedLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Search and Filter Info */}
            {(searchQuery || paymentFilter !== "all") && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {totalRecords} result{totalRecords !== 1 ? "s" : ""}
                {searchQuery && ` for "${searchQuery}"`}
                {paymentFilter !== "all" && ` (${paymentFilter})`}
                {totalRecords === 0 && (
                  <span className="text-red-500 ml-2">- No students found</span>
                )}
              </div>
            )}

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll && currentRecords.length > 0}
                        onChange={toggleSelectAll}
                        disabled={currentRecords.length === 0}
                        className="cursor-pointer w-4 h-4"
                      />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">SN</th>
                    <th className="px-4 py-3 text-left font-semibold">Photo</th>
                    <th className="px-4 py-3 text-left font-semibold">Student ID</th>
                    <th className="px-4 py-3 text-left font-semibold">First Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Last Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchedLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        {searchQuery || paymentFilter !== "all"
                          ? "No students found matching your criteria"
                          : "No students in this classroom"}
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((student, index) => (
                      <tr
                        key={student.classroomId || index}
                        className={`border-t hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(student.classroomId)}
                            onChange={() => toggleCheckbox(student.classroomId)}
                            className="cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                        <td className="px-4 py-3">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student.studentNo}`}
                            alt={`${student.firstname} ${student.lastname}`}
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="px-4 py-3">{student.studentNo || "N/A"}</td>
                        <td className="px-4 py-3">{student.firstname || "N/A"}</td>
                        <td className="px-4 py-3">{student.lastname || "N/A"}</td>
                        <td className="px-4 py-3">{student.gender || "N/A"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentRecords.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 mt-4 text-sm text-gray-600">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-6 py-2 border rounded transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  Prev
                </button>
                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                  <span className="text-gray-500 ml-2">({totalRecords} total)</span>
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-2 border rounded transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClassroomModal;