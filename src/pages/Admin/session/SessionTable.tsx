import React from "react";
import { FaEye, FaEdit, FaTrash, FaRegBell, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { BiMessageAlt } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import asset from "../../../assets/imageAssets";
// import { Session } from "../../../Types/Guardian/guardianTypes";
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
    onPageChange: (page: number) => void;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onHeaderSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReligionFilterChange: (filter: ReligionFilter) => void;
    onToggleSelectAll: () => void;
    onToggleCheckbox: (id: string) => void;
    onDelete: (id: string) => void;
    onAddSession: () => void;
    onRefresh: () => void;
    setEditData: (data: any) => void;
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
    onPageChange,
    onSearchChange,
    onHeaderSearchChange,
    onReligionFilterChange,
    onToggleSelectAll,
    onToggleCheckbox,
    onDelete,
    onAddSession,
    onRefresh,
    setEditData,
}) => {
    const { user } = useAuth();
    const [showReligionFilter, setShowReligionFilter] = React.useState(false);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sessions Details');
        XLSX.writeFile(wb, "sessions.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = "Session List";
        const headers = [
            ["id", "sessionId", "sessionName", "schoolId", "startDate", "endDate"]
        ];

        const data = records.map((session) => [
            session.classrooms || '',
            session.endDate || '',
            session.id || '',
            session.schoolId || '',
            session.sessionId || '',
            session.sessionName || '',
            session.startDate || ''
        ]);

        doc.text(title, 14, 15);
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 165, 0] }
        });

        doc.save("sessions.pdf");
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
                    <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
                    <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
                    <div className="flex items-center rounded-full px-3 py-1 space-x-2">
                        <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                            className="w-14 h-14 rounded-full"
                            alt="Admin"
                        />
                        <div className="text-xs">
                            <div className="font-semibold text-gray-700">{user?.schoolName.toLocaleUpperCase()}</div>
                            <div className="text-gray-400">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Home <span className="text-orange-500 font-semibold">: All Sessions</span>
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
                                            onReligionFilterChange('all');
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'all' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        All Religions
                                    </button>
                                    <button
                                        onClick={() => {
                                            onReligionFilterChange('christian');
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'christian' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Christian
                                    </button>
                                    <button
                                        onClick={() => {
                                            onReligionFilterChange('muslim');
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === 'muslim' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Muslim
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
                        <img className="h-6 w-6" src={asset.excelLogo} alt="Excel export" />
                    </button>

                    <button
                        onClick={exportToPDF}
                        title="Export to PDF"
                        className="border p-2 rounded hover:bg-gray-100"
                    >
                        <BsFileEarmarkPdfFill className="text-red-500 text-2xl" />
                    </button>

                    <button
                        onClick={onRefresh}
                        title="Refresh"
                        className="border p-2 rounded hover:bg-gray-100"
                    >
                        <FaSync className="text-orange-500" />
                    </button>

                    <button
                        onClick={onAddSession}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 w-full sm:w-auto"
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
                            <span className="text-red-500 ml-2">No session found</span>
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
                                    onChange={onToggleSelectAll}
                                    className="cursor-pointer w-4 h-4"
                                />
                            </th>
                            {/* <th className="p-3 min-w-[80px]">Photo</th> */}
                            <th className="p-3 min-w-[120px]">Session Id</th>
                            {/* <th className="p-3 min-w-[120px]">Session name</th> */}
                            <th className="p-3 min-w-[120px]">Start Date </th>
                            <th className="p-3 min-w-[200px]">End date</th>
                            <th className="p-3 min-w-[200px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500">
                                    {searchQuery
                                        ? "No sessions found matching your search"
                                        : "No sessions available"}
                                </td>
                            </tr>
                        ) : (
                            records.map((s, index) => (
                                <tr
                                    key={index}
                                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(s.sessionId)}
                                            onChange={() => onToggleCheckbox(s.sessionId)}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    {/* <td className="p-3">{s.sessionId}</td> */}
                                    <td className="p-3">{s.sessionId}</td>
                                    {/* <td className="p-3">{s.sessionName}</td> */}
                                    <td className="p-3">{s?.startDate?.split('T')[0]}</td>
                                    {/* <td className="p-3">{s.classrooms}</td> */}
                                    {/* <td className="p-3">{s.id}</td> */}
                                    <td className="p-3">{s?.endDate?.split('T')[0]}</td>
                                    <td className="p-3 flex gap-3">
                                        <span className="flex items-center cursor-pointer hover:text-orange-500 gap-1" onClick={() => { setEditData(s); onAddSession(); }}>
                                            Edit
                                            <FaEdit />
                                        </span>
                                        {/* <FaTrash
                                            className="cursor-pointer text-red-600 hover:text-red-800"
                                            onClick={() => onDelete(s.sessionId)}
                                        /> */}
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
                        className={`px-6 py-2 border rounded ${currentPage === 1
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
                        className={`px-6 py-2 border rounded ${currentPage === totalPages
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

export default SessionTable;