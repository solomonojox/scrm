import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  FaBars,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaEnvelope,
  FaSort,
} from "react-icons/fa";

import Sidebar from "./AdminSidebar";
import Header from "./Adminheader";
import AddStudentModal from "../../components/Admin/Student/AddStudentModal";
import EditStudentModal from "../../components/Admin/Student/EditStudentModal";
import ViewStudentModal from "../../components/Admin/Student/ViewStudentModal";

const API_BASE = "https://your-api.com/api/students"; // Replace with actual endpoint

export default function AllStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [filterGender, setFilterGender] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error.message);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const formData = new FormData();
      Object.entries(studentData).forEach(([key, val]) => {
        formData.append(key, val);
      });

      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add student");

      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
    } catch (error) {
      console.error("Add student error:", error.message);
    }
  };

  const updateStudent = async (updatedData) => {
    try {
      const formData = new FormData();
      Object.entries(updatedData).forEach(([key, val]) => {
        formData.append(key, val);
      });

      const res = await fetch(`${API_BASE}/${updatedData.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update student");

      const updated = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (error) {
      console.error("Update student error:", error.message);
    }
  };

  const deleteStudent = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete student");

      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Delete student error:", error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Top Navigation Bar */}
        <div className="fixed top-[70px] left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white border shadow-sm flex items-center justify-between gap-4 w-full max-w-5xl rounded-lg  z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
            <FaBars className="text-xl" />
          </button>

          <input
            placeholder="Search..."
            className="px-3 py-1 border rounded-full outline-none w-36 md:w-1/3"
          />

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="text-xl">
              <FontAwesomeIcon icon={faBell} className="cursor-pointer" />
            </Link>
            <FaEnvelope className="text-xl" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-medium">Gold Academy</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 max-w-[calc(100%-16rem)] px-4 sm:px-6 lg:px-8 py-6 font-sans mt-20 text-sm text-gray-800 mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="text-sm text-gray-600">
              Home: <span className="text-orange-500 font-semibold">All students</span>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="bg-[#d87f0a] text-white font-semibold px-3 py-1.5 rounded hover:bg-[#c06e08]"
            >
              Add Student
            </button>
          </div>

          {/* Student Table */}
          <div className="overflow-auto bg-white border rounded shadow-sm">
            <table className="min-w-[1000px] w-full border-separate border-spacing-y-1 text-left text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  {[
                    "ID", "Photo", "First Name", "Last Name", "Class", "DOB", "Address",
                    "Guardian ID", "Teacher ID", "Gender", "Actions"
                  ].map((header) => (
                    <th key={header} className="py-2 px-3 whitespace-nowrap font-medium">
                      {header}
                      {header !== "Photo" && header !== "Actions" && (
                        <FaSort className="inline-block ml-1 text-xs" />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((s) => (filterGender ? s.gender === filterGender : true))
                  .map((stu) => (
                    <tr key={stu.id} className="bg-white hover:bg-gray-50 border border-transparent">
                      <td className="px-3 py-2">{stu.id}</td>
                      <td className="px-3 py-2">
                        <img
                          src={stu.avatar || "/default-avatar.png"}
                          alt={`${stu.firstName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-3 py-2">{stu.firstName}</td>
                      <td className="px-3 py-2">{stu.lastName}</td>
                      <td className="px-3 py-2">{stu.class}</td>
                      <td className="px-3 py-2">{stu.dob}</td>
                      <td className="px-3 py-2">{stu.address}</td>
                      <td className="px-3 py-2">{stu.guardianId}</td>
                      <td className="px-3 py-2">{stu.teacherId}</td>
                      <td className="px-3 py-2">{stu.gender}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button onClick={() => setViewing(stu)} className="text-blue-700 hover:text-orange-500">
                          <FaEye />
                        </button>
                        <button onClick={() => setEditing(stu)} className="text-green-600 hover:text-orange-500">
                          <FaEdit />
                        </button>
                        <button onClick={() => deleteStudent(stu.id)} className="text-red-600 hover:text-orange-500">
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-[#d87f0a] font-semibold mt-4 text-center">
            Page 1 of 1
          </div>
        </div>

        {/* Modals */}
        <AddStudentModal
          isOpen={isAddOpen}
          onClose={() => setAddOpen(false)}
          onSave={(newStudent) => {
            addStudent(newStudent);
            setAddOpen(false);
          }}
        />

        <EditStudentModal
          isOpen={!!editing}
          student={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            updateStudent(updated);
            setEditing(null);
          }}
        />

        <ViewStudentModal
          isOpen={!!viewing}
          student={viewing}
          onClose={() => setViewing(null)}
        />
      </div>
    </div>
  );
}
