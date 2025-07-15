import React, { useState } from "react";
import Sidebar from "../Sidebar";
import AddStudentModal from "./AddStudentModal";  
import EditStudentModal from "./EditStudentModal";
import ViewStudentModal from "./ViewStudentModal"; 
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  FaBars,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaBell,
  FaEnvelope,
} from "react-icons/fa";

/**
 * ⚙️ TEMP DATA – swap with real API call when ready.
 */
const initialStudents = [
  {
    id: 10001,
    firstName: "Jimmy",
    lastName: "Oslen",
    class: "Jss1",
    dob: "12-12-2024",
    address: "1, broad way lagos",
    guardianId: 10002,
    teacherId: 10002,
    gender: "Male",
    avatar:
      "https://storage.googleapis.com/a1aa/image/c279911e-bfe8-4389-77de-5da03571d189.jpg",
  },
];


function StudentsTable({ students, setStudents }) {
  const [isAddOpen, setAddOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
const [editing, setEditing] = useState(null);
const [viewing, setViewing] = useState(null);
  const toggleSelectAll = (e) => {
    const { checked } = e.target;
    setStudents((prev) => prev.map((s) => ({ ...s, _checked: checked })));
  };

  const toggleRow = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, _checked: !s._checked } : s))
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 font-sans text-[13px] text-[#333]">
      {/* Breadcrumb & Action buttons */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-1 text-sm text-gray-600 select-none">
          <span>Home</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="font-semibold text-[#d87f0a]">All Students</span>
        </div>

        <div className="relative flex items-center gap-2">
          {/* Filter Button */}
          <button
            aria-label="Filter"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex items-center gap-1 border border-[#d87f0a]/60 text-[#d87f0a] hover:bg-[#d87f0a] hover:text-white text-sm font-semibold rounded px-3 py-1.5 transition-colors"
          >
            <FaFilter />
            Filter
          </button>

          {/* Filter Dropdown Panel */}
          {isFilterOpen && (
            <div className="absolute right-0 top-10 w-60 bg-white border rounded shadow-lg z-20">
              <div className="p-4 space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Gender</label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm outline-none"
                  >
                    <option value="">All</option>
                    <option value="Jss1">Male</option>
                    <option value="Jss2">Female</option>
                 
                  </select>
                </div>

                <div className="flex justify-end gap-2 text-sm">
                  <button
                    className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => {
                      setSelectedClass("");
                      setFilterOpen(false);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-[#d87f0a] text-white hover:bg-[#c06e08]"
                    onClick={() => setFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Student Button */}
          <button
            className="flex items-center gap-1 bg-[#d87f0a] hover:bg-[#c06e08] text-white text-sm font-semibold rounded px-3 py-1.5"
            onClick={() => setAddOpen(true)}
          >
            Add Student
          </button>
        </div>
      </div>

   {/* Real Modal */}
<AddStudentModal
  isOpen={isAddOpen}
  onClose={() => setAddOpen(false)}
  onSave={(newStudent) => {
    setStudents((prev) => [...prev, newStudent]);
    setAddOpen(false);
  }}
/>
<EditStudentModal
  isOpen={!!editing}
  student={editing}
  onClose={() => setEditing(null)}
  onSave={(updated) =>
    setStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    )
  }
/>
<ViewStudentModal
  isOpen={!!viewing}
  student={viewing}
  onClose={() => setViewing(null)}
/>


      {/* Table */}
      <div className="overflow-x-auto border rounded shadow-sm bg-white">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
          <thead className="sticky top-0 bg-white z-10">
            <tr>
              <th className="pl-4 pr-2 py-2">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={students.length > 0 && students.every((s) => s._checked)}
                />
              </th>
              {[
                "School ID",
                "Photo",
                "First Name",
                "Last Name",
                "Class",
                "Date of Birth",
                "Address",
                "Guardian ID",
                "Teacher ID",
                "Gender",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className={`py-2 px-2 whitespace-nowrap ${header === "Actions" ? "pr-4" : ""}`}
                >
                  {header}
                  {header !== "Photo" && header !== "Actions" && (
                    <FaFilter className="inline-block ml-1 text-[10px]" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students
              .filter((s) => (selectedClass ? s.class === selectedClass : true))
              .map((stu) => (
                <tr key={stu.id} className="bg-white hover:bg-gray-50 border border-transparent">
                  <td className="pl-4 pr-2 py-3">
                    <input
                      type="checkbox"
                      checked={!!stu._checked}
                      onChange={() => toggleRow(stu.id)}
                    />
                  </td>
                  <td className="px-2 py-3">{stu.id}</td>
                  <td className="px-2 py-3">
                    <img
                      src={stu.avatar}
                      alt={`${stu.firstName} ${stu.lastName}`}
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  </td>
                  <td className="px-2 py-3">{stu.firstName}</td>
                  <td className="px-2 py-3">{stu.lastName}</td>
                  <td className="px-2 py-3">{stu.class}</td>
                  <td className="px-2 py-3">{stu.dob}</td>
                  <td className="px-2 py-3 truncate max-w-[120px]" title={stu.address}>
                    {stu.address}
                  </td>
                  <td className="px-2 py-3">{stu.guardianId}</td>
                  <td className="px-2 py-3">{stu.teacherId}</td>
                  <td className="px-2 py-3">{stu.gender}</td>
                  <td className="pr-4 pl-2 py-3 flex gap-2">
                   <button
  className="text-[#4a4a8a] hover:text-[#d87f0a]"
  onClick={() => setViewing(stu)}   // stu is the student object
>
  <FaEye />
</button>

                   <button
  className="text-[#3a9d3a] hover:text-[#d87f0a]"
  onClick={() => setEditing(stu)}   // stu is the current row
>
  <FaEdit />
</button>

                    <button
                      className="text-[#d9534f] hover:text-[#d87f0a]"
                      onClick={() => setStudents((prev) => prev.filter((s) => s.id !== stu.id))}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-xs text-[#d87f0a] font-semibold">Page 1 of 1</div>
    </div>
  );
}

export default function AllStudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState(initialStudents);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="flex items-center justify-between gap-4 px-4 py-2 bg-white rounded-xl border shadow-lg mx-2 md:mx-auto mt-5 max-w-7xl w-full md:w-[99%]">
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
                <span className="text-xs text-gray-500">Welcome back</span>
              </div>
            </div>
          </div>
        </div>

        <StudentsTable students={students} setStudents={setStudents} />
      </div>
    </div>
  );
}
