import React, { useState } from "react";
import { X } from "lucide-react";

const AdminCbtUserForm = ({ activeTab, closeModal }: any) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    class: "",
    subject: "",
    password: "",
    dob: "",
    gender: "",
    section: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`${activeTab === "students" ? "Student" : "Teacher"} added successfully!`);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-orange-600 mb-4">
          {activeTab === "students" ? "Add New Student" : "Add New Teacher"}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <input
            type="text"
            name="firstname"
            placeholder="First Name *"
            onChange={handleChange}
            required
            className="w-full border border-orange-200 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name *"
            onChange={handleChange}
            required
            className="w-full border border-orange-200 rounded-lg px-3 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email *"
            onChange={handleChange}
            required
            className="w-full border border-orange-200 rounded-lg px-3 py-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="w-full border border-orange-200 rounded-lg px-3 py-2"
          />

          {activeTab === "students" && (
            <>
              <input
                type="date"
                name="dob"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
                required
              />

              <select
                name="gender"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <select
                name="class"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
                required
              >
                <option value="">Select Class</option>
                <option value="Grade 10A">Grade 10A</option>
                <option value="Grade 11B">Grade 11B</option>
                <option value="Grade 12A">Grade 12A</option>
              </select>

              <select
                name="section"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>

              <input
                type="text"
                name="guardianName"
                placeholder="Guardian Name"
                onChange={handleChange}
                className="w-full md:col-span-2 border border-orange-200 rounded-lg px-3 py-2"
              />

              <input
                type="email"
                name="guardianEmail"
                placeholder="Guardian Email"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="guardianPhone"
                placeholder="Guardian Phone"
                onChange={handleChange}
                className="w-full border border-orange-200 rounded-lg px-3 py-2"
              />
            </>
          )}

          {activeTab === "teachers" && (
            <input
              type="text"
              name="subject"
              placeholder="Subject *"
              onChange={handleChange}
              required
              className="w-full md:col-span-2 border border-orange-200 rounded-lg px-3 py-2"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full md:col-span-2 border border-orange-200 rounded-lg px-3 py-2"
          />

          <div className="flex justify-end space-x-3 w-full md:col-span-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
            >
              {activeTab === "students" ? "Add Student" : "Add Teacher"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCbtUserForm;
