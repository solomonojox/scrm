import { Edit3, Eye, MoreVertical, Search, Trash2, Calendar, Clock, HardDrive } from "lucide-react";
import React, { useState } from "react";

const tableData = [
  {
    date: "2024-09-01",
    title: "2024/2025",
    size: "2.5MB",
    time: "10:00 AM",
  },
  {
    date: "2024-09-02",
    title: "2023/2024",
    size: "3.1MB",
    time: "11:00 AM",
  },
  {
    date: "2024-09-03",
    title: "2022/2023",
    size: "1.8MB",
    time: "09:30 AM",
  },
  {
    date: "2024-09-04",
    title: "2021/2022",
    size: "2.0MB",
    time: "01:15 PM",
  },
  {
    date: "2024-09-05",
    title: "2020/2021",
    size: "2.7MB",
    time: "02:45 PM",
  },
  {
    date: "2024-09-04",
    title: "2021/2022",
    size: "2.0MB",
    time: "01:15 PM",
  },
  {
    date: "2024-09-05",
    title: "2020/2021",
    size: "2.7MB",
    time: "02:45 PM",
  },
  {
    date: "2024-09-04",
    title: "2021/2022",
    size: "2.0MB",
    time: "01:15 PM",
  },
  {
    date: "2024-09-05",
    title: "2020/2021",
    size: "2.7MB",
    time: "02:45 PM",
  },
  {
    date: "2024-09-04",
    title: "2021/2022",
    size: "2.0MB",
    time: "01:15 PM",
  },
  {
    date: "2024-09-05",
    title: "2020/2021",
    size: "2.7MB",
    time: "02:45 PM",
  },
  {
    date: "2024-09-04",
    title: "2021/2022",
    size: "2.0MB",
    time: "01:15 PM",
  },
];

const FolderIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.3333 5.5013H10.0833L8.25001 3.66797H3.66668C2.65834 3.66797 1.83334 4.49297 1.83334 5.5013V9.16797H20.1667V7.33464C20.1667 6.3263 19.3417 5.5013 18.3333 5.5013Z"
      fill="#FFA000"
    />
    <path
      d="M18.3333 5.5H3.66668C2.65834 5.5 1.83334 6.325 1.83334 7.33333V16.5C1.83334 17.5083 2.65834 18.3333 3.66668 18.3333H18.3333C19.3417 18.3333 20.1667 17.5083 20.1667 16.5V7.33333C20.1667 6.325 19.3417 5.5 18.3333 5.5Z"
      fill="#FFCA28"
    />
  </svg>
);

const BigFolderIcon = () => (
  <svg width="76" height="76" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M63.3335 19.0013H34.8335L28.5002 12.668H12.6668C9.1835 12.668 6.3335 15.518 6.3335 19.0013V31.668H69.6668V25.3346C69.6668 21.8513 66.8168 19.0013 63.3335 19.0013Z"
      fill="#FFA000"
    />
    <path
      d="M63.3335 19H12.6668C9.1835 19 6.3335 21.85 6.3335 25.3333V57C6.3335 60.4833 9.1835 63.3333 12.6668 63.3333H63.3335C66.8168 63.3333 69.6668 60.4833 69.6668 57V25.3333C69.6668 21.85 66.8168 19 63.3335 19Z"
      fill="#FFCA28"
    />
  </svg>
);

const ShuffleIcon = () => (
  <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.3604 8.90347L13.75 6.91797H18.3334M18.3334 6.91797L15.5834 4.16797M18.3334 6.91797L15.5834 9.66797M3.66669 16.0846H7.33335L8.77894 14.0194M3.66669 6.91797H7.33335L13.75 16.0846H18.3334M18.3334 16.0846L15.5834 18.8346M18.3334 16.0846L15.5834 13.3346"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface CardProps {
  item: any;
  index: number;
  serialNumber: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onView: (index: number) => void;
}

const MobileCard = ({ item, index, serialNumber, onEdit, onDelete, onView }: CardProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border-2 border-orange-100 p-5 mb-4 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-md border-2 border-orange-200">
              <BigFolderIcon />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Session #{serialNumber}</p>
              <p className="text-base font-bold text-gray-800">{item.title} session</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full bg-white hover:bg-orange-100 transition-all duration-200 shadow-md hover:shadow-lg border border-orange-200"
          >
            <MoreVertical className="w-5 h-5 text-orange-600" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute top-12 right-0 bg-white border-2 border-orange-200 rounded-xl shadow-sm z-50 w-36 overflow-hidden">
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

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-orange-100 text-center">
          <HardDrive className="w-5 h-5 text-blue-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1 font-medium">Size</p>
          <p className="text-sm font-bold text-gray-800">{item.size}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-orange-100 text-center">
          <Calendar className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1 font-medium">Date</p>
          <p className="text-sm font-bold text-gray-800">{item.date}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-orange-100 text-center">
          <Clock className="w-5 h-5 text-purple-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1 font-medium">Time</p>
          <p className="text-sm font-bold text-gray-800">{item.time}</p>
        </div>
      </div>
    </div>
  );
};

const AllFolders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openShuffle, setOpenShuffle] = useState(false);
  const [activeShuffle, setActiveShuffle] = useState("List");
  const [openRowIndex, setOpenRowIndex] = useState(null);

  const handleOptionsClick = (rowIndex: any) => {
    setOpenRowIndex(openRowIndex === rowIndex ? null : rowIndex);
  };

  const handleEdit = (rowIndex: any) => {
    alert(`Edit clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const handleDelete = (rowIndex: any) => {
    alert(`Delete clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const handleView = (rowIndex: any) => {
    alert(`View clicked for row ${rowIndex + 1}`);
    setOpenRowIndex(null);
  };

  const tab = ["List", "Grid"];

  const handleShuffleClick = () => {
    setOpenShuffle(!openShuffle);
  };

  const filteredData = tableData.filter(
    (item, index) =>
      searchTerm === "" ||
      item?.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.size?.toString().includes(searchTerm) ||
      item?.time?.toString().includes(searchTerm) ||
      item?.title?.toString().includes(searchTerm) ||
      (index + 1).toString().includes(searchTerm)
  );

  const rowsPerPage = 6;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <section className="w-full min-h-screen py-3 sm:py-6">
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {activeShuffle === "List" ? "All Folders" : "Folders Grid View"}
            </h2>
            {filteredData.length > 0 && (
              <p className="text-sm text-gray-600">{filteredData.length} folders</p>
            )}
          </div>

          <div className="relative">
            <button
              onClick={handleShuffleClick}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#EE7306] text-white rounded-xl text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <ShuffleIcon />
              Shuffle
            </button>

            {openShuffle && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpenShuffle(false)} />
                <div className="absolute mt-2 w-32 right-0 bg-white border border-orange-200 rounded-xl shadow-sm z-50 overflow-hidden">
                  {tab.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setActiveShuffle(item);
                        setOpenShuffle(false);
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-orange-50 flex items-center gap-2 transition-colors font-medium text-sm ${
                        activeShuffle === item ? "bg-orange-100 text-orange-600" : "text-gray-700"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
          <input
            type="text"
            placeholder="Search by folder name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-orange-500 focus:border-transparent transition-all bg-white"
          />
        </div>
      </div>

      {activeShuffle === "List" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#EE7306]">
                  <th className="py-4 px-4 text-left">
                    <input type="checkbox" title="select all" className="w-4 h-4 rounded" />
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Title
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Size
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Time
                  </th>
                  <th className="py-4 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-4 text-center text-sm text-gray-500">
                      No folders found.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-b border-orange-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-orange-50"
                      } hover:bg-orange-100 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </td>
                      <td className="text-sm px-4 py-3 text-gray-700 font-semibold">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <td className="text-sm px-4 py-3 font-bold text-gray-800">
                        <div className="inline-flex items-center gap-2">
                          <FolderIcon />
                          {item.title} session
                        </div>
                      </td>
                      <td className="text-sm px-4 py-3 text-gray-700">{item.size}</td>
                      <td className="text-sm px-4 py-3 text-gray-700">{item.date}</td>
                      <td className="text-sm px-4 py-3 text-gray-700">{item.time}</td>
                      <td className="text-sm px-4 py-3 relative">
                        <button
                          onClick={() => handleOptionsClick(index)}
                          className="p-1 rounded-lg hover:bg-orange-200 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-orange-600" />
                        </button>

                        {openRowIndex === index && (
                          <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setOpenRowIndex(null)}
                            />
                            <div className="absolute top-8 right-0 bg-white border border-gray-100 rounded-xl shadow-sm z-50 w-32 overflow-hidden">
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

          <div className="md:hidden p-3">
            {currentRows.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No folders found</p>
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

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 ">
            <p className="text-[12px] text-[#717182]">
              Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "bg-[#EE7306] text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
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
                        ? "bg-[#EE7306] text-white shadow-lg scale-110"
                        : "text-orange-600 bg-white hover:bg-orange-100 border border-orange-200"
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
                    : "bg-[#EE7306] text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="">
            {currentRows.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-orange-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No folders found</p>
              </div>
            ) : (
              <div>
                {/* Grid View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentRows.length === 0 ? (
                    <p className="py-6 px-4 text-center text-sm text-[#0A0A0A] font-medium">
                      No Folders records available.
                    </p>
                  ) : (
                    currentRows.map((item, index) => (
                      <div
                        key={index}
                        className="border border-[#E0E0E0] rounded-md p-4 bg-white shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-[#EE7306] border-gray-300 rounded"
                            name={`${index}`}
                            id={`${index}`}
                          />
                          <button className="p-1 rounded hover:bg-gray-200">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="">
                            <BigFolderIcon />
                          </p>
                          <h3 className="text-xs font-medium text-gray-900">
                            {item.title || "--"} session
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-600">{item.size ?? 0}</div>
                          <div className="text-sm text-gray-600">{item.date || "--"}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {currentRows.length > 0 ? indexOfFirstRow + 1 : 0} -{" "}
              {Math.min(indexOfLastRow, filteredData.length)} of {filteredData.length}
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                  currentPage === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "bg-[#EE7306] text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
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
                        ? "bg-[#EE7306] text-white shadow-lg scale-110"
                        : "text-orange-600 bg-white hover:bg-orange-100 border-2 border-orange-200"
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
                    : "bg-[#EE7306] text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AllFolders;
