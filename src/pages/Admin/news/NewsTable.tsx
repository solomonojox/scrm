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
import {News} from "../../../Types/newsType";

type ReligionFilter = 'all' | 'christian' | 'muslim';

interface NewsTableProps {
    records: News[];
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
    onAddNews: () => void;
    onRefresh: () => void
}

const NewsTable: React.FC<NewsTableProps> = ({
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
    onAddNews,
    onRefresh
}) => {
    const [showReligionFilter, setShowReligionFilter] = React.useState(false);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(records);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'News Details');
        XLSX.writeFile(wb, "news.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = "News List";
        const headers = [
            ["content", "newsId", "publishedDate", "title"]
        ];

        const data = records.map((news) => [
            news.content || '',
            news.newsId || '',
           news.publishedDate|| '',
            news.title || ''
        ]);

        doc.text(title, 14, 15);
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 165, 0] }
        });

        doc.save("news.pdf");
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
                            <div className="font-semibold text-gray-700">Gold Academy</div>
                            <div className="text-gray-400">Admin</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Home <span className="text-orange-500 font-semibold">: All News</span>
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
                        onClick={onAddNews}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 w-full sm:w-auto"
                    >
                        Add News
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
                            <span className="text-red-500 ml-2">No news found</span>
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
                            <th className="p-3 min-w-[120px]">News Id</th>
                            <th className="p-3 min-w-[120px]">Title</th>
                            <th className="p-3 min-w-[120px]">Content </th>
                            <th className="p-3 min-w-[200px]">Published Date</th>
                            <th className="p-3 min-w-[200px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-8 text-center text-gray-500">
                                    {searchQuery
                                        ? "No news found matching your search"
                                        : "No news available"}
                                </td>
                            </tr>
                        ) : (
                            records.map((n, index) => (
                                <tr
                                    key={n.newsId}
                                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(n.newsId)}
                                            onChange={() => onToggleCheckbox(n.newsId)}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    {/* <td className="p-3">{s.newsId}</td> */}
                                    <td className="p-3">{n.newsId}</td>
                                    <td className="p-3">{n.title}</td>
                                    <td className="p-3">{n.content}</td>
                                    {/* <td className="p-3">{s.classrooms}</td> */}
                                    {/* <td className="p-3">{s.id}</td> */}
                                    <td className="p-3">{n.publishedDate}</td>
                                    <td className="p-3 flex gap-3">
                                        <FaEye className="cursor-pointer text-blue-600 hover:text-blue-800" />
                                        <FaEdit className="cursor-pointer text-green-600 hover:text-green-800" />
                                        <FaTrash
                                            className="cursor-pointer text-red-600 hover:text-red-800"
                                            onClick={() => onDelete(n.newsId)}
                                        />
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

export default NewsTable;