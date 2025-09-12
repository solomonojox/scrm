// import React from "react";
// import { Phone } from "lucide-react";

// interface Transaction {
//   id: number;
//   amount: string;
//   date: string;
//   time: string;
//   status: "Successful" | "Failed";
// }

// const transactions: Transaction[] = [
//   { id: 1001, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Successful" },
//   { id: 1002, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Failed" },
//   { id: 1003, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Successful" },
//   { id: 1004, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Successful" },
//   { id: 1005, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Failed" },
//   { id: 1006, amount: "N200,000", date: "12 - 08 - 2025", time: "12:30pm", status: "Successful" },
// ];

// const getStatusColor = (status: "Successful" | "Failed"): string => {
//   return status === "Successful" ? "text-green-600" : "text-red-600";
// };

// const TransactionHistoryTable: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg border font-[lato]">
//       {/* Header */}
//       <div className="flex justify-between items-center p-4 border-b">
//         <h2 className="text-xl font-semibold">Funding History</h2>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="text-left p-4 font-medium text-gray-700">SN</th>
//               <th className="text-left p-4 font-medium text-gray-700">Photo</th>
//               <th className="text-left p-4 font-medium text-gray-700">Narration</th>
//               <th className="text-left p-4 font-medium text-gray-700">Amount Paid</th>
//               <th className="text-left p-4 font-medium text-gray-700">Date</th>
//               <th className="text-left p-4 font-medium text-gray-700">Time</th>
//               <th className="text-left p-4 font-medium text-gray-700">Status</th>
//               <th className="text-left p-4 font-medium text-gray-700">Contact Us</th>
//             </tr>
//           </thead>
//           <tbody>
//             {transactions.map((transaction, index) => (
//               <tr key={transaction.id} className="border-b hover:bg-gray-50">
//                 <td className="p-4">{index + 1}</td>
//                 <td className="p-4">
//                   <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
//                     <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
//                       <span className="text-white text-xs font-bold">D</span>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-4 text-gray-600">Deposit to Savings</td>
//                 <td className="p-4 font-medium">{transaction.amount}</td>
//                 <td className="p-4">{transaction.date}</td>
//                 <td className="p-4">{transaction.time}</td>
//                 <td className="p-4">
//                   <span className={`font-medium ${getStatusColor(transaction.status)}`}>
//                     {transaction.status}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <button className="w-8 h-8 bg-red-100 rounded flex items-center justify-center hover:bg-red-200">
//                     <Phone className="w-4 h-4 text-red-600" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default TransactionHistoryTable;

import React from "react";
import { FaEye, FaEdit, FaTrash, FaRegBell, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { BiMessageAlt } from "react-icons/bi";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import "../../../../Styles/customScrollBar.css";
import { useAuth } from "../../../../Context/Auth/useAuth";
import imageAssets from "../../../../assets/imageAssets";
import { Phone, PhoneCallIcon } from "lucide-react";
import { TransactionType } from "../../../../Types/Guardian/transactionType";

type StatusFilter = "all" | "pending" | "success" | "declined";

interface TransactionHistoryTableProps {
  transactions: TransactionType[];
  records: any[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  headerSearchQuery: string;
  statusFilter: StatusFilter;
  selectedIds: string[];
  selectAll: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHeaderSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onToggleSelectAll: () => void;
  onToggleCheckbox: (id: string) => void;
  refresh: () => void;
}

const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  records,
  totalRecords,
  currentPage,
  totalPages,
  searchQuery,
  headerSearchQuery,
  statusFilter,
  selectedIds,
  selectAll,
  onPageChange,
  onSearchChange,
  onHeaderSearchChange,
  onStatusFilterChange,
  onToggleSelectAll,
  onToggleCheckbox,
  refresh,
}) => {
  const { user } = useAuth();
  const [showStatusFilter, setShowStatusFilter] = React.useState(false);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "transaction Details");
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = "transaction List";
    const headers = [["TransactionId", "Date", "Amount", "status"]];

    const data = transactions.map((transaction) => [
      transaction.transactionId || "",
      transaction.createdAt || "",
      transaction.amount || "",
      transaction.status || "",
    ]);

    doc.text(title, 14, 15);
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 165, 0] },
    });

    doc.save("transaction.pdf");
  };

  function formatDateTime(isoString: any) {
    const d = new Date(isoString);
    const pad = (n: any) => n.toString().padStart(2, "0");

    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <>
      {/* Breadcrumb & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
            <FaSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search"
              value={headerSearchQuery}
              onChange={onHeaderSearchChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
            />
          </div>
        </div>
        <div className="gap-4 flex items-center sm:flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
            >
              <FaFilter className="text-orange-500" />
              <span>Filter</span>
            </button>
            {showStatusFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onStatusFilterChange("all");
                      setShowStatusFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusFilter === "all"
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => {
                      onStatusFilterChange("pending");
                      setShowStatusFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusFilter === "pending"
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => {
                      onStatusFilterChange("success");
                      setShowStatusFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusFilter === "success"
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Success
                  </button>
                  <button
                    onClick={() => {
                      onStatusFilterChange("declined");
                      setShowStatusFilter(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      statusFilter === "declined"
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Decline
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
            onClick={refresh}
            title="Refresh"
            className="border p-2 rounded hover:bg-gray-100"
          >
            <FaSync className="text-orange-500" />
          </button>
        </div>
      </div>

      {/* Search and Filter Info */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {(searchQuery || statusFilter !== "all") && (
          <div className="text-sm text-gray-600">
            Showing {totalRecords} result{totalRecords !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
            {statusFilter !== "all" && ` (Filtered by ${statusFilter})`}
            {totalRecords === 0 && <span className="text-red-500 ml-2">No transaction found</span>}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto parent-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 min-w-[50px]">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onToggleSelectAll}
                  className="cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-3 min-w-[80px]">SN</th>
              <th className="p-3 min-w-[120px]">Narration</th>
              <th className="p-3 min-w-[100px]">Amount Paid</th>
              <th className="p-3 min-w-[100px]">Date</th>
              {/* <th className="p-3 min-w-[100px]">Time</th> */}
              <th className="p-3 min-w-[100px]">Status</th>
              <th className="p-3 min-w-[100px]">Contact Us</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                {/* <td colSpan={10} className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No classrooms found matching your search"
                    : "No classrooms available"}
                </td> */}
              </tr>
            ) : (
              records.map((t, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t?.transactionId)}
                      onChange={() => onToggleCheckbox(t?.transactionId)}
                      className="cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{t?.description}</td>
                  <td className="p-3">₦ {t?.amount}</td>
                  <td className="p-3">{formatDateTime(t?.createdAt)}</td>
                  {/* <td className="p-3">{t?.createdAt}</td> */}
                  <td className="py-3 px-4">
                    {t?.status === "Processing" && (
                      <span className=" bg-[#E3F2FD]/50 text-[#1E88E5]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        🔄 Processing
                      </span>
                    )}
                    {t?.status === "Pending" && (
                      <span className=" bg-[#FFF4E5]/50 text-[#FB8C00]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ⏳ Pending
                      </span>
                    )}
                    {t?.status === "Failed" && (
                      <span className=" bg-[#FDECEA]/50 text-[#EA4335]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ❌ Failed
                      </span>
                    )}
                    {t?.status === "Success" && (
                      <span className=" bg-[#E6F4EA]/50 text-[#34A853]/80 text-[12px] font-medium px-2 py-1 rounded-full">
                        ✅ Successful
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="flex items-center cursor-pointer text-orange-500 hover:text-orange-600 gap-1 border rounded-lg justify-center p-1.5">
                      <PhoneCallIcon className="w-4 h-4" />
                      <span className="text-sm">Contact Us</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {records.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 p-4 text-sm text-gray-600">
          <button
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
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
    </>
  );
};

export default TransactionHistoryTable;
