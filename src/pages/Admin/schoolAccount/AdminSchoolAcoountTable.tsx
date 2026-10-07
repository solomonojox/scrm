import React from "react";
import { FaEye, FaSearch, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import asset from "../../../assets/imageAssets";
import { useAuth } from "../../../Context/Auth/useAuth";
import { SchoolAccountType } from "../../../Types/Admin/schoolAccountType";

interface SchoolAccountTableProps {
  account: SchoolAccountType | null;
  loading?: boolean;
  headerSearchQuery: string;
  onHeaderSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddAccount: () => void;
  onRefresh: () => void;
}

const SchoolAccountTable: React.FC<SchoolAccountTableProps> = ({
  account,
  loading,
  headerSearchQuery,
  onHeaderSearchChange,
  onAddAccount,
  onRefresh,
}) => {
  const { user } = useAuth();

  // ---- Export to PDF ----
  const exportToPDF = () => {
    if (!account) {
      alert("No record to export");
      return;
    }

    const doc = new jsPDF();
    doc.text("School Account Detail", 14, 15);
    autoTable(doc, {
      head: [["Field", "Value"]],
      body: [
        ["Bank Name", account.bankName || ""],
        ["Account Number", account.accountNumber || ""],
        ["Account Name", account.accountName || ""],
        ["Bank Code", account.bankCode || ""],
        ["School Account ID", account.schoolAccountId || ""],
        ["School ID", account.schoolId || ""],
        ["Default", account.isDefault ? "Yes" : "No"],
        ["Created At", account.createdAt || ""],
      ],
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 165, 0] },
    });
    doc.save("school-account.pdf");
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-1 mb-4">
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
        <div className="flex items-center space-x-4">
          {/* <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" /> */}
          {/* <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" /> */}
          <div className="flex items-center rounded-full px-3 py-1 space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
              className="w-14 h-14 rounded-full"
              alt="Admin"
            />
            <div className="text-xs">
              <div className="font-semibold text-gray-700">
                {user?.schoolName.toLocaleUpperCase()}
              </div>
              <div className="text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
          Home <span className="text-orange-500 font-semibold">: School Account</span>
        </p>
        <div className="gap-3 flex items-center flex-wrap">
          <button
            onClick={exportToPDF}
            title="Export to PDF"
            className="border p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            disabled={!account}
          >
            <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
          </button>

          <button
            onClick={onRefresh}
            title="Refresh"
            className="border p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            disabled={loading}
          >
            <FaSync className={`text-orange-500 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={onAddAccount}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
          >
            Add Account
          </button>
        </div>
      </div>

      {/* Table with a single row — no .map() */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 min-w-30">Bank Name</th>
              <th className="p-3 min-w-30">Account Number</th>
              <th className="p-3 min-w-30">Account Name</th>
              <th className="p-3 min-w-30">Default</th>
              {/* <th className="p-3 min-w-30"></th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Loading account...
                </td>
              </tr>
            ) : !account ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No account available
                  
                </td>
              </tr>
            ) : (
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3">{account.bankName || "-"}</td>
                <td className="p-3">{account.accountNumber || "-"}</td>
                <td className="p-3">{account.accountName || "-"}</td>
                <td className="p-3">
                  {account.isDefault ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                      Default
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                {/* <td className="p-3">
                  <FaEye
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                    title="View"
                  />
                </td> */}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SchoolAccountTable;
