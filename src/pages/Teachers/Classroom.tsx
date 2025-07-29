import React, { useState } from "react";
import AdminSidebar from "../Admin/AdminSidebar";
import Adminheader from "../Admin/Adminheader";
import Footer from "../Footer";
import {
  FaPlus,
  FaSort,
  FaEye,
  FaEdit,
  FaCopy,
  FaTrashAlt,
  FaAngleRight,
  FaTimes,
} from "react-icons/fa";

const AllClassrooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({
    schoolId: "",
    name: "",
    teacherId: "",
    capacity: "",
  });

  const classrooms = Array.from({ length: 10 }, (_, index) => ({
    schoolId: `1000${index + 1}`,
    name: `Classroom ${index + 1}`,
    teacherId: `TCHR-${1000 + index}`,
    capacity: `${20 + index}`,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setModalType("add");
    setFormData({ schoolId: "", name: "", teacherId: "", capacity: "" });
    setIsModalOpen(true);
  };

  const handleView = (classroom) => {
    setModalType("view");
    setFormData(classroom);
    setIsModalOpen(true);
  };

  const handleEdit = (classroom) => {
    setModalType("edit");
    setFormData(classroom);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    console.log(`${modalType === "edit" ? "Updated" : "Submitted"} data:`, formData);
    setFormData({ schoolId: "", name: "", teacherId: "", capacity: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-sm text-gray-700 flex relative font-[Inter]">
      <aside className="w-64 fixed top-0 left-0 h-full bg-white shadow z-10">
        <AdminSidebar />
      </aside>

      <div className="ml-64 flex-1 flex flex-col min-h-screen relative z-20">
        <header className="fixed top-0 left-64 right-0 z-30 bg-white shadow">
          <Adminheader />
        </header>

        <main className="flex-1 p-6 pt-24">
          <div className="flex justify-between items-center mb-6">
            <div className="text-gray-600">
              Home / <span className="text-orange-500 font-semibold ml-1">All Classrooms</span>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-transform text-white px-5 py-2.5 rounded text-sm font-semibold shadow-lg uppercase"
              title="Add a new classroom"
            >
              <FaPlus className="text-base" />
              Add Classroom
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full table-auto text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded" />
                      School ID
                      <FaSort className="text-gray-400 text-xs" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Name <FaSort className="text-gray-400 text-xs" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Teacher ID <FaSort className="text-gray-400 text-xs" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                      Capacity <FaSort className="text-gray-400 text-xs" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classrooms.map((classroom, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded" />
                        {classroom.schoolId}
                      </div>
                    </td>
                    <td className="px-4 py-3">{classroom.name}</td>
                    <td className="px-4 py-3">{classroom.teacherId}</td>
                    <td className="px-4 py-3">{classroom.capacity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 text-sm">
                        <FaEye
                          className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition"
                          onClick={() => handleView(classroom)}
                        />
                        <FaEdit
                          className="text-green-600 hover:text-green-800 cursor-pointer transition"
                          onClick={() => handleEdit(classroom)}
                        />
                        <FaCopy className="text-teal-600 hover:text-teal-800 cursor-pointer transition" />
                        <FaTrashAlt className="text-red-600 hover:text-red-800 cursor-pointer transition" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
            <span>Showing 1 to 10 of 10 results</span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded hover:bg-gray-100">1</button>
              <FaAngleRight className="text-orange-500" />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl mx-auto rounded-lg shadow-lg overflow-hidden">
            <div className="bg-[#f3700a] flex justify-between items-center px-6 py-3">
              <h2 className="text-white font-semibold text-base">
                {modalType === "view"
                  ? "View Classroom"
                  : modalType === "edit"
                  ? "Edit Classroom"
                  : "Add Classroom"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} aria-label="Close">
                <FaTimes className="text-white" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-6">
              {["schoolId", "name", "teacherId", "capacity"].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm text-gray-700 mb-1 capitalize">
                    {field.replace("Id", " ID")}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={modalType === "view" ? "" : formData[field]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    readOnly={modalType === "view"}
                    className="w-full border border-[#f3700a] rounded-md px-3 py-2 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#f3700a]"
                    required={modalType !== "view"}
                  />
                </div>
              ))}

              {modalType !== "view" && (
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="bg-[#f3700a] hover:bg-[#e95f00] text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    {modalType === "edit" ? "Update" : "Submit"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllClassrooms;
