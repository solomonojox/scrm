import { MoreVertical } from "lucide-react";
import React, { useState } from "react";

const tableData: any[] = [
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
];

const AllFolders = (): React.ReactElement => {
  const icons = {
    dot: (
      <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 8C0 8.53043 0.210714 9.03914 0.585787 9.41421C0.96086 9.78929 1.46957 10 2 10C2.53043 10 3.03914 9.78929 3.41421 9.41421C3.78929 9.03914 4 8.53043 4 8C4 7.46957 3.78929 6.96086 3.41421 6.58579C3.03914 6.21071 2.53043 6 2 6C1.46957 6 0.96086 6.21071 0.585787 6.58579C0.210714 6.96086 0 7.46957 0 8ZM0 2C0 2.53043 0.210714 3.03914 0.585787 3.41421C0.96086 3.78929 1.46957 4 2 4C2.53043 4 3.03914 3.78929 3.41421 3.41421C3.78929 3.03914 4 2.53043 4 2C4 1.46957 3.78929 0.960859 3.41421 0.585786C3.03914 0.210714 2.53043 0 2 0C1.46957 0 0.96086 0.210714 0.585787 0.585786C0.210714 0.960859 0 1.46957 0 2ZM0 14C0 14.5304 0.210714 15.0391 0.585787 15.4142C0.96086 15.7893 1.46957 16 2 16C2.53043 16 3.03914 15.7893 3.41421 15.4142C3.78929 15.0391 4 14.5304 4 14C4 13.4696 3.78929 12.9609 3.41421 12.5858C3.03914 12.2107 2.53043 12 2 12C1.46957 12 0.96086 12.2107 0.585787 12.5858C0.210714 12.9609 0 13.4696 0 14Z"
          fill="black"
        />
      </svg>
    ),
    shuffle: (
      <svg
        width="22"
        height="23"
        viewBox="0 0 22 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.3604 8.90347L13.75 6.91797H18.3334M18.3334 6.91797L15.5834 4.16797M18.3334 6.91797L15.5834 9.66797M3.66669 16.0846H7.33335L8.77894 14.0194M3.66669 6.91797H7.33335L13.75 16.0846H18.3334M18.3334 16.0846L15.5834 18.8346M18.3334 16.0846L15.5834 13.3346"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    folder: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.3333 5.5013H10.0833L8.25001 3.66797H3.66668C2.65834 3.66797 1.83334 4.49297 1.83334 5.5013V9.16797H20.1667V7.33464C20.1667 6.3263 19.3417 5.5013 18.3333 5.5013Z"
          fill="#FFA000"
        />
        <path
          d="M18.3333 5.5H3.66668C2.65834 5.5 1.83334 6.325 1.83334 7.33333V16.5C1.83334 17.5083 2.65834 18.3333 3.66668 18.3333H18.3333C19.3417 18.3333 20.1667 17.5083 20.1667 16.5V7.33333C20.1667 6.325 19.3417 5.5 18.3333 5.5Z"
          fill="#FFCA28"
        />
      </svg>
    ),
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering logic (adjust to your real data shape)
  const filteredData = tableData.filter(
    (item, index) =>
      searchTerm === "" ||
      item?.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.size?.toString().includes(searchTerm) ||
      item?.time?.toString().includes(searchTerm) ||
      item?.title?.toString().includes(searchTerm) ||
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
      <div className="w-full py-6 border border-[#c9c8c8] rounded-md my-6 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium mb-4">All Folders</h2>

          <div>
            <button className="inline-flex items-center gap-1 px-4 py-2 bg-[#EE7306] text-white rounded-full text-sm hover:bg-[#cf5c06] transition">
              {icons.shuffle}
              Shuffle
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full lg:w-[80%]">
            <input
              type="text"
              placeholder="Search by folder name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-md py-3 px-3 text-[12px] text-[#717182] focus:outline-none focus:border-[#EE7306]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white shadow-[1px_0_10px_-2px_rgba(0,0,0,0.1)] rounded-md border">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse min-w-[700px]">
            <thead>
              <tr className="text-left bg-gray-200 border-b border-t border-b-[#E0E0E0]">
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  <input type="checkbox" title="select all" className="w-4 h-4" />
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  S/N
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  Title
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  Size
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  Date
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
                  Time
                </th>
                <th className="border-b py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#717182] font-normal">
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
                    No Folders records available.
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
                    <td className="px-4 py-3 border-b">{indexOfFirstRow + index + 1}</td>
                    <td className="px-4 py-3 border-b inline-flex items-center">
                      {icons.folder} {item.title || "--"} session
                    </td>
                    <td className="px-4 py-3 border-b">{item.size ?? 0}</td>
                    <td className="px-4 py-3 border-b">{item.date || "--"}</td>
                    <td className="px-4 py-3 border-b">{item.time || "--"}</td>
                    <td className="px-4 py-3 border-b">
                      <button className="p-1 rounded hover:bg-gray-200">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

export default AllFolders;
