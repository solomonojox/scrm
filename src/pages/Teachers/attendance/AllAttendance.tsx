import { Edit3Icon, Eye, MoreVertical, Trash2 } from "lucide-react";
import React, { useContext, useState } from "react";
import "../../../Styles/customScrollBar.css";
import AttendanceViewEdit from "./AttendanceViewEdit";
import { attendanceService } from "../../../Services/Attendance";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../Context/AppContext";

interface MobileCardProps {
  date: string;
  present: number;
  absent: number;
  late: number;
  overallPercent: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

const MobileCard: React.FC<MobileCardProps> = ({
  date,
  present,
  absent,
  late,
  overallPercent,
  onEdit,
  onDelete,
  onView,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  // Determine color based on attendance percentage
  const getPercentageColor = (percent: number): string => {
    if (percent >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (percent >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Date</p>
          <p className="text-sm font-semibold text-gray-800">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getPercentageColor(
              overallPercent
            )}`}
          >
            {overallPercent}%
          </span>

          <div className="relative">
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showOptions && (
              <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-32">
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      onView?.();
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-gray-200 rounded-t-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 inline-block mr-2" /> View
                  </li>
                  <li
                    onClick={() => {
                      onEdit?.();
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-600 text-green-600 cursor-pointer border-b border-gray-200 transition-colors"
                  >
                    <Edit3Icon className="w-4 h-4 inline-block mr-2" /> Edit
                  </li>
                  {/* <li
                    onClick={() => {
                      onDelete?.();
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-red-100 bg-red-50 hover:text-red-600 text-red-600 cursor-pointer rounded-b-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline-block mr-2" /> Delete
                  </li> */}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-600 mb-1 font-medium">Present</p>
          <p className="text-lg font-bold text-green-700">{present}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-600 mb-1 font-medium">Absent</p>
          <p className="text-lg font-bold text-red-700">{absent}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <p className="text-xs text-yellow-600 mb-1 font-medium">Late</p>
          <p className="text-lg font-bold text-yellow-700">{late}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total: {present + absent + late} students</span>
          <span className="font-medium">Attendance: {overallPercent}%</span>
        </div>
      </div>
    </div>
  );
};

const AllAttendance = ({ attendanceData, loading }: any): React.ReactElement => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  // State for view/edit functionality
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showViewEdit, setShowViewEdit] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  // Handlers for view, edit, delete
  const handleView = (item: any) => {
    console.log("View:", item);
    setSelectedItem(item);
    setViewMode("view");
    setShowViewEdit(true);
  };

  const handleEdit = (item: any) => {
    console.log("Edit:", item);
    setSelectedItem(item);
    setViewMode("edit");
    setShowViewEdit(true);
  };

  const handleDelete = (item: any) => {
    console.log("Delete:", item);
    // Implement your delete logic here
    const confirmDelete = window.confirm("Are you sure you want to delete this attendance record?");
    if (confirmDelete) {
      // Call your delete API here
      console.log("Deleting item:", item);
    }
  };

  const handleClose = () => {
    setShowViewEdit(false);
    setSelectedItem(null);
  };

  const handleSave = async (updatedData: any) => {
    console.log("Save updated data:", updatedData);

    try {
      setIsLoading(true);
      const res = await attendanceService.update(updatedData);

      if (res) {
        setShowViewEdit(false);
        setSelectedItem(null);
        notifySuccess("Attendance Updated Successfully");
        navigate("/teacher/attendance");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered data
  const filteredData = attendanceData.filter(
    (item: any) =>
      searchTerm === "" ||
      item.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.present?.toString().includes(searchTerm) ||
      item.absent?.toString().includes(searchTerm) ||
      item.late?.toString().includes(searchTerm)
  );

  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // If viewing/editing, show the AttendanceViewEdit component
  if (showViewEdit && selectedItem) {
    return (
      <AttendanceViewEdit
        attendanceItem={selectedItem}
        onClose={handleClose}
        onSave={handleSave}
        mode={viewMode}
      />
    );
  }

  // Otherwise show the normal table/list view
  return (
    <section className="w-full">
      {/* Search Input */}
      <div className="flex flex-col md:flex-row items-center gap-6 my-8">
        <div className="w-full lg:w-[80%]">
          <input
            type="text"
            placeholder="Search by date, present, absent, or late count"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#E0E0E0] rounded-md py-3 px-3 text-[12px] text-[#717182] focus:outline-none focus:border-[#EE7306]"
          />
        </div>
      </div>

      <div className="w-full md:bg-white md:shadow-[1px_0_10px_-2px_rgba(0,0,0,0.1)] rounded-md md:border">
        {/* Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto parent-scrollbar">
          <table className="w-full table-auto border-collapse min-w-[700px]">
            <thead>
              <tr className="text-left bg-gray-200 border-b border-t border-b-[#E0E0E0]">
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  S/N
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Date
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Present
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Absent
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Late
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Overall % Attendance
                </th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 px-4 text-center text-sm text-[#0A0A0A] font-medium"
                  >
                    Loading records...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 px-4 text-center text-sm text-[#0A0A0A] font-medium"
                  >
                    No attendance records available.
                  </td>
                </tr>
              ) : (
                currentRows.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className={`border border-b-[#E0E0E0] ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100`}
                  >
                    <td className="px-4 py-3 border-b">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </td>
                    <td className="text-sm px-4 py-3 border-b">{indexOfFirstRow + index + 1}</td>
                    <td className="text-sm px-4 py-3 border-b">{formatDate(item.date)}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.present}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.absent}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.late}</td>
                    <td className="py-4 px-4 text-sm text-[#333333]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#EE7306]"
                            style={{ width: `${item.overallPercentage}` }}
                          ></div>
                        </div>
                        <span className="font-medium">{item.overallPercentage}</span>
                      </div>
                    </td>
                    <td className="text-sm px-4 py-3 border-b relative">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(item)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Edit"
                        >
                          <Edit3Icon className="w-5 h-5 text-green-600" />
                        </button>
                        {/* <button
                          onClick={() => handleDelete(item)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="py-6 text-center text-sm text-[#0A0A0A] font-medium">
              Loading records...
            </div>
          ) : currentRows.length === 0 ? (
            <div className="py-6 text-center text-sm text-[#0A0A0A] font-medium">
              No attendance records available.
            </div>
          ) : (
            currentRows.map((item: any, index: number) => (
              <MobileCard
                key={index}
                date={formatDate(item.date)}
                present={item.present}
                absent={item.absent}
                late={item.late}
                overallPercent={parseInt(item.overallPercentage)}
                onView={() => handleView(item)}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 mt-4">
          <p className="text-[12px] text-[#717182]">
            Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} of{" "}
            {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-5 py-2 border border-[#E0E0E0] rounded-md text-[12px] ${
                currentPage === 1
                  ? "text-[#717182] cursor-not-allowed opacity-50"
                  : "bg-[#EE7306] text-white hover:bg-[#D66305]"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border border-[#E0E0E0] rounded-md text-[12px] ${
                  currentPage === i + 1
                    ? "bg-[#EE7306] text-white"
                    : "text-[#717182] hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-5 py-2 border border-[#E0E0E0] rounded-md text-[12px] ${
                currentPage === totalPages || totalPages === 0
                  ? "text-[#717182] cursor-not-allowed opacity-50"
                  : "bg-[#EE7306] text-white hover:bg-[#D66305]"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllAttendance;
