import React, { useEffect, useMemo, useState } from "react";
import { FaTimes, FaChevronDown, FaFilter, FaSync, FaEye, FaSearch } from "react-icons/fa";
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
import Adminheader from "../../../pages/Admin/Adminheader";
import AdminSidebar from "../../../pages/Admin/AdminSidebar";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { teacherService } from "../../../Services/Teachers/TeacherService";

interface Student {
  sn: number;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female";
}

interface ViewClassroomModalProps {
  closeViewModal: () => void;
  classroomDetails?: classrooms;
  students?: Student[];
}

type ReligionFilter = "all" | "male" | "female";

const ViewClassroomModal: React.FC<ViewClassroomModalProps> = ({
  closeViewModal,
  classroomDetails,
  students: initialStudents,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector((state: RootState) => state.getStudentsByClassId.listRecords);
  const fetchedLoading = useSelector((state: RootState) => state.getStudentsByClassId.loading);
  const error = useSelector((state: RootState) => state.getStudentsByClassId.error);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [teacherFirstname, setTeacherFirstname] = useState<string>("");
  const [teacherLastname, setTeacherLastname] = useState<string>("");
  const classroomId: any = classroomDetails?.classroomId;
  const teacherId: any = classroomDetails?.teacherId;

  useEffect(() => {
    if (!fetchedLoading) {
      fetchClassroomStudents();
    }
  }, [dispatch]);

  const fetchClassroomStudents = async () => {
    dispatch(fetchClassroomStudentsStart());
    try {
      const data = await classroomService.getStudentsByClassroomId(classroomId);
      const teacherData = await teacherService.getById(teacherId);
      setTeacherFirstname(teacherData?.data?.firstname);
      setTeacherLastname(teacherData?.data?.lastname);
      setTotalStudents(data.length);
      console.log(teacherData);
      dispatch(fetchClassroomStudentsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(fetchedRecord);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classroom Details");
    XLSX.writeFile(wb, "classrooms.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = "Classroom List";
    const headers = [["SchoolId", "Name", "TeacherId", "Capacity"]];

    const data = fetchedRecord.map((classroom) => [
      classroom.name || "",
      classroom.schoolId || "",
      classroom.capacity || "",
      classroom.teacherId || "",
    ]);

    doc.text(title, 14, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 165, 0] },
    });

    doc.save("classrooms.pdf");
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [religionFilter, setReligionFilter] = useState<ReligionFilter>("all");
  // const [classroomDetails, setClassroomDetails]= useState<classrooms>()
  const [showReligionFilter, setShowReligionFilter] = React.useState(false);

  const recordsPerPage = 5;

  const filteredRecords = useMemo(() => {
    let filtered = fetchedRecord;

    if (religionFilter !== "all") {
      filtered = filtered.filter(
        (classroom: classrooms) => classroom.gender?.toLowerCase() === religionFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student: classrooms) =>
          student.firstname?.toLowerCase().includes(query) ||
          student.gender ||
          student.lastname?.toLowerCase().includes(query) ||
          student.studentNo?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fetchedRecord, searchQuery, religionFilter]);

  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const totalRecords = filteredRecords.length;

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
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedIds([]);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderSearchQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  if (error) {
    return (
      <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
        <Adminheader />
        <AdminSidebar />
        <div className="flex-1 pl-64 mt-[80px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchClassroomStudents}
              className="bg-[#f07e00] hover:bg-[#d46b00] text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-end px-4 pt-2 bg-white sticky top-0 z-10">
          <button
            onClick={closeViewModal}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-lg sm:text-xl" />
          </button>
        </div>

        <h1 className="text-lg sm:text-2xl font-semibold text-center mb-6 text-gray-800">
          View Classroom
        </h1>

        <div className="overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(95vh-68px)]">
          {/* Orange Background Container */}
          <div className="bg-orange-500 p-3 md:p-6">
            {/* Main Content Container */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-2">
              {/* Form Section */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <label className="text-white font-semibold text-sm w-50 text-nowrap ">
                      Name:
                    </label>
                    <input
                      type="text"
                      value={classroomDetails?.name}
                      readOnly
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <label className="text-white font-semibold text-sm w-50 text-nowrap ">
                      Capacity:
                    </label>
                    <input
                      type="text"
                      value={classroomDetails?.capacity}
                      readOnly
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <label className="text-white font-semibold text-sm w-50 text-nowrap ">
                      Teacher Name:
                    </label>
                    <input
                      type="text"
                      value={`${teacherFirstname} ${teacherLastname}`}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <label className="text-white font-semibold text-sm w-32 text-nowrap ">
                      Total No of Students:
                    </label>
                    <input
                      type="text"
                      value={totalStudents}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col md:flex-row gap-1">
                    <label className="text-white font-semibold md:w-[400px] text-nowrap">
                      School Fee (₦):
                    </label>
                    <input
                      type="text"
                      // value={formData.schoolFee}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-1">
                    <label className="text-white font-semibold md:w-[400px] text-nowrap">
                      Total No of Student Paid:
                    </label>
                    <input
                      type="text"
                      // value={formData.totalPayments}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-1">
                    <label className="text-white font-semibold md:w-[400px] text-nowrap">
                      Total No of Student owing:
                    </label>
                    <input
                      type="text"
                      // value={formData.totalOwing}
                      className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-white text-white text-sm sm:text-base rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                </div>
              </div>

              {/* Book Image */}
              <div className="flex-shrink-0 flex justify-center lg:justify-end mt-4 lg:mt-0">
                <div className=" ">
                  <img
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
                    src={imageAssets.book}
                    alt="book"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 md:p-8">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search"
                value={headerSearchQuery}
                onChange={handleHeaderSearchChange}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
            {/* Breadcrumb & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                Classroom{" "}
                <span className="text-orange-500 font-semibold">
                  : All Students in {classroomDetails?.name}
                </span>
              </p>
              <div className="gap-4 flex items-center sm:flex-wrap">
                <div className="relative">
                  <button
                    onClick={() => setShowReligionFilter(!showReligionFilter)}
                    className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
                  >
                    <FaFilter className="text-orange-500" />
                    <span>Filter</span>
                  </button>
                  {showReligionFilter && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setReligionFilter("all");
                            setShowReligionFilter(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            religionFilter === "all"
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Gender
                        </button>
                        <button
                          onClick={() => {
                            setReligionFilter("male");
                            setShowReligionFilter(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            religionFilter === "male"
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Male
                        </button>
                        <button
                          onClick={() => {
                            setReligionFilter("female");
                            setShowReligionFilter(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            religionFilter === "female"
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          Female
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={exportToExcel}
                  title="Export to Excel"
                  className="border p-2 rounded hover:bg-gray-100"
                >
                  <img className="h-6 w-6" src={imageAssets.excelLogo} alt="Excel export" />
                </button>

                <button
                  onClick={exportToPDF}
                  title="Export to PDF"
                  className="border p-2 rounded hover:bg-gray-100"
                >
                  <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
                </button>

                <button
                  onClick={fetchClassroomStudents}
                  title="Refresh"
                  className="border p-2 rounded hover:bg-gray-100"
                >
                  <FaSync className="text-orange-500" />
                </button>
              </div>
            </div>

            {/* Search and Filter Info */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              {(searchQuery || religionFilter !== "all") && (
                <div className="text-sm text-gray-600">
                  Showing {totalRecords} result{totalRecords !== 1 ? "s" : ""}
                  {searchQuery && ` for "${searchQuery}"`}
                  {religionFilter !== "all" && ` (Filtered by ${religionFilter})`}
                  {totalRecords === 0 && (
                    <span className="text-red-500 ml-2">No student found</span>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 min-w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="cursor-pointer w-4 h-4"
                      />
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      SN
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      Photo
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      Student Id
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      First Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      Last Name
                    </th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-300">
                      Gender
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-gray-500">
                        {searchQuery
                          ? "No student found matching your search"
                          : "No student available"}
                      </td>
                    </tr>
                  ) : (
                    currentRecords.map((c, index) => (
                      <tr
                        key={index}
                        className={`border-t hover:bg-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(c.classroomId)}
                            onChange={() => toggleCheckbox(c.classroomId)}
                            className="cursor-pointer w-4 h-4"
                          />
                        </td>
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${c.studentNo}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="p-3">{c.studentNo}</td>
                        <td className="p-3">{c.firstname}</td>
                        <td className="p-3">{c.lastname}</td>
                        <td className="p-3">{c.gender}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {currentRecords.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 mb-20 text-sm text-gray-600">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                  Page {currentPage} of {totalPages}
                  {searchQuery && ` (${totalRecords} results)`}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
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
      </div>
    </div>
  );
};

export default ViewClassroomModal;
