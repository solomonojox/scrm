import React from "react";
import { FaEye, FaEdit, FaTrash, FaRegBell, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { BiMessageAlt } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import asset from "../../../assets/imageAssets";
import { Guardian } from "../../../Types/Guardian/guardianTypes";
import { TeacherType } from "../../../Types/Teacher/teacherType";
import { useAuth } from "../../../Context/Auth/useAuth";

type ReligionFilter = 'all' | 'christian' | 'muslim';

interface GuardianTableProps {
    records: TeacherType[];
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
    onAddGuardian: () => void;
    onRefresh: () => void
    setEditData: (data: any) => void
    onAddStudent: () => void
}

const TeacherTable: React.FC<GuardianTableProps> = ({
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
    onAddGuardian,
    onRefresh,
    setEditData,
    onAddStudent
}) => {
    const { user } = useAuth();
    const [showReligionFilter, setShowReligionFilter] = React.useState(false);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Teacher Details');
        XLSX.writeFile(wb, "teachers.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = "Teachers List";
        const headers = [
            ["First Name", "Last Name", "Phone number", "Address", "Nationality", "State of Origin", "Religion"]
        ];

        const data = records.map((guardian) => [
            guardian.firstname || '',
            guardian.lastname || '',
            guardian.phone || '',
            guardian.homeAddress || '',
            guardian.nationality || '',
            guardian.stateOfOrigin || '',
            guardian.religion || ''
        ]);

        doc.text(title, 14, 15);
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 165, 0] }
        });

        doc.save("teachers.pdf");
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
                            src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
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
                    Home <span className="text-orange-500 font-semibold">: All Teachers</span>
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
                        onClick={onAddGuardian}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 w-full sm:w-auto"
                    >
                        Add Teacher
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
                            <span className="text-red-500 ml-2">No teachers found</span>
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
                            {/* <th className="p-3 min-w-[120px]">School Id</th> */}
                            <th className="p-3 min-w-[80px]">Photo</th>
                            <th className="p-3 min-w-[120px]">First Name</th>
                            <th className="p-3 min-w-[120px]">Last Name</th>
                            <th className="p-3 min-w-[120px]">Phone Number</th>
                            <th className="p-3 min-w-[200px]">Address</th>
                            <th className="p-3 min-w-[120px]">Nationality</th>
                            <th className="p-3 min-w-[120px]">State of Origin</th>
                            <th className="p-3 min-w-[120px]">Religion</th>
                            <th className="p-3 min-w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500">
                                    {searchQuery
                                        ? "No teachers found matching your search"
                                        : "No teachers available"}
                                </td>
                            </tr>
                        ) : (
                            records.map((t, index) => (
                                <tr
                                    key={t.teacherId}
                                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(t.teacherId)}
                                            onChange={() => onToggleCheckbox(t.teacherId)}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    {/* <td className="p-3">{t.schoolId}</td> */}
                                    <td className="p-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${t.firstname}`}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="p-3">{t.firstname}</td>
                                    <td className="p-3">{t.lastname}</td>
                                    <td className="p-3">{t.phone}</td>
                                    <td className="p-3">{t.homeAddress}</td>
                                    <td className="p-3">{t.nationality}</td>
                                    <td className="p-3">{t.stateOfOrigin}</td>
                                    <td className="p-3">{t.religion}</td>
                                    <td className="p-3 gap-3">
                                        <span
                                            className="flex items-center cursor-pointer hover:text-orange-500 gap-1"
                                            onClick={() => { setEditData(t); onAddStudent(); }}>
                                            Edit
                                            <FaEdit />
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

export default TeacherTable;