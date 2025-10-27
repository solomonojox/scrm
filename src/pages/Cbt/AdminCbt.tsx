import React, { useState } from "react";
import { Edit, Trash2, UserPlus, Users } from "lucide-react";

const EducatAdmin = () => {
  const [activeTab, setActiveTab] = useState("students");

  const students = [
    { name: "John Smith", email: "john@school.edu", class: "Grade 12A", status: "active" },
    { name: "Emma Johnson", email: "emma@school.edu", class: "Grade 11B", status: "active" },
    { name: "Michael Brown", email: "michael@school.edu", class: "Grade 12A", status: "active" },
  ];

  const teachers = [
    { name: "Dr. Sarah Wilson", email: "sarahn@school.edu", subject: "Mathematics", status: "active" },
    { name: "Prof.James Lee", email: "james@school.edu", subject: "Physics", status: "active" },
  ];
  return (
    <div className="min-h-screen bg-orange-50 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-600">Educat CBT Dashboard</h1>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-semibold">Total Students</h3>
              <p className="text-3xl font-bold text-orange-600">3</p>
              <span className="text-sm text-gray-500">Active students in school</span>
            </div>
            <Users className="text-orange-400 w-8 h-8" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-semibold">Total Teachers</h3>
              <p className="text-3xl font-bold text-orange-600">2</p>
              <span className="text-sm text-gray-500">Active teachers in school</span>
            </div>
            <Users className="text-orange-400 w-8 h-8" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 font-semibold">Total Users</h3>
              <p className="text-3xl font-bold text-orange-600">5</p>
              <span className="text-sm text-gray-500">All registered users</span>
            </div>
            <Users className="text-orange-400 w-8 h-8" />
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">User Management</h2>

          <div className="flex items-center space-x-4">
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
            <button className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition">
              <UserPlus className="w-4 h-4 mr-2" /> Add Student
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full border border-orange-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-100 text-gray-700 text-sm">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Class</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i} className="border-b border-orange-100 hover:bg-orange-50 transition">
                  <td className="p-3 font-medium">{student.name}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">
                    <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3 flex items-center space-x-3">
                    <button className="text-orange-500 hover:text-orange-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EducatAdmin;
