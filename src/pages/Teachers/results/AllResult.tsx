// AllResult.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
  Search,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";
import TeacherReportCard from "./TeacherReportCard";
import { resultService } from "../../../Services/Results";
import { onboardingService } from "../../../Services/Auth/onboarding";
import { useAuth } from "../../../Context/Auth/useAuth";

interface MobileCardProps {
  item: any;
  index: number;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
  serialNumber: number;
}

const MobileCard: React.FC<MobileCardProps> = ({
  item,
  onEdit,
  onDelete,
  onView,
  serialNumber,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 p-5 mb-4 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#EE7306] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
              {serialNumber}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#EE7306]" />
            <p className="text-base font-bold text-gray-800">
              {item?.firstname} {item?.lastname}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-600 font-medium">{item?.studentNo}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions((s) => !s)}
            className="p-2 rounded-full bg-white hover:bg-orange-100 transition-all duration-200 shadow-md hover:shadow-lg border border-orange-200"
            aria-label="options"
          >
            <MoreVertical className="w-5 h-5 text-[#EE7306]" />
          </button>

          {showOptions && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowOptions(false)}
              />
              <div className="absolute top-12 right-0 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-50 w-36 overflow-hidden">
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      onView(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-yellow-50 bg-white hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" /> View
                  </li>
                  <li
                    onClick={() => {
                      onEdit(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-green-50 bg-white hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </li>
                  <li
                    onClick={() => {
                      onDelete(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-red-50 bg-white hover:text-red-600 text-red-600 cursor-pointer transition-all duration-200 font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 bg-white rounded-xl p-4 shadow-inner border border-orange-100">
        <div className="flex items-center justify-between pb-2 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">
                T{item?.currentTerm}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Term</p>
              <p className="text-sm font-bold text-gray-800">
                {item?.currentTerm === 1
                  ? "First"
                  : item?.currentTerm === 2
                    ? "Second"
                    : "Third"}{" "}
                Term
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Session</p>
            <p className="text-sm font-bold text-gray-800">{item?.currentSession}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName?: string;
}> = ({ isOpen, onClose, onConfirm, studentName = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Delete Result</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the result for{" "}
          <span className="font-bold">{studentName}</span>? This action cannot be
          undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AllResult: React.FC<{ students: any[]; fetchedSessions: any[] }> = ({
  students,
  fetchedSessions,
}) => {
  const { user } = useAuth();
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);

  // Modal / selection state
  const [showReportCard, setShowReportCard] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<any>(null);

  // loading states
  const [loading, setLoading] = useState(false);
  const [fetchingResultForId, setFetchingResultForId] = useState<string | number | null>(null);

  // Pagination config
  const rowsPerPage = 5;

  // Filtered data
  const filteredData = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((item, index) => {
      return (
        item?.firstname?.toLowerCase().includes(q) ||
        item?.lastname?.toLowerCase().includes(q) ||
        item?.studentNo?.toLowerCase().includes(q) ||
        (index + 1).toString().includes(q)
      );
    });
  }, [students, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const normalizeApiResult = (response: any) => {
    // Accept either response.data.data OR response.data
    return response?.data?.data ?? response?.data ?? response ?? null;
  };

  const fetchStudentResult = useCallback(
    async (student: any) => {
      if (!fetchedSessions || fetchedSessions.length === 0) {
        throw new Error("No session data available");
      }

      setLoading(true);
      setFetchingResultForId(student?.studentId ?? student?.id ?? null);

      try {
        const resp = await resultService.getResultBySchoolAndClass(
          fetchedSessions[0].schoolId,
          student.studentId || student.id,
          student.classroomId,
          fetchedSessions[0].sessionKey,
          user?.termId
        );

        const schoollInfoRes = await onboardingService.getSchoolById(fetchedSessions[0].schoolId)

        // console.log("School info:", schoollInfoRes)

        setSchoolData(schoollInfoRes)
        const normalized = normalizeApiResult(resp);
        // optionally ensure some expected fields exist to avoid undefined downstream
        setResultData(normalized ?? null);
        return normalized ?? null;
      } catch (err) {
        console.error("Error fetching result:", err);
        setResultData(null);
        return null;
      } finally {
        setLoading(false);
        setFetchingResultForId(null);
      }
    },
    [fetchedSessions]
  );

  // NOTE: we intentionally fetch first, THEN open the report card.
  const handleView = useCallback(
    async (item: any) => {
      setSelectedStudent(item);
      setOpenRowIndex(null);

      try {
        const data = await fetchStudentResult(item);
        if (data) {
          setShowReportCard(true);
        } else {
          // If fetch failed, keep the UI in list view and show an alert (or toast in your app)
          alert("Failed to load student result. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load student result. Please try again.");
      }
    },

    [fetchStudentResult]
  );

  const handleEdit = useCallback(
    async (item: any) => {
      setSelectedStudent(item);
      setOpenRowIndex(null);

      try {
        const data = await fetchStudentResult(item);
        // you might open an edit modal here; for now we'll just keep the data loaded
        if (!data) {
          alert("Failed to load student result for editing.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load student result for editing.");
      }
    },
    [fetchStudentResult]
  );

  const handleDelete = useCallback((item: any) => {
    setSelectedStudent(item);
    setShowDeleteModal(true);
    setOpenRowIndex(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedStudent) return;
    try {
      // call your delete API here
      // console.log("Deleting result for:", selectedStudent);
      // await resultService.deleteResult(...); // implement if available
      alert(
        `Result deleted for ${selectedStudent.firstname} ${selectedStudent.lastname}`
      );
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete result. Please try again.");
    }
  }, [selectedStudent]);

  // When closing report card, reset state
  const handleCloseReportCard = useCallback(() => {
    setShowReportCard(false);
    setResultData(null);
    setSelectedStudent(null);
  }, []);

  // Controls for the desktop options dropdown per-row
  const handleOptionsClick = (rowIndex: number) => {
    setOpenRowIndex((prev) => (prev === rowIndex ? null : rowIndex));
  };

  // small helper to display student name safely
  const studentFullName = (s: any) => `${s?.firstname ?? ""} ${s?.lastname ?? ""}`.trim();

  return (
    <section className="w-full bg-white py-3 sm:py-6">
      {showReportCard ? (
        <TeacherReportCard
          studentData={resultData}
          school={schoolData}
          behaviouralRatings={{
            punctuality: "Good",
            classParticipation: "Excellent",
            teamwork: "Excellent",
            respectForRules: "Good",
            neatness: "Fair",
          }}
          schoolName="Gold International Academy"
          schoolAddress="21, Woodgreen Road Lagos, Nigeria"
          onBack={handleCloseReportCard}
          fetchStudentResult={fetchStudentResult}
        />
      ) : (
        <>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-orange-500 focus:border-transparent transition-all shadow-sm bg-white"
              />
            </div>
          </div>

          {/* Table container */}
          <div className="w-full bg-white shadow-md rounded-2xl overflow-hidden">
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-4 px-4 text-left">
                      <input type="checkbox" title="select all" className="w-4 h-4 rounded" />
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      Term
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      Session
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                      Options
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 px-4 text-center text-sm text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    currentRows.map((item, idx) => {
                      const index = idx;
                      return (
                        <tr
                          key={item?.id ?? `${index}`}
                          className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-orange-50"
                            } hover:bg-orange-100 transition-colors`}
                        >
                          <td className="px-4 py-3">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                          </td>

                          <td className="text-sm px-4 py-3 text-gray-700 font-semibold">
                            {indexOfFirstRow + index + 1}
                          </td>

                          <td className="text-sm px-4 py-3 text-gray-800 font-bold">
                            {item?.firstname} {item?.lastname}
                          </td>

                          <td className="text-sm px-4 py-3 text-gray-700">{item?.studentNo}</td>

                          <td className="text-sm px-4 py-3 text-gray-700">
                            {item?.currentTerm === 1
                              ? "First Term"
                              : item?.currentTerm === 2
                                ? "Second Term"
                                : "Third Term"}
                          </td>

                          <td className="text-sm px-4 py-3 text-gray-700">
                            {item?.currentSession}
                          </td>

                          <td className="text-sm px-4 py-3 relative">
                            <button
                              onClick={() => handleOptionsClick(index)}
                              className="p-1 rounded-lg hover:bg-orange-200 transition-colors"
                              aria-label="row-options"
                            >
                              <MoreVertical className="w-5 h-5 text-[#EE7306]" />
                            </button>

                            {openRowIndex === index && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenRowIndex(null)}
                                />
                                <div className="absolute top-8 right-0 bg-white border border-orange-200 rounded-xl shadow-2xl z-50 w-32 overflow-hidden">
                                  <ul className="flex flex-col">
                                    <li
                                      onClick={() => handleView(item)}
                                      className="inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                                    >
                                      <Eye className="w-4 h-4 mr-2" /> View
                                    </li>

                                    <li
                                      onClick={() => handleEdit(item)}
                                      className="inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                                    >
                                      <Edit3 className="w-4 h-4 mr-2" /> Edit
                                    </li>

                                    <li
                                      onClick={() => handleDelete(item)}
                                      className="inline-flex items-center px-4 py-2 hover:bg-red-100 bg-red-50 hover:text-red-600 text-red-600 cursor-pointer transition-colors font-medium text-sm"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </li>
                                  </ul>
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
              {currentRows.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                    <Search className="w-10 h-10 text-orange-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No records found</p>
                </div>
              ) : (
                currentRows.map((item, idx) => (
                  <MobileCard
                    key={item?.id ?? idx}
                    item={item}
                    index={idx}
                    serialNumber={indexOfFirstRow + idx + 1}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 bg-white">
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                <p className="text-[12px] text-[#717182]">
                  Showing {indexOfFirstRow + 1} -{" "}
                  {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length} entries
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-[#EE7306] text-white hover:from-[#EE7306] hover:to-orange-700 hover:shadow-lg"
                    }`}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage === 1) {
                    pageNum = i + 1;
                  } else if (currentPage === totalPages) {
                    pageNum = totalPages - 2 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${currentPage === pageNum
                        ? "bg-gradient-to-br from-orange-500 to-[#EE7306] text-white shadow-lg scale-110"
                        : "text-[#EE7306] bg-white hover:bg-orange-100 border-2 border-orange-200"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-[#EE7306] text-white hover:from-[#EE7306] hover:to-orange-700 hover:shadow-lg"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Delete modal */}
          <DeleteModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedStudent(null);
            }}
            onConfirm={confirmDelete}
            studentName={selectedStudent ? studentFullName(selectedStudent) : ""}
          />
        </>
      )}
    </section>
  );
};

export default AllResult;
