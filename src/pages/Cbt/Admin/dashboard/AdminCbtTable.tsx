import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Student {
  name: string;
  email: string;
  class: string;
  status: string;
}

interface Teacher {
  name: string;
  email: string;
  subject: string;
  status: string;
}

const AdminCbtTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"students" | "teachers">("students");

  const tabs = [
    { id: "students", label: "Students" },
    { id: "teachers", label: "Teachers" },
  ];

  const students: Student[] = [
    { name: "John Smith", email: "john@school.edu", class: "Grade 12A", status: "active" },
    { name: "Emma Johnson", email: "emma@school.edu", class: "Grade 11B", status: "active" },
    { name: "Michael Brown", email: "michael@school.edu", class: "Grade 12A", status: "active" },
  ];

  const teachers: Teacher[] = [
    {
      name: "Dr. Sarah Wilson",
      email: "sarah@school.edu",
      subject: "Mathematics",
      status: "active",
    },
    { name: "Prof. James Lee", email: "james@school.edu", subject: "Physics", status: "active" },
  ];

  return (
    <div className="border shadow-md rounded-lg">
      <h1 className="text-xl p-6 font-semibold mb-6">Users</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 px-4 text-lg font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab.id as "students" | "teachers")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Students Table */}
      {activeTab === "students" && (
        <table className="w-full border-collapse shadow-sm overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm">Name</th>
              <th className="p-3 text-sm">Email</th>
              <th className="p-3 text-sm">Class</th>
              <th className="p-3 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{student.name}</td>
                <td className="p-3 text-sm">{student.email}</td>
                <td className="p-3 text-sm">{student.class}</td>
                <td className="p-3 text-sm capitalize">{student.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Teachers Table */}
      {activeTab === "teachers" && (
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 text-sm">Name</th>
              <th className="p-3 text-sm">Email</th>
              <th className="p-3 text-sm">Subject</th>
              <th className="p-3 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm">{teacher.name}</td>
                <td className="p-3 text-sm">{teacher.email}</td>
                <td className="p-3 text-sm">{teacher.subject}</td>
                <td className="p-3 text-sm capitalize">{teacher.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => navigate("/cbt/admin/userManagement")}
        className="px-6 py-2 bg-orange-600 text-white m-4 rounded-lg"
      >
        View all
      </button>
    </div>
  );
};

export default AdminCbtTable;
