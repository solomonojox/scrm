import React, { useState, useRef, useEffect } from "react";
import AdminSidebar from "../Admin/AdminSidebar";
import Adminheader from "../Admin/Adminheader";

import {
  FaPlus,
  FaSort,
  FaEye,
  FaEdit,
  FaTrashAlt,
  FaAngleRight,
  FaTimes,
} from "react-icons/fa";

const AllClassrooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [formData, setFormData] = useState({
    id: null,
    schoolId: "",
    name: "",
    teacherId: "",
    capacity: "",
  });

  const [classrooms, setClassrooms] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      schoolId: `1000${index + 1}`,
      name: `Classroom ${index + 1}`,
      teacherId: `TCHR-${1000 + index}`,
      capacity: `${20 + index}`,
    }))
  );

  const modalRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setModalType("add");
    setFormData({
      id: null,
      schoolId: "",
      name: "",
      teacherId: "",
      capacity: "",
    });
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

  const handleDelete = (id) => {
    const updated = classrooms.filter((c) => c.id !== id);
    setClassrooms(updated);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalType === "edit") {
      setClassrooms((prev) =>
        prev.map((c) => (c.id === formData.id ? formData : c))
      );
    } else {
      const newClassroom = {
        ...formData,
        id: classrooms.length ? classrooms[classrooms.length - 1].id + 1 : 1,
      };
      setClassrooms((prev) => [...prev, newClassroom]);
    }
    setIsModalOpen(false);
    setFormData({ id: null, schoolId: "", name: "", teacherId: "", capacity: "" });
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen]);

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
              Home /{" "}
              <span className="text-orange-500 font-semibold ml-1">
                All Classrooms
              </span>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 transition-transform text-white px-5 py-2.5 rounded text-sm font-semibold shadow-lg"
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
                    <div className="flex items-center gap-1">
                      School ID <FaSort className="text-gray-400 text-xs" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Teacher ID
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">
                    Capacity
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classrooms.map((classroom) => (
                  <tr key={classroom.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{classroom.schoolId}</td>
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
                        <FaTrashAlt
                          className="text-red-600 hover:text-red-800 cursor-pointer transition"
                          onClick={() => handleDelete(classroom.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
            <span>
              Showing 1 to {classrooms.length} of {classrooms.length} results
            </span>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 border rounded hover:bg-gray-100">
                1
              </button>
              <FaAngleRight className="text-orange-500" />
            </div>
          </div>
        </main>

       
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden"
          >
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

            <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
              {["schoolId", "name", "teacherId", "capacity"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm text-gray-700 mb-1 capitalize"
                  >
                    {field.replace("Id", " ID")}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={modalType === "view" ? "" : formData[field]}
                    onChange={handleChange}
                    placeholder={
                      modalType === "view"
                        ? formData[field]
                        : `Enter ${field.replace("Id", " ID")}`
                    }
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
