import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { cbtAdminService } from "../../../../Services/Cbt/Admin/CbtAdminService";
import { FaSpinner } from "react-icons/fa";

interface AdminCbtUserTableProps {
  activeTab: "students" | "teachers";
  users: any[]; // Already filtered + paginated users from parent
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  deleteUser: (userId: string) => void;
  loading: boolean
}

const AdminCbtUserTable: React.FC<AdminCbtUserTableProps> = ({
  activeTab,
  users,
  currentPage,
  totalPages,
  onPageChange,
  deleteUser,
  loading
}) => {

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-orange-100 text-gray-700 text-sm">
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">{activeTab === "students" ? "Student ID" : "Email"}</th>
            <th className="text-left p-3">{activeTab === "students" ? "Class" : "Subject"}</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user: any, i: number) => (
            <tr key={i} className="border-b border-orange-100 hover:bg-orange-50 transition">
              <td className="p-3 text-sm font-medium">
                {user.firstname} {user.lastname}
              </td>
              <td className="p-3 text-sm">
                {activeTab === "students" ? user.studentNo : user.email}
              </td>
              <td className="p-3 text-sm">
                {activeTab === "students" ? user.class : user.subject}
              </td>
              <td className="p-3 text-sm">
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                  {user.status || "Active"}
                </span>
              </td>
              <td className="p-3 text-sm flex items-center space-x-3">
                <button className="text-orange-500 hover:text-orange-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-500 hover:text-red-600" onClick={() => deleteUser(user.teacherId)}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}

          {/* Empty state */}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* PAGINATION BUTTONS */}
      <div className="flex justify-end items-center space-x-2 mt-4">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border rounded-md bg-orange-600 text-white disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1 border rounded-md bg-orange-600 text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {loading && <div className="top-0 left-0 fixed z-50 w-full h-screen bg-black/20 flex flex-col justify-center items-center">
        <FaSpinner className="animate-spin " size={25} />
        <p>Loading</p>
      </div>
      }
    </div>
  );
};

export default AdminCbtUserTable;
