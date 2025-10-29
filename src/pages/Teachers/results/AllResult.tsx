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
import React, { useState } from "react";

interface MobileCardProps {
  item: any;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onView: (index: number) => void;
  serialNumber: number;
}

const MobileCard = ({ item, index, onEdit, onDelete, onView, serialNumber }: MobileCardProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 p-5 mb-4 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:scale-[1.02]">
      {/* Header with Name and Options */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#EE7306] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
              {serialNumber}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#EE7306]" />
            <p className="text-base font-bold text-gray-800">{item.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-600 font-medium">{item.studentId}</p>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full bg-white hover:bg-orange-100 transition-all duration-200 shadow-md hover:shadow-lg border border-orange-200"
          >
            <MoreVertical className="w-5 h-5 text-[#EE7306]" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute top-12 right-0 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-50 w-36 overflow-hidden">
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      onView?.(index);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-yellow-50 bg-white hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" /> View
                  </li>
                  <li
                    onClick={() => {
                      onEdit?.(index);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-green-50 bg-white hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </li>
                  <li
                    onClick={() => {
                      onDelete?.(index);
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

      {/* Details Grid with Icons */}
      <div className="space-y-3 bg-white rounded-xl p-4 shadow-inner border border-orange-100">
        <div className="flex items-center justify-between pb-2 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Class</p>
              <p className="text-sm font-bold text-gray-800">{item.class}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">T{item.term}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Term</p>
              <p className="text-sm font-bold text-gray-800">{item.term}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Session</p>
            <p className="text-sm font-bold text-gray-800">{item.session}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <span className="text-xs font-bold text-[#EE7306]">📝</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Assessment</p>
            <p className="text-sm font-bold text-gray-800">{item.assessment}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-pink-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Date</p>
            <p className="text-sm font-bold text-gray-800">{item.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllResult = ({ students }: { students: any[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openRowIndex, setOpenRowIndex] = useState(null);

  const handleOptionsClick = (rowIndex: any) => {
    setOpenRowIndex(openRowIndex === rowIndex ? null : rowIndex);
  };

  const handleEdit = (rowIndex: string | number) => {
    // alert(`Edit clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const handleDelete = (rowIndex: string | number) => {
    // alert(`Delete clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const handleView = (rowIndex: string | number) => {
    // alert(`View clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  // Filtering logic
  const filteredData = students.filter(
    (item, index) =>
      searchTerm === "" ||
      item?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (index + 1).toString().includes(searchTerm)
  );

  // Pagination
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <section className="w-full bg-white py-3 sm:py-6">
      {/* Search Filter - Mobile Optimized */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-orange-500 focus:border-transparent transition-all shadow-sm bg-white"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Desktop View */}
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
                  Assessment
                </th>
                {/* <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                  Date
                </th> */}
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 px-4 text-center text-sm text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border ${
                      index % 2 === 0 ? "bg-white" : "bg-orange-50"
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
                    <td className="text-sm px-4 py-3 text-gray-700">{item?.currentSession}</td>
                    <td className="text-sm px-4 py-3 text-gray-700">
                      {item?.assessment || "Report Card"}
                    </td>
                    {/* <td className="text-sm px-4 py-3 text-gray-700">{item?.date}</td> */}
                    <td className="text-sm px-4 py-3 relative">
                      <button
                        onClick={() => handleOptionsClick(index)}
                        className="p-1 rounded-lg hover:bg-orange-200 transition-colors"
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
                                onClick={() => handleView(index)}
                                className="inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                              >
                                <Eye className="w-4 h-4 mr-2" /> View
                              </li>
                              <li
                                onClick={() => handleEdit(index)}
                                className="inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                              >
                                <Edit3 className="w-4 h-4 mr-2" /> Edit
                              </li>
                              <li
                                onClick={() => handleDelete(index)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Enhanced Cards */}
        <div className="md:hidden">
          {currentRows.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-orange-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No records found</p>
            </div>
          ) : (
            currentRows.map((item, index) => (
              <MobileCard
                key={index}
                item={item}
                index={index}
                serialNumber={indexOfFirstRow + index + 1}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          )}
        </div>

        {/* Pagination - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 bg-white">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            <p className="text-[12px] text-[#717182]">
              Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                currentPage === 1
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                    currentPage === pageNum
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
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-[#EE7306] text-white hover:from-[#EE7306] hover:to-orange-700 hover:shadow-lg"
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

export default AllResult;
