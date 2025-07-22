import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar";
import Header from "./Adminheader";
import AddStudentModal from "../../components/Admin/Student/AddStudentModal";
import EditStudentModal from "../../components/Admin/Student/EditStudentModal";
import ViewStudentModal from "../../components/Admin/Student/ViewStudentModal";
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

const API_BASE = "https://your-api.com/api/students"; // Replace with actual API

export default function AllStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [filterGender, setFilterGender] = useState("");

  // 🔄 Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const formData = new FormData();
      for (let key in studentData) {
        formData.append(key, studentData[key]);
      }

      const res = await fetch(API_BASE, {
        method: "POST",
        body: formData,
      });

      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const updateStudent = async (updatedData) => {
    try {
      const formData = new FormData();
      for (let key in updatedData) {
        formData.append(key, updatedData[key]);
      }

      const res = await fetch(`${API_BASE}/${updatedData.id}`, {
        method: "PUT",
        body: formData,
      });

      const updated = await res.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const deleteStudent = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        <Header />

        {/* Top bar */}
    <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white border-b shadow-sm mx-auto max-w-screen-xl w-full">

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
        <div className="px-4 sm:px-6 lg:px-8 py-6 font-sans text-[13px] text-[#333] w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="text-sm text-gray-600">Home:<span className="text-orange-500 font-semibold">All student</span></div>
            <div className="flex gap-2">
              <button
                onClick={() => setAddOpen(true)}
                className="bg-[#d87f0a] text-white font-semibold px-3 py-1.5 rounded hover:bg-[#c06e08]"
              >
                Add Student
              </button>
            </div>
          </div>

          <div className="overflow-auto bg-white border rounded shadow-sm">
            <table className="min-w-[1000px] w-full border-separate border-spacing-y-1 text-sm text-left">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  {[
                    "ID",
                    "Photo",
                    "First Name",
                    "Last Name",
                    "Class",
                    "DOB",
                    "Address",
                    "Guardian ID",
                    "Teacher ID",
                    "Gender",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="py-2 px-3 whitespace-nowrap">
                      {header}
                      {header !== "Photo" && header !== "Actions" && (
                        <FaSort className="inline-block ml-1 text-[10px]" />
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
                          src={stu.avatar}
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
                        <button
                          onClick={() => setViewing(stu)}
                          className="text-[#4a4a8a] hover:text-[#d87f0a]"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setEditing(stu)}
                          className="text-[#3a9d3a] hover:text-[#d87f0a]"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteStudent(stu.id)}
                          className="text-[#d9534f] hover:text-[#d87f0a]"
                        >
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
            setStudents((prev) => [...prev, newStudent]);
            setAddOpen(false); // Close after saving
          }}
        />

        <EditStudentModal
          isOpen={!!editing}
          student={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            updateStudent(updated);
            setEditing(null); // Close modal after saving
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
