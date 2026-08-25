import React, { useState } from "react";
import { FaEdit, FaSearch, FaFilter, FaSync, FaSpinner } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";
import asset from "../../../assets/imageAssets";
import { Session } from "../../../Types/sessionType";
import { useAuth } from "../../../Context/Auth/useAuth";

type ReligionFilter = 'all' | 'christian' | 'muslim';

interface SessionTableProps {
  records: Session[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  headerSearchQuery: string;
  religionFilter: ReligionFilter;
  selectedIds: string[];
  selectAll: boolean;
  loadingRowId: string | null;
  onPageChange: (page: number) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHeaderSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReligionFilterChange: (filter: ReligionFilter) => void;
  onToggleSelectAll: () => void;
  onToggleCheckbox: (id: string) => void;
  onDelete: (id: string) => void;
  onAddSession: () => void;
  onRefresh: () => void;
  onEditSession: (data: Session) => void;
  onSetCurrentSession: (id: string | undefined) => void;
}

const SessionTable: React.FC<SessionTableProps> = ({
  records,
  totalRecords,
  currentPage,
  totalPages,
  searchQuery,
  headerSearchQuery,
  religionFilter,
  selectedIds,
  selectAll,
  loadingRowId,
  onPageChange,
  onSearchChange,
  onHeaderSearchChange,
  onReligionFilterChange,
  onToggleSelectAll,
  onToggleCheckbox,
  onDelete,
  onAddSession,
  onRefresh,
  onEditSession,
  onSetCurrentSession,
}) => {
  const { user } = useAuth();
  const [showReligionFilter, setShowReligionFilter] = useState(false);

  const exportToExcel = () => {
    if (records.length === 0) {
      alert("No data to export");
      return;
    }
    const exportData = records.map(({ sessionId, sessionName, schoolId, startDate, endDate }) => ({
      'Session ID': sessionId,
      'Session Name': sessionName,
      'School ID': schoolId,
      'Start Date': startDate,
      'End Date': endDate
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sessions Details');
    XLSX.writeFile(wb, `sessions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (records.length === 0) {
      alert("No data to export");
      return;
    }
    const doc = new jsPDF();
    const title = "Session List";

    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    const headers = [["Session ID", "Session Name", "Start Date", "End Date"]];
    const data = records.map((session) => [
      session.sessionId || '',
      session.sessionName || '',
      session.startDate?.split('T')[0] || '',
      session.endDate?.split('T')[0] || ''
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [255, 165, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save(`sessions_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-4 mb-4">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
            <FaSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={headerSearchQuery}
              onChange={onHeaderSearchChange}
              className="ml-2 bg-transparent outline-none w-full text-sm"
              aria-label="Search sessions"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-full px-3 py-1 space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
              className="w-14 h-14 rounded-full"
              alt="Admin avatar"
            />
            <div className="text-xs">
              <div className="font-semibold text-gray-700">{user?.schoolName?.toLocaleUpperCase() || 'School'}</div>
              <div className="text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
          Home <span className="text-orange-500 font-semibold">: All Sessions</span>
          <span className="ml-2 text-gray-400">({totalRecords} records)</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowReligionFilter(!showReligionFilter)}
              className="flex items-center gap-2 border p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle filter"
            >
              <FaFilter className="text-orange-500" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            {showReligionFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                <div className="py-1">
                  {(['all', 'christian', 'muslim'] as ReligionFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        onReligionFilterChange(filter);
                        setShowReligionFilter(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 transition-colors ${religionFilter === filter ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                        }`}
                    >
                      {filter === 'all' ? 'All Religions' : filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={exportToExcel}
            title="Export to Excel"
            className="border p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img className="h-6 w-6" src={asset.excelLogo} alt="Excel export" />
          </button>

          <button
            onClick={exportToPDF}
            title="Export to PDF"
            className="border p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
          </button>

          <button
            onClick={onRefresh}
            title="Refresh"
            className="border p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaSync className="text-orange-500" />
          </button>

          <button
            onClick={onAddSession}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 transition-colors"
          >
            Add Session
          </button>
        </div>
      </div>

      {/* Search and Filter Info */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {(searchQuery || religionFilter !== 'all') && (
          <div className="text-sm text-gray-600">
            Showing {totalRecords} result{totalRecords !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
            {religionFilter !== 'all' && ` (Filtered by ${religionFilter})`}
            {totalRecords === 0 && (
              <span className="text-red-500 ml-2">No sessions found</span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3 w-12">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onToggleSelectAll}
                  className="cursor-pointer w-4 h-4"
                  aria-label="Select all"
                />
              </th>
              <th className="p-3 min-w-24">Session ID</th>
              <th className="p-3 min-w-32">Session Name</th>
              <th className="p-3 min-w-36">Start Date</th>
              <th className="p-3 min-w-36">End Date</th>
              <th className="p-3 min-w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "No sessions found matching your search"
                    : "No sessions available"}
                </td>
              </tr>
            ) : (
              records.map((session, index) => (
                <tr
                  key={session.sessionId || index}
                  className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(session.sessionId)}
                      onChange={() => onToggleCheckbox(session.sessionId)}
                      className="cursor-pointer w-4 h-4"
                      aria-label={`Select ${session.sessionName}`}
                    />
                  </td>
                  <td className="p-3 font-medium">{session.sessionId || 'N/A'}</td>
                  <td className="p-3">{session.sessionName || 'N/A'}</td>
                  <td className="p-3">{session.startDate?.split('T')[0] || 'N/A'}</td>
                  <td className="p-3">{session.endDate?.split('T')[0] || 'N/A'}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => onEditSession(session)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                        aria-label="Edit session"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => onSetCurrentSession(session?.sessionKey)}
                        disabled={loadingRowId === session.sessionId}
                        className={`px-3 py-1 rounded-lg shadow transition-colors flex items-center gap-2 ${loadingRowId === session.sessionId
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600'
                          } text-white`}
                        aria-label={`Set ${session.sessionName} as current session`}
                      >
                        {loadingRowId === session?.sessionKey ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          'Set Current Session'
                        )}
                      </button>
                    </div>
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
            className={`px-6 py-2 border rounded-lg transition-colors ${currentPage === 1
                ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
          >
            Previous
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
            {searchQuery && ` (${totalRecords} results)`}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 border rounded-lg transition-colors ${currentPage === totalPages
                ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
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

export default SessionTable;
