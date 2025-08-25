import React, { useState } from "react";
import {
  ChevronDown,
  Calendar,
  CheckSquare,
  Clock,
  Eye,
  Filter,
  ArrowLeft,
  Download,
  Upload,
  X,
} from "lucide-react";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dateCreated: string;
  dueDate: string;
  teacherName: string;
  status: "Completed" | "Pending" | "Overdue";
  pupilName: string;
  class: string;
  submissionDate?: string;
  score?: string;
  description: string;
  questions: string[];
  resources: string[];
}

interface Student {
  id: string;
  name: string;
  assignments: Assignment[];
}

// Assignment Table Component
interface AssignmentTableProps {
  assignments: Assignment[];
  onViewAssignment: (assignment: Assignment) => void;
  onToggleSelectAll: () => void;
  onToggleCheckbox: (id: string) => void;
  selectAll: boolean;
  selectedIds: string[];
  selectedStudent: string;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  assignments,
  onViewAssignment,
  selectAll,
  onToggleSelectAll,
  onToggleCheckbox,
  selectedIds,
  selectedStudent,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const completedCount = assignments.filter((a) => a.status === "Completed").length;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            All Assignments for {selectedStudent}
          </h2>
          <p className="text-sm text-gray-500">
            {Math.min(completedCount, 3)} of {assignments.length} Assignments completed this week
          </p>
        </div>
      </div>

      {/* table */}
      <div className="bg-white shadow overflow-x-auto parent-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-200 text-gray-700 sticky top-0 z-10">
            <tr className="mx-6">
              <th className="p-3 min-w-[50px]">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={onToggleSelectAll}
                  className="cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-3 min-w-[80px]">S/N</th>
              <th className="p-3 min-w-[120px]">Subject</th>
              <th className="p-3 min-w-[120px]">Title</th>
              <th className="p-3 min-w-[120px]">Date Created</th>
              <th className="p-3 min-w-[120px]">Due date</th>
              <th className="p-3 min-w-[120px]">Teacher's Name</th>
              <th className="p-3 min-w-[120px]">Status</th>
              <th className="p-3 min-w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-gray-500">
                  {/* {searchQuery
                    ? "No guardians found matching your search"
                    : "No guardians available"} */}
                </td>
              </tr>
            ) : (
              assignments.map((assignment, index) => (
                <tr
                  key={index}
                  className={`border-t hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(assignment.id)}
                      onChange={() => onToggleCheckbox(assignment.id)}
                      className="cursor-pointer w-4 h-4"
                    />
                  </td>
                  <td className="p-3">{assignment?.id}</td>
                  <td className="p-3">{assignment.subject}</td>
                  <td className="p-3">{assignment.title}</td>
                  <td className="p-3">{assignment.dateCreated}</td>
                  <td className="p-3">{assignment.dueDate}</td>
                  <td className="p-3">{assignment.teacherName}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                  <td className="p-3 ">
                    <span
                      className="flex items-center cursor-pointer hover:text-orange-500 gap-1"
                      onClick={() => onViewAssignment(assignment)}
                    >
                      <Eye size={16} />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {assignments.length > 0 && (
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
            {/* {searchQuery && ` (${totalRecords} results)`} */}
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
    </div>
  );
};

export default AssignmentTable;
