import { Edit2Icon, Edit3Icon, Eye, MoreVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import "../../../Styles/customScrollBar.css";

const tableData: any[] = [
  { date: "2024-09-01", present: 25, absent: 5, late: 2, overallPercent: 83 },
  { date: "2024-09-02", present: 27, absent: 3, late: 1, overallPercent: 90 },
  { date: "2024-09-03", present: 26, absent: 4, late: 0, overallPercent: 87 },
  { date: "2024-09-04", present: 28, absent: 2, late: 1, overallPercent: 92 },
  { date: "2024-09-05", present: 24, absent: 6, late: 3, overallPercent: 80 },
  { date: "2024-09-06", present: 29, absent: 1, late: 0, overallPercent: 95 },
  { date: "2024-09-07", present: 30, absent: 0, late: 0, overallPercent: 100 },
  { date: "2024-09-08", present: 25, absent: 5, late: 2, overallPercent: 83 },
  { date: "2024-09-09", present: 27, absent: 3, late: 1, overallPercent: 90 },
  { date: "2024-09-10", present: 26, absent: 4, late: 0, overallPercent: 87 },
  { date: "2024-09-11", present: 28, absent: 2, late: 1, overallPercent: 92 },
  { date: "2024-09-12", present: 24, absent: 6, late: 3, overallPercent: 80 },
  { date: "2024-09-13", present: 29, absent: 1, late: 0, overallPercent: 95 },
  { date: "2024-09-14", present: 30, absent: 0, late: 0, overallPercent: 100 },
];

const MobileCard = ({
  date,
  present,
  absent,
  late,
  overallPercent,
  index,
  onEdit,
  onDelete,
  onView,
}: any) => {
  const [showOptions, setShowOptions] = useState(false);

  // Determine color based on attendance percentage
  const getPercentageColor = (percent: number) => {
    if (percent >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (percent >= 75) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 hover:shadow-lg transition-shadow">
      {/* Header with Date and Options */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Date</p>
          <p className="text-sm font-semibold text-gray-800">{date}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Attendance Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getPercentageColor(
              overallPercent
            )}`}
          >
            {overallPercent}%
          </span>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {showOptions && (
              <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-32">
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      onView?.(index);
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-gray-200 rounded-t-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 inline-block mr-2" /> View
                  </li>
                  <li
                    onClick={() => {
                      onEdit?.(index);
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-600 text-green-600 cursor-pointer border-b border-gray-200 transition-colors"
                  >
                    <Edit3Icon className="w-4 h-4 inline-block mr-2" /> Edit
                  </li>
                  <li
                    onClick={() => {
                      onDelete?.(index);
                      setShowOptions(false);
                    }}
                    className="text-xs inline-flex items-center px-4 py-2 hover:bg-red-100 bg-red-50 hover:text-red-600 text-red-600 cursor-pointer rounded-b-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline-block mr-2" /> Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Present */}
        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
          <p className="text-xs text-green-600 mb-1 font-medium">Present</p>
          <p className="text-lg font-bold text-green-700">{present}</p>
        </div>

        {/* Absent */}
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-600 mb-1 font-medium">Absent</p>
          <p className="text-lg font-bold text-red-700">{absent}</p>
        </div>

        {/* Late */}
        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <p className="text-xs text-yellow-600 mb-1 font-medium">Late</p>
          <p className="text-lg font-bold text-yellow-700">{late}</p>
        </div>
      </div>

      {/* Quick Summary Bar */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Total: {present + absent + late} students</span>
          <span className="font-medium">Attendance: {overallPercent}%</span>
        </div>
      </div>
    </div>
  );
};

const AllAttendance = (): React.ReactElement => {
  const icons = {
    dot: (
      <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 8C0 8.53043 0.210714 9.03914 0.585787 9.41421C0.96086 9.78929 1.46957 10 2 10C2.53043 10 3.03914 9.78929 3.41421 9.41421C3.78929 9.03914 4 8.53043 4 8C4 7.46957 3.78929 6.96086 3.41421 6.58579C3.03914 6.21071 2.53043 6 2 6C1.46957 6 0.96086 6.21071 0.585787 6.58579C0.210714 6.96086 0 7.46957 0 8ZM0 2C0 2.53043 0.210714 3.03914 0.585787 3.41421C0.96086 3.78929 1.46957 4 2 4C2.53043 4 3.03914 3.78929 3.41421 3.41421C3.78929 3.03914 4 2.53043 4 2C4 1.46957 3.78929 0.960859 3.41421 0.585786C3.03914 0.210714 2.53043 0 2 0C1.46957 0 0.96086 0.210714 0.585787 0.585786C0.210714 0.960859 0 1.46957 0 2ZM0 14C0 14.5304 0.210714 15.0391 0.585787 15.4142C0.96086 15.7893 1.46957 16 2 16C2.53043 16 3.03914 15.7893 3.41421 15.4142C3.78929 15.0391 4 14.5304 4 14C4 13.4696 3.78929 12.9609 3.41421 12.5858C3.03914 12.2107 2.53043 12 2 12C1.46957 12 0.96086 12.2107 0.585787 12.5858C0.210714 12.9609 0 13.4696 0 14Z"
          fill="black"
        />
      </svg>
    ),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openRowIndex, setOpenRowIndex] = useState<number | null>(null);

  const handleOptionsClick = (rowIndex: number) => {
    setOpenRowIndex(openRowIndex === rowIndex ? null : rowIndex);
  };

  const handleEdit = (rowIndex: number) => {
    alert(`Edit clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const handleDelete = (rowIndex: number) => {
    alert(`Delete clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  // Filtering logic (adjust to your real data shape)
  const filteredData = tableData.filter(
    (item, index) =>
      searchTerm === "" ||
      item?.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.present?.toString().includes(searchTerm) ||
      item?.absent?.toString().includes(searchTerm) ||
      item?.late?.toString().includes(searchTerm) ||
      (index + 1).toString().includes(searchTerm)
  );

  // Pagination
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <section className="w-full">
      {/* Filters */}
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

      {/* Table */}
      <div className="w-full md:bg-white md:shadow-[1px_0_10px_-2px_rgba(0,0,0,0.1)] rounded-md md:border">
        {/* Desktop View table */}
        <div className="hidden md:block w-full overflow-x-auto parent-scrollbar">
          <table className="w-full table-auto border-collapse min-w-[700px]">
            <thead>
              <tr className="text-left bg-gray-200 border-b border-t border-b-[#E0E0E0]">
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm min-w-[50px] text-[#717182] font-normal">
                  <input type="checkbox" title="select all" className="w-4 h-4" />
                </th>
                <th className="min-w-[50px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  S/N
                </th>
                <th className="min-w-[150px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Date
                </th>
                <th className="min-w-[50px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Present
                </th>
                <th className="min-w-[50px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Absent
                </th>
                <th className="min-w-[50px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Late
                </th>
                <th className="min-w-[200px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Overall % Attendance for The Day
                </th>
                <th className="min-w-[100px] border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-medium">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 px-4 text-center text-sm text-[#0A0A0A] font-medium"
                  >
                    No attendance records available.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
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
                    <td className="text-sm px-4 py-3 border-b">{item.date || "--"}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.present ?? 0}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.absent ?? 0}</td>
                    <td className="text-sm px-4 py-3 border-b">{item.late ?? 0}</td>
                    <td className="py-4 px-4 text-sm text-[#333333]">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-[#EE7306]"
                            style={{ width: `${item.overallPercent}%` }}
                          ></div>
                        </div>
                        <span className="font-medium">{item.overallPercent}%</span>
                      </div>
                    </td>
                    <td className="text-sm px-4 py-3 border-b relative">
                      <button
                        onClick={() => handleOptionsClick(index)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>

                      {openRowIndex === index && (
                        <div className="absolute top-8 right-20 md:right-24 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-28">
                          <ul className="flex flex-col">
                            <li
                              // onClick={() => handleEdit(index)}
                              className="text-xs inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-500 text-yellow-600  cursor-pointer border-b border-gray-200"
                            >
                              <Eye className="w-4 h-4 inline-block mr-2" /> View
                            </li>
                            <li
                              onClick={() => handleEdit(index)}
                              className="text-xs inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-500 text-green-600  cursor-pointer border-b border-gray-200"
                            >
                              <Edit3Icon className="w-4 h-4 inline-block mr-2" /> Edit
                            </li>
                            <li
                              onClick={() => handleDelete(index)}
                              className="text-xs inline-flex items-center px-4 py-2 hover:bg-red-100 bg-red-50 hover:text-red-500 text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 inline-block mr-2" /> Delete
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {currentRows.map((item, index) => (
            <MobileCard
              key={index}
              present={item.present}
              absent={item.absent}
              late={item.late}
              overallPercent={item.overallPercent}
              date={item.date}
              handleOptionsClick={() => handleOptionsClick(index)}
              handleEdit={() => handleEdit(index)}
              handleDelete={() => handleDelete(index)}
              openRowIndex={openRowIndex === index}
              index={index}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
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
                  : "bg-[#EE7306] text-white"
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
                  : "bg-[#EE7306] text-white"
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
