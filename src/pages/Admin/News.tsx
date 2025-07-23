import React, { useState, useEffect, useRef } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBell,
  FaEnvelope,
  FaFlask,
  FaAngleDown,
} from "react-icons/fa";
import Header from "./Adminheader";
import Side from "./AdminSidebar";

const newsItems = new Array(10).fill({
  title: "Breaking News",
  content: "This is a sample news item for testing purposes.",
  publishDate: "2025-02-02",
});

const AllNews = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    publishDate: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted News:", formData);
    alert("News added successfully!");
    setIsModalOpen(false);
    setFormData({
      title: "",
      content: "",
      publishDate: "",
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Header />
      <div className="mt-[70px] min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-50 top-0 left-0 h-full bg-white shadow-md md:w-1/5 w-2/3 transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Side />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="w-full md:w-4/5 bg-gray-100 p-4">
          {/* Top bar */}
          <div className="flex justify-between items-center bg-white px-4 py-3 shadow rounded mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-2xl text-black"
              >
                ☰
              </button>
              <input
                type="text"
                placeholder="Search"
                className="border px-4 py-2 rounded-2xl w-40 md:w-1/3 bg-gray-200"
              />
            </div>
            <div className="flex items-center gap-6">
              <FaEnvelope className="text-xl text-black cursor-pointer" />
              <FaBell className="text-xl text-black cursor-pointer" />
              <div className="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                  className="w-10 h-10 rounded-full"
                  alt="admin"
                />
                <div className="text-sm">
                  <p className="font-bold">Gold Academy</p>
                  <p className="text-gray-500">Admin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-2 relative">
            <p className="text-sm text-gray-600">
              Home{" "}
              <span className="text-orange-500 font-semibold">: All News</span>
            </p>
            <div className="flex gap-4 items-center">
              <div
                className="flex items-center gap-2 relative cursor-pointer"
                onClick={() => setShowDropdown((prev) => !prev)}
                ref={dropdownRef}
              >
                <span className="text-sm text-orange-500">Select Date</span>
                <FaAngleDown className="text-black text-xl" />
                {showDropdown && (
                  <ul className="absolute right-0 mt-8 bg-white border rounded shadow w-40 text-sm z-10">
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                      Today
                    </li>
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                      This Week
                    </li>
                    <li className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                      This Month
                    </li>
                  </ul>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded shadow hover:bg-orange-600"
              >
                Add News
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
                  <th className="p-3">Content</th>
                  <th className="p-3">Publish Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsItems.map((news, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-100">
                    <td className="p-3">
                      <input type="checkbox" />
                    </td>
                    <td className="p-3">{news.title}</td>
                    <td className="p-3">{news.content}</td>
                    <td className="p-3">{news.publishDate}</td>
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
              <span className="text-orange-500">&lt;</span> Page 1 of 1{" "}
              <span className="text-orange-500">&gt;</span>
            </div>
          </div>

          {/* Modal for Adding News */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg w-[95%] max-w-md">
                <div className="bg-orange-500 h-3 rounded-t-lg"></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Add News
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-4"
                  >
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                    <textarea
                      name="content"
                      placeholder="Content"
                      required
                      className="border px-3 py-2 rounded"
                      rows="3"
                      value={formData.content}
                      onChange={handleInputChange}
                    ></textarea>
                    <input
                      type="date"
                      name="publishDate"
                      required
                      className="border px-3 py-2 rounded"
                      value={formData.publishDate}
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

export default AllNews;
