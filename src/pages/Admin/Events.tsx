import React, { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBell,
  FaEnvelope,
  FaFlask,
  FaAngleDown,
  FaComment,
  FaSearch,
} from "react-icons/fa";
import Header from "./Adminheader";
import Side from "./AdminSidebar";

const newsItems = new Array(10).fill({
  title: "PTA Meeting",
  description: "This is a sample Event item for testing purposes.",
  venue: "School hall",
  date: "2025-02-02",
  time: "10:00am",
  type: "Internal",
});

const AllEvents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    type: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Event:", formData);
    alert("Event added successfully!");
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      venue: "",
      date: "",
      time: "",
      type: "",
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    document.title = 'EduCat Events';
  }, []);

  return (
    <>
      <div>

        {/* Main Content */}
        <div className="w-full bg-gray-100 p-4">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center ml-1 px-6 py-4 mt-[8px] rounded-md bg-white shadow-md">
            <div className="w-full max-w-sm">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="ml-2 bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <FaBell
                className="text-gray-500 hover:text-orange-500 cursor-pointer"
                onClick={() => setShowModal(true)}
              />

              <FaComment className="text-gray-500 hover:text-orange-500 cursor-pointer" />
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 space-x-2">
                <img
                  src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                  className="w-8 h-8 rounded-full"
                  alt="Admin"
                />
                <div className="text-xs">
                  <div className="font-semibold text-gray-700">Gold Academy</div>
                  <div className="text-gray-400">Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-2 relative">
            <p className="text-sm text-gray-600">
              Home <span className="text-orange-500 font-semibold">: All Events</span>
            </p>
            <div className="flex gap-4 items-center">
              <div
                className="flex items-center gap-2 relative cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
                ref={dropdownRef}
              >
                <span className="text-sm text-orange-500">Select Event Type</span>
                <FaAngleDown className="text-black text-xl" />
                {showDropdown && (
                  <ul className="absolute right-0 mt-8 bg-white border rounded shadow w-40 text-sm z-10">
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">Today</li>
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">This Week</li>
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">This Month</li>
                  </ul>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
              >
                Add Event
              </button>
            </div>
          </div>

          {/* News Table */}
          <div className="bg-white shadow rounded overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">
                    <input type="checkbox" />
                  </th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Venue</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsItems.map((event, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-100">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">{event.title}</td>
                    <td className="p-3">{event.description}</td>
                    <td className="p-3">{event.venue}</td>
                    <td className="p-3">{event.date}</td>
                    <td className="p-3">{event.time}</td>
                    <td className="p-3">{event.type}</td>
                    <td className="p-3 flex gap-2 text-blue-600">
                      <FaEye className="cursor-pointer" />
                      <FaEdit className="cursor-pointer text-green-600" />
                      <FaTrash className="cursor-pointer text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-3 text-center text-sm text-gray-600">
              <span className="text-orange-500">&lt;</span> Page 1 of 1 <span className="text-orange-500">&gt;</span>
            </div>
          </div>

          {/* Modal for Adding News */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
              <div className="bg-white rounded-lg w-[95%] max-w-md">
                <div className="bg-orange-500 h-3 rounded-t-lg"></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Add Event
                  </h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="title"
                      placeholder="Event Title"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="description"
                      placeholder="Event description"
                      required
                      className="border px-3 py-2 rounded"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                    <input
                      type="text"
                      name="venue"
                      placeholder="Event Venue"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.venue}
                      onChange={handleInputChange}
                    />
                    <input
                      type="date"
                      name="date"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                    <input
                      type="time"
                      name="time"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="type"
                      placeholder="Event Type"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.type}
                      onChange={handleInputChange}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllEvents;
