import React, { useState, useMemo, useEffect } from "react";
import { UserPlus } from "lucide-react";
import AdminCbtUserTable from "./AdminCbtUserTable";
import AdminCbtUserForm from "./AdminCbtUserForm";

const AdminCbtUserManagement = () => {
  const [activeTab, setActiveTab] = useState<any>("students");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const students: any[] = [
    { name: "John Smith", email: "john@school.edu", class: "Grade 12A", status: "active" },
    { name: "Emma Johnson", email: "emma@school.edu", class: "Grade 11B", status: "active" },
    { name: "Michael Brown", email: "michael@school.edu", class: "Grade 12A", status: "active" },
    { name: "Sarah Dean", email: "sarah@school.edu", class: "Grade 10A", status: "active" },
    { name: "Kyle Grant", email: "kyle@school.edu", class: "Grade 9A", status: "active" },
    { name: "Lily Evans", email: "lily@school.edu", class: "Grade 11C", status: "active" },
  ];

  const teachers: any[] = [
    {
      name: "Dr. Sarah Wilson",
      email: "sarah@school.edu",
      subject: "Mathematics",
      status: "active",
    },
    { name: "Prof. James Lee", email: "james@school.edu", subject: "Physics", status: "active" },
    { name: "Mrs. Collins", email: "collins@school.edu", subject: "Chemistry", status: "active" },
  ];

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Select the correct dataset
  const rawData = activeTab === "students" ? students : teachers;

  // Apply search filter
  const filteredData = useMemo(() => {
    return rawData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  }, [rawData, search]);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  // Total number of pages
  const totalPages = Math.ceil(filteredData.length / pageSize);

  return (
    <div className="p-6 font-sans">
      {/* USER MANAGEMENT HEADER */}
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

          <div className="flex items-start md:items-center flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Tabs */}
            <div className="bg-orange-100 rounded-full flex p-1">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  activeTab === "students"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Students
              </button>

              <button
                onClick={() => setActiveTab("teachers")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                  activeTab === "teachers"
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Teachers
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {activeTab === "students" ? "Add Student" : "Add Teacher"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-orange-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* TABLE WITH PAGINATION */}
        <AdminCbtUserTable
          activeTab={activeTab}
          users={paginatedData}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* FORM MODAL */}
      {showModal && (
        <AdminCbtUserForm activeTab={activeTab} closeModal={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default AdminCbtUserManagement;
