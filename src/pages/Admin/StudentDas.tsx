import React, { useState, useEffect } from "react";
// import Sidebar from "../Sidebar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FaBars, FaFilter, FaEye, FaEdit, FaTrashAlt, FaEnvelope } from "react-icons/fa";

// Example API base URL
const API_BASE = "https://your-api-url.com/api/students"; // 👈 Replace with actual endpoint

// MAIN COMPONENT
export default function AllStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isAddOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  // Fetch all students
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  const addStudent = async (student) => {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    const newStudent = await res.json();
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = async (student) => {
    const res = await fetch(`${API_BASE}/${student.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    const updated = await res.json();
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteStudent = async (id) => {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-xl border shadow-lg mx-2 mt-5 max-w-7xl w-full">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
            <FaBars className="text-xl" />
          </button>
          <input placeholder="Search..." className="px-3 py-1 border rounded-full outline-none w-36 md:w-1/3" />
          <div className="flex items-center space-x-4">
            <Link to="/notifications">
              <FontAwesomeIcon icon={faBell} className="text-xl cursor-pointer" />
            </Link>
            <FaEnvelope className="text-xl" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-300" />
              <div className="text-sm">
                <div className="font-medium">Gold Academy</div>
                <div className="text-xs text-gray-500">Welcome back</div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <StudentsTable
          students={students}
          setStudents={setStudents}
          onDelete={deleteStudent}
          onEdit={setEditing}
          onView={setViewing}
          onAdd={() => setAddOpen(true)}
        />
      </div>

      {/* MODALS */}
      {isAddOpen && <AddStudentModal onClose={() => setAddOpen(false)} onSave={addStudent} />}
      {editing && <EditStudentModal student={editing} onClose={() => setEditing(null)} onSave={updateStudent} />}
      {viewing && <ViewStudentModal student={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
