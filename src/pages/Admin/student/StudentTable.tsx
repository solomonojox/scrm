// src/components/Student/StudentTable.tsx
import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaFilter, FaSync } from "react-icons/fa";
import { BsFileEarmarkPdfFill } from "react-icons/bs";
import { StudentType } from "../../../Types/Student/studentTypes";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";
import asset from "../../../assets/imageAssets";

interface StudentTableProps {
    students: any[];
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onAddStudent: () => void;
    searchQuery: string;
    classFilter: 'all' | number;
    onClassFilterChange: (filter: 'all' | number) => void;
    onRefresh: () => void;
    setEditData: (data: any) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
    students,
    totalPages,
    currentPage,
    onPageChange,
    onAddStudent,
    searchQuery,
    classFilter,
    onClassFilterChange,
    onRefresh,
    setEditData
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            setSelectedIds(students.map((s) => s.studentId));
        }
        setSelectAll(!selectAll);
    };

    const toggleCheckbox = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((sid) => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(students);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students Details');
        XLSX.writeFile(wb, "students.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = "Students List";
        const headers = [
            ["First Name", "Last Name", "Class", "Date of Birth", "Address", "Guardian ID"]
        ];

        const data = students.map((student) => [
            student.firstname || '',
            student.lastname || '',
            student.enteredClass?.toString() || '',
            student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
            student.homeAddress || '',
            student.guardianId || ''
        ]);

        doc.text(title, 14, 15);
        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [255, 165, 0] }
        });

        doc.save("students.pdf");
    };

    return (
        <>
            {/* Breadcrumb & Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Home <span className="text-orange-500 font-semibold">: All Students</span>
                </p>
                <div className="gap-4 flex items-center sm:flex-wrap">
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100"
                        >
                            <FaFilter className="text-orange-500" />
                            <span>Filter</span>
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">Class</div>
                                    <button
                                        onClick={() => {
                                            onClassFilterChange('all');
                                            setShowFilterDropdown(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${classFilter === 'all' ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        All Classes
                                    </button>
                                    {[1, 2, 3, 4, 5, 6].map(grade => (
                                        <button
                                            key={grade}
                                            onClick={() => {
                                                onClassFilterChange(grade);
                                                setShowFilterDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${classFilter === grade ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Class {grade}
                                        </button>
                                    ))}
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
                        onClick={onAddStudent}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600 w-full sm:w-auto"
                    >
                        Add Student
                    </button>
                </div>
            </div>

            {/* Search and Filter Info */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                {(searchQuery || classFilter !== 'all') && (
                    <div className="text-sm text-gray-600">
                        Showing {students.length} result{students.length !== 1 ? "s" : ""}
                        {searchQuery && ` for "${searchQuery}"`}
                        {classFilter !== 'all' && ` (Filtered by Class ${classFilter})`}
                        {students.length === 0 && (
                            <span className="text-red-500 ml-2">No students found</span>
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
                                    onChange={toggleSelectAll}
                                    className="cursor-pointer w-4 h-4"
                                />
                            </th>
                            <th className="p-3 min-w-[80px]">Photo</th>
                            <th className="p-3 min-w-[120px]">First Name</th>
                            <th className="p-3 min-w-[120px]">Last Name</th>
                            <th className="p-3 min-w-[80px]">Class</th>
                            <th className="p-3 min-w-[80px]">Gender</th>
                            <th className="p-3 min-w-[100px]">Date of Birth</th>
                            <th className="p-3 min-w-[200px]">Address</th>
                            <th className="p-3 min-w-[120px]">Guardian</th>
                            <th className="p-3 min-w-[120px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-gray-500">
                                    {searchQuery
                                        ? "No students found matching your search"
                                        : "No students available"}
                                </td>
                            </tr>
                        ) : (
                            students.map((student, index) => (
                                <tr
                                    key={student?.studentId}
                                    className={`border-t hover:bg-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(student?.studentId)}
                                            onChange={() => toggleCheckbox(student?.studentId)}
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <img
                                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student?.firstname}`}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full"
                                        />
                                    </td>
                                    <td className="p-3">{student?.firstname}</td>
                                    <td className="p-3">{student?.lastname}</td>
                                    <td className="p-3">{student?.classroomName}</td>
                                    <td className="p-3">{student?.gender}</td>
                                    <td className="p-3">
                                        {student?.dateOfBirth ? new Date(student?.dateOfBirth).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="p-3">{student?.address}</td>
                                    <td className="p-3">{student?.guardianName}</td>
                                    <td className="p-3 ">
                                        {/* <FaEye className="cursor-pointer text-blue-600 hover:text-blue-800" /> */}
                                        <span className="flex items-center cursor-pointer hover:text-orange-500 gap-1" onClick={() => { setEditData(student); onAddStudent(); }}>
                                            Edit
                                            <FaEdit />
                                        </span>
                                        {/* <FaTrash className="cursor-pointer text-red-600 hover:text-red-800" /> */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {students.length > 0 && (
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
                        {searchQuery && ` (${students.length} results)`}
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

export default StudentTable;