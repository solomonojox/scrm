import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  FaBars, FaEye, FaEdit, FaTrashAlt, FaEnvelope, FaSort
} from "react-icons/fa";

import Sidebar from "./AdminSidebar";
import Header from "./Adminheader";
import AddStudentModal from "../../components/Admin/Student/AddStudentModal";
import EditStudentModal from "../../components/Admin/Student/EditStudentModal";
import ViewStudentModal from "../../components/Admin/Student/ViewStudentModal";

const API_BASE = "https://scrmapi.tranquility.org.ng/api/Student";

export default function AllStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [filterGender, setFilterGender] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const mockStudent = {
      id: "mock-1234",
      avatar: "/mock-avatar.png",
      firstName: "Mock",
      lastName: "Student",
      enteredClass: 5,
      dateOfBirth: "2010-09-01T00:00:00Z",
      homeAddress: "123 Mock Lane",
      guardianId: "guardian-001",
      teacherId: "teacher-001",
      gender: "Male",
    };
    setStudents([mockStudent]);
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/GetAllStudent`);
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents((prev) => [
        ...prev.filter((s) => s.id.startsWith("mock")),
        ...data,
      ]);
    } catch (err) {
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData) => {
    try {
      const payload = {
        ...studentData,
        enteredClass: parseInt(studentData.enteredClass),
        currentTerm: parseInt(studentData.currentTerm || 1),
        dateOfBirth: new Date(studentData.dateOfBirth).toISOString(),
      };

      const res = await fetch(`${API_BASE}/AddStudent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add student");
      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
    } catch (err) {
      console.error("Add student error:", err.message);
    }
  };

  const updateStudent = async (updated) => {
    try {
      const res = await fetch(`${API_BASE}/UpdateStudent`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update student");

      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch (err) {
      console.error("Update student error:", err.message);
    }
  };

  const deleteStudent = async (id) => {
    try {
      if (!id.startsWith("mock")) {
        const res = await fetch(`${API_BASE}/DeleteStudent/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete student");
      }

      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete error:", err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const isSelected = (id) => selectedIds.includes(id);
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.id));
    }
  };
  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Top Nav */}
        <div className="fixed top-[70px] left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white border shadow-sm flex items-center justify-between gap-4 w-full max-w-5xl rounded-lg z-10">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
            <FaBars className="text-xl" />
          </button>

          <input
            placeholder="Search..."
            className="px-3 py-1 border rounded-full outline-none w-36 md:w-1/3"
          />

          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="text-xl">
              <FontAwesomeIcon icon={faBell} />
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
        <div className="ml-64 max-w-[calc(100%-16rem)] px-4 py-6 font-sans mt-24 text-sm text-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div className="text-sm text-gray-600">
              Home: <span className="text-orange-500 font-semibold">All students</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FaSort className="text-gray-500" />
                <select
                  className="border px-2 py-1 rounded text-sm"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="bg-[#d87f0a] text-white font-semibold px-3 py-1.5 rounded hover:bg-[#c06e08]"
              >
                Add Student
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="overflow-auto bg-white border rounded shadow-sm">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === students.length && students.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {["ID", "Photo", "First Name", "Last Name", "Class", "DOB", "Address", "Guardian ID", "Teacher ID", "Gender", "Actions"].map((header) => (
                    <th key={header} className="py-2 px-3 font-medium whitespace-nowrap">
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
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={isSelected(stu.id)}
                          onChange={() => toggleSelectOne(stu.id)}
                        />
                      </td>
                      <td className="px-3 py-2">{stu.id}</td>
                      <td className="px-3 py-2">
                        <img
                          src={stu.avatar || "/default-avatar.png"}
                          alt={stu.firstName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-3 py-2">{stu.firstName}</td>
                      <td className="px-3 py-2">{stu.lastName}</td>
                      <td className="px-3 py-2">{stu.enteredClass}</td>
                      <td className="px-3 py-2">{new Date(stu.dateOfBirth).toLocaleDateString()}</td>
                      <td className="px-3 py-2">{stu.homeAddress}</td>
                      <td className="px-3 py-2">{stu.guardianId}</td>
                      <td className="px-3 py-2">{stu.teacherId}</td>
                      <td className="px-3 py-2">{stu.gender}</td>
                      <td className="px-3 py-2 flex gap-2">
                        <button onClick={() => setViewing(stu)} className="text-blue-700 hover:text-orange-500"><FaEye /></button>
                        <button onClick={() => setEditing(stu)} className="text-green-600 hover:text-orange-500"><FaEdit /></button>
                        <button onClick={() => setDeleteId(stu.id)} className="text-red-600 hover:text-orange-500"><FaTrashAlt /></button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {deleteId && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <p className="mb-4">Are you sure you want to delete this student?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => deleteStudent(deleteId)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
