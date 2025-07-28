import React from "react";
import { FaSearch, FaBell, FaComment } from "react-icons/fa";
import Adminheader from './Adminheader';
import AdminSidebar from './AdminSidebar';
const AllSessions = () => {
  return (
    <div className="bg-[#f8f8f8] font-sans text-[13px] text-[#333] min-h-screen">
      {/* MAIN CONTENT */}
        <Adminheader />
          <AdminSidebar />
      <div className="flex-1 pl-64">
        {/* TOPBAR */}
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
            <FaBell className="text-gray-500 hover:text-orange-500 cursor-pointer" />
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

        {/* Breadcrumb and Add Button */}
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between mb-3">
            <nav
              className="flex items-center space-x-1 text-[13px] text-[#666] font-normal select-none"
              aria-label="Breadcrumb"
            >
              <span>Home</span>
              <svg
                className="w-3 h-3 text-[#666]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              <span className="font-semibold text-[#d46b00]">All Sessions</span>
            </nav>
            <button
              type="button"
              className="flex items-center gap-1 bg-[#f07e00] hover:bg-[#d46b00] text-white text-[13px] font-semibold rounded px-3 py-1.5"
            >
              Add Session
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-[0_3px_6px_0_rgba(0,0,0,0.16)]">
              <thead className="border-b border-[#ddd]">
                <tr className="text-[13px] text-[#333] font-semibold select-none">
                  <th className="w-[40px] px-4 py-3 text-left">
                    <input type="checkbox" className="cursor-pointer" />
                  </th>
                  {["School ID", "Session ID", "Session Name", "Start Date", "End Date", "Actions"].map(
                    (heading, index) => (
                      <th
                        key={index}
                        className={`px-4 py-3 whitespace-nowrap cursor-pointer ${
                          heading === "Actions" ? "text-center" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1 ${
                            heading === "Actions" ? "justify-center" : ""
                          }`}
                        >
                          {heading}
                          <i className="fas fa-sort text-[#666] text-[10px]" />
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={index}
                    className="bg-white shadow-[0_3px_6px_0_rgba(0,0,0,0.16)] rounded-md mb-2"
                  >
                    <td className="w-[40px] px-4 py-4 text-left align-middle">
                      <input type="checkbox" className="cursor-pointer" />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle">10001</td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle">12345</td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle">2024/2025</td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle">25-09-2025</td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle">25-09-2025</td>
                    <td className="px-4 py-4 whitespace-nowrap align-middle text-center space-x-3">
                      <button aria-label="View" className="text-[#3b3b98] hover:text-[#2a2a6e]">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button aria-label="Edit" className="text-[#2f9e2f] hover:text-[#1f6e1f]">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button aria-label="Delete" className="text-[#d9534f] hover:text-[#a73733]">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 bg-[#f0f0f0] text-[12px] text-[#666] font-semibold py-2 select-none flex justify-center items-center gap-2">
            <span className="text-[#d46b00] cursor-default select-none">◄</span>
            <span>Page 1 of 0</span>
            <span className="text-[#d46b00] cursor-default select-none">►</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSessions;
