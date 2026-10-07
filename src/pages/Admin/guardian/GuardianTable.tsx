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
import { useAuth } from "../../../Context/Auth/useAuth";

type ReligionFilter = 'all' | 'christian' | 'muslim';

interface GuardianTableProps {
    records: Guardian[];
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
    onDelete: (id: string) => Promise<boolean>;
    onAddGuardian: () => void;
    onRefresh: () => void;
    setEditData: (data: any) => void;
    onViewGuardian: (guardian: Guardian) => void;
}

const GuardianTable: React.FC<GuardianTableProps> = ({
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
    onViewGuardian,
}) => {
    const { user } = useAuth();
    const [showReligionFilter, setShowReligionFilter] = React.useState(false);
    const [guardianToDelete, setGuardianToDelete] = React.useState<Guardian | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Guardians Details");
        XLSX.writeFile(wb, "guardians.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = "Guardians List";
        const headers = [
            ["First Name", "Last Name", "Phone", "Address", "Nationality", "State", "Religion"],
        ];

        const data = records.map((guardian) => [
            guardian.firstname || "",
            guardian.lastname || "",
            guardian.phone || "",
            guardian.homeAddress || "",
            guardian.nationality || "",
            guardian.stateOfOrigin || "",
            guardian.religion || "",
        ]);

        doc.text(title, 14, 15);
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 165, 0] },
        });

        doc.save("guardians.pdf");
    };

    const closeDeleteModal = () => {
        if (!isDeleting) setGuardianToDelete(null);
    };

    const handleDelete = async () => {
        if (!guardianToDelete) return;
        setIsDeleting(true);
        try {
            const ok = await onDelete(guardianToDelete.guardianId);
            if (ok) setGuardianToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    React.useEffect(() => {
        if (!guardianToDelete) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isDeleting) setGuardianToDelete(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [guardianToDelete, isDeleting]);

    const deleteName = guardianToDelete
        ? `${guardianToDelete.firstname ?? ""} ${guardianToDelete.lastname ?? ""}`.trim()
        : "";

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

            {/* Breadcrumb & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Home <span className="text-orange-500 font-semibold">: All Guardians</span>
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
                                            onReligionFilterChange("all");
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === "all"
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        All Religions
                                    </button>
                                    <button
                                        onClick={() => {
                                            onReligionFilterChange("christian");
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === "christian"
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        Christian
                                    </button>
                                    <button
                                        onClick={() => {
                                            onReligionFilterChange("muslim");
                                            setShowReligionFilter(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${religionFilter === "muslim"
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
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
                        Add Guardian
                    </button>
                </div>
            </div>

            {/* Search and Filter Info */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                {(searchQuery || religionFilter !== "all") && (
                    <div className="text-sm text-gray-600">
                        Showing {totalRecords} result{totalRecords !== 1 ? "s" : ""}
                        {searchQuery && ` for "${searchQuery}"`}
                        {religionFilter !== "all" && ` (Filtered by ${religionFilter})`}
                        {totalRecords === 0 && <span className="text-red-500 ml-2">No guardians found</span>}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 min-w-12.5">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={onToggleSelectAll}
                                    className="cursor-pointer w-4 h-4"
                                />
                            </th>
                            <th className="p-3 min-w-20">Photo</th>
                            <th className="p-3 min-w-30">First Name</th>
                            <th className="p-3 min-w-30">Last Name</th>
                            <th className="p-3 min-w-30">Phone</th>
                            <th className="p-3 min-w-50">Address</th>
                            <th className="p-3 min-w-30">Nationality</th>
                            <th className="p-3 min-w-30">State</th>
                            <th className="p-3 min-w-30">Religion</th>
                            <th className="p-3 min-w-30">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500">
                                    {searchQuery
                                        ? "No guardians found matching your search"
                                        : "No guardians available"}
                                </td>
                            </tr>
                        ) : (
                            records.map((g, index) => (
                                <tr
                                    key={g.guardianId}
                                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(g.guardianId)}
                                            onChange={() => onToggleCheckbox(g.guardianId)}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${g.firstname}`}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="p-3">{g.firstname}</td>
                                    <td className="p-3">{g.lastname}</td>
                                    <td className="p-3">{g.phone}</td>
                                    <td className="p-3">{g.homeAddress}</td>
                                    <td className="p-3">{g.nationality}</td>
                                    <td className="p-3">{g.stateOfOrigin}</td>
                                    <td className="p-3">{g.religion}</td>
                                    <td className="p-3 flex items-center gap-4 ">
                                        <span className="flex items-center cursor-pointer text-blue-400 hover:text-blue-600 gap-1" onClick={() => onViewGuardian(g)}>
                                            View
                                            <FaEye className="cursor-pointer" />
                                        </span>
                                        <span className="flex items-center cursor-pointer text-orange-400 hover:text-orange-600 gap-1" onClick={() => { setEditData(g); onAddGuardian(); }}>
                                            Edit
                                            <FaEdit />
                                        </span>
                                        <span className="flex items-center cursor-pointer text-red-400 hover:text-red-600 gap-1" onClick={() => setGuardianToDelete(g)}>
                                            Delete
                                            <FaTrash />
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

            {guardianToDelete && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
                    onClick={closeDeleteModal}
                >
                    <style>{`
                        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                        @keyframes popIn {
                            from { opacity: 0; transform: translateY(12px) scale(0.95) }
                            to { opacity: 1; transform: translateY(0) scale(1) }
                        }
                    `}</style>

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-guardian-title"
                        aria-describedby="delete-guardian-desc"
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-2xl ring-1 ring-black/5 animate-[popIn_200ms_cubic-bezier(0.16,1,0.3,1)]"
                    >
                        <div className="h-1.5 w-full bg-orange-400" />

                        <button
                            type="button"
                            aria-label="Close"
                            disabled={isDeleting}
                            onClick={closeDeleteModal}
                            className="absolute p-2 transition-colors rounded-full top-4 right-4 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-40"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="px-6 pt-8 pb-6 text-center">
                            <div className="relative flex items-center justify-center mx-auto mb-5 w-16 h-16">
                                <span className="absolute inset-0 rounded-full bg-red-100 animate-ping opacity-60" />
                                <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-red-50 to-red-100 ring-8 ring-red-50">
                                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.35 9m-4.78 0L9.26 9m9.97-3.21c.34.05.68.11 1.02.17m-1.02-.17L18.16 19.67a2.25 2.25 0 01-2.24 2.08H8.08a2.25 2.25 0 01-2.24-2.08L4.77 5.79m14.46 0a48.11 48.11 0 00-3.48-.4m-12 .57c.34-.06.68-.12 1.02-.17m0 0a48.11 48.11 0 013.48-.4m7.5 0v-.92c0-1.18-.91-2.16-2.09-2.2a51.96 51.96 0 00-3.32 0c-1.18.04-2.09 1.02-2.09 2.2v.92m7.5 0a48.66 48.66 0 00-7.5 0"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <h3 id="delete-guardian-title" className="text-xl font-semibold tracking-tight text-slate-900">
                                Delete Guardian?
                            </h3>
                            <p id="delete-guardian-desc" className="mt-2 text-sm leading-relaxed text-slate-500">
                                This will permanently remove{" "}
                                <span className="font-semibold text-slate-700">{deleteName || "this guardian"}</span>{" "}
                                and their access.
                                <span className="block mt-1 font-medium text-red-600">This action cannot be undone.</span>
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 px-6 py-4 border-t bg-slate-50 border-slate-100 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={closeDeleteModal}
                                className="px-4 py-2.5 text-sm font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white transition-all rounded-lg shadow-sm bg-linear-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isDeleting && (
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                )}
                                {isDeleting ? "Deleting..." : "Yes, delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GuardianTable;