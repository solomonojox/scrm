import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const AddClassroom = () => {
  const [formData, setFormData] = useState({
    schoolId: "",
    name: "",
    teacherId: "",
    capacity: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://your-api-url.com/api/classrooms", formData);
      setMessage("Classroom added successfully!");
      console.log("Success:", response.data);

      // Optionally reset form
      setFormData({
        schoolId: "",
        name: "",
        teacherId: "",
        capacity: "",
      });
    } catch (error) {
      console.error("API Error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md shadow-lg rounded-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#f3700a] flex justify-between items-center px-6 py-4">
          <h2 className="text-white font-semibold text-lg">Add Classroom</h2>
          <button
            aria-label="Close"
            className="text-white hover:opacity-80"
            onClick={() => console.log("Close clicked")}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {message && (
            <div
              className={`text-sm font-medium text-center py-2 rounded ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* School ID */}
          <div>
            <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
              School ID
            </label>
            <input
              id="schoolId"
              type="text"
              value={formData.schoolId}
              onChange={handleChange}
              placeholder="Enter ID"
              required
              className="w-full border border-[#f3700a] rounded-md px-3 py-2 text-sm placeholder:text-[#f3700a] focus:outline-none focus:ring-1 focus:ring-[#f3700a]"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter classroom name"
              required
              className="w-full border border-[#f3700a] rounded-md px-3 py-2 text-sm placeholder:text-[#f3700a] focus:outline-none focus:ring-1 focus:ring-[#f3700a]"
            />
          </div>

          {/* Teacher ID */}
          <div>
            <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700 mb-1">
              Teacher ID
            </label>
            <input
              id="teacherId"
              type="text"
              value={formData.teacherId}
              onChange={handleChange}
              placeholder="Enter teacher ID"
              required
              className="w-full border border-[#f3700a] rounded-md px-3 py-2 text-sm placeholder:text-[#f3700a] focus:outline-none focus:ring-1 focus:ring-[#f3700a]"
            />
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter number of students"
              required
              className="w-full border border-[#f3700a] rounded-md px-3 py-2 text-sm placeholder:text-[#f3700a] focus:outline-none focus:ring-1 focus:ring-[#f3700a]"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f3700a] text-white py-2 rounded-md text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassroom;
