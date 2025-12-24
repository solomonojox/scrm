// src/components/Student/SchoolFeeTable.tsx
import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaFilter, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import { fetchClassroomStudentsFailure, fetchClassroomStudentsStart, fetchClassroomStudentsSuccess } from "../../../Store/Admin/classroomStudentsSlice";
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from "../../../Store/sessionSlice";
import { classroomService } from "../../../Services/Classroom";
import { sessionService } from "../../../Services/Session";
import { useAuth } from "../../../Context/Auth/useAuth";
import { resultService } from "../../../Services/Results";
import { onboardingService } from "../../../Services/Auth/onboarding";

interface resultRecord {
  id: number;
  SN: number;
  StudentID: number;
  Class: string;
  Term: string;
  Session: string;
  Assessment: string;
  TeachersName: string;
  Action: number | string;
}

interface StudentTableProps {
  resultRecord: any[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  classFilter: "all" | string;
  onClassFilterChange: (filter: "all" | string) => void;
  //   onRefresh: () => void;
  setEditData: (data: any) => void;
}

const ResultTable: React.FC<StudentTableProps> = ({
  resultRecord,
  totalPages,
  currentPage,
  onPageChange,
  searchQuery,
  classFilter,
  onClassFilterChange,
  //   onRefresh,
  setEditData,
}) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(resultRecord.map((s) => s.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleCheckbox = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const fetchedRecord: any = useSelector((state: RootState) => state.getGuardian.listRecords);
  const fetchedSessions = useSelector((state: RootState) => state.getSession.listRecords);
  const [loading, setLoading] = useState<boolean>(false);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [fetchingResultForId, setFetchingResultForId] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);
  const [showReportCard, setShowReportCard] = useState<boolean>(false);

  useEffect(() => {
    fetchStudentSessionAndClass();
    // fetchStudentSessionAndClass(selectedClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Fetch students by classroom ID
  const fetchStudentSessionAndClass = async () => {
    dispatch(fetchClassroomStudentsStart());
    dispatch(fetchSessionStart());
    try {
      // const studentData = await classroomService.getStudentsByClassroomId(classId);
      const data = await sessionService.getAllRegisteredSessions(user?.schoolId);
      dispatch(fetchSessionSuccess(data));
      // dispatch(fetchClassroomStudentsSuccess(studentData));

    } catch (err) {
      console.error("Fetch students error:", err);
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
      dispatch(fetchSessionFailure((err as Error).message));
    }
  };

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
          student.currentTerm
        );

        const schoollInfoRes = await onboardingService.getSchoolById(fetchedSessions[0].schoolId)

        // console.log("School info:", schoollInfoRes)

        setSchoolData(schoollInfoRes)
        const normalized = normalizeApiResult(resp);
        // optionally ensure some expected fields exist to avoid undefined downstream
        setResultData(normalized ?? null);
        // console.log("Fetched result data:", normalized);
        navigate(`/guardian/report-card`, { state: { result: normalized } })
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

  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(resultRecord);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Result Details");
  //   XLSX.writeFile(wb, "result.xlsx");
  // };

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   const title = "School Fee List";
  //   const headers = [["School Dd", "session", "Amount", "Class Name"]];

  //   const data = resultRecord.map((s) => [
  //     s?.SN || "",
  //     s?.StudentID || "",
  //     s?.Class || "",
  //     s?.Assessment || "",
  //   ]);

  //   doc.text(title, 14, 15);
  //   autoTable(doc, {
  //     head: headers,
  //     body: data,
  //     startY: 20,
  //     styles: { fontSize: 8 },
  //     headStyles: { fillColor: [255, 165, 0] },
  //   });

  //   doc.save("schoolfee.pdf");
  // };

  return (
    <div className="">
      {/* Breadcrumb & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-[inter] mb-4">
        <p className="text-[17px] font-semibold text-gray-700 mb-4 sm:mb-0">
          Welcome back, {fetchedRecord?.firstname?.toUpperCase()} {fetchedRecord?.lastname?.toUpperCase()} View your children's results below
        </p>
        <div className="gap-4 flex items-center sm:flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 border border-gray-100 p-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              <FaFilter className="text-orange-500" />
              <span className="text-sm">Switch</span>
            </button>
            {showFilterDropdown && (
              <div className="absolute md:right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                    Your Children's Result
                  </div>
                  <button
                    onClick={() => {
                      onClassFilterChange("all");
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${classFilter === "all"
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    All children
                  </button>
                  {["Adegbenga Adekoya", "Adegbenga Oluwatosin"].map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        onClassFilterChange(name);
                        setShowFilterDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${classFilter === name
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filter Info */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center font-[inter] gap-2">
        {(searchQuery || classFilter !== "all") && (
          <div className="text-sm text-gray-600">
            Showing {resultRecord.length} result{resultRecord.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
            {classFilter !== "all" && ` ( ${classFilter} result is showing)`}
            {resultRecord.length === 0 && (
              <span className="text-red-500 ml-2">No result found</span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto py-6 md:py-2 font-[inter]">
        <h1 className="m-4 text-[18px] font-semibold text-gray-700">Result</h1>
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 min-w-[50px]">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="cursor-pointer w-[14px] h-[14px]"
                />
              </th>
              <th className="p-3 min-w-[80px]">SN</th>
              <th className="p-3 min-w-[80px]">StudentId</th>
              <th className="p-3 min-w-[80px]">Class</th>
              <th className="p-3 min-w-[80px]">Term</th>
              <th className="p-3 min-w-[80px]">Session</th>
              <th className="p-3 min-w-[80px]">Teacher's Name</th>
              <th className="p-3 min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resultRecord.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500">
                  {searchQuery ? "No result found matching your search" : "No result available"}
                </td>
              </tr>
            ) : (
              resultRecord.map((result, index) => (
                <tr
                  key={result.studentId}
                  className={`border-t hover:bg-gray-100 text-gray-600 text-sm ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(result.id)}
                      onChange={() => toggleCheckbox(result.id)}
                      className="cursor-pointer w-[14px] h-[14px]"
                    />
                  </td>

                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{result?.studentNo}</td>
                  <td className="p-3">{result?.classroom?.name}</td>
                  <td className="p-3">{result?.currentTerm}</td>
                  <td className="p-3">{result?.currentSession}</td>
                  <td className="p-3">{result?.teacher?.firstname} {result?.teacher?.lastname}</td>
                  <td
                    className="p-3 cursor-pointer hover:text-orange-500"
                    // onClick={() => navigate(`/guardian/report-card`, { state: { result } })}
                    onClick={() => handleView(result)}
                  >
                    <span className="flex items-center text-[13px] gap-2">
                      View <Eye className="w-[15px] h-[15px]" />
                    </span>
                  </td>
                </tr>
              )))}
            {/* resultRecord.map((result, index) => (
                <tr
                  key={result.id}
                  className={`border-t hover:bg-gray-100 text-gray-600 text-sm ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(result.id)}
                      onChange={() => toggleCheckbox(result.id)}
                      className="cursor-pointer w-[14px] h-[14px]"
                    />
                  </td>

                  <td className="p-3">{result?.SN}</td>
                  <td className="p-3">{result?.StudentID}</td>
                  <td className="p-3">{result?.Class}</td>
                  <td className="p-3">{result?.Term}</td>
                  <td className="p-3">{result?.Session}</td>
                  <td className="p-3">{result?.Assessment}</td>
                  <td className="p-3">{result?.TeachersName}</td>
                  <td
                    className="p-3 cursor-pointer hover:text-orange-500"
                    onClick={() => navigate(`/guardian/report-card`, { state: { result } })}
                  >
                    <span className="flex items-center text-[13px] gap-2">
                      View <Eye className="w-[15px] h-[15px]" />
                    </span>
                  </td>
                </tr>
              )))} */}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {resultRecord.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 border rounded ${currentPage === 1
              ? "bg-white text-black border-gray-600 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
            {searchQuery && ` (${resultRecord.length} results)`}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 border rounded ${currentPage === totalPages
              ? "bg-white text-black border-gray-600 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
