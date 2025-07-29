import React from 'react';
import Adminheader from './Adminheader';
import AdminSidebar from './AdminSidebar';

export default function SchoolFeesPage() {
  return (
    <div className="flex bg-gray-50 font-[Inter] min-h-screen">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <AdminSidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="fixed top-0 left-64 right-0 z-20">
          <Adminheader />
        </div>

        {/* Page Container (offset below fixed header) */}
        <div className="mt-20 px-4 sm:px-6 pb-6 space-y-6">
          {/* Topbar: Search + Profile */}
          <header className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 bg-white rounded-lg shadow px-4 py-3">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 w-full max-w-md">
              <i className="fas fa-search text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent text-sm placeholder-gray-400 text-gray-700 focus:outline-none ml-2 w-full"
              />
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-800 text-lg" aria-label="Notifications">
                <i className="far fa-bell" />
              </button>
              <button className="text-gray-600 hover:text-gray-800 text-lg" aria-label="Messages">
                <i className="far fa-comment" />
              </button>
              <div className="flex items-center space-x-3 bg-white shadow rounded-lg px-3 py-1">
                <img
                  src="https://storage.googleapis.com/a1aa/image/71e184d1-2da3-4edd-a418-bbdff8651b75.jpg"
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-right">
                  <p className="text-gray-800 text-sm font-semibold leading-4">Gold Academy</p>
                  <p className="text-gray-400 text-xs leading-3">Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Breadcrumb + Add Fee Button */}
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600 flex items-center space-x-2">
              <span>Home</span>
              <i className="fas fa-caret-right text-xs text-gray-400" />
              <span className="text-orange-600 font-semibold">All School Fees</span>
            </nav>
            <div className="flex items-center space-x-2">
              <button title="Filter" className="text-gray-600 hover:text-gray-800 text-lg" aria-label="Filter">
                <i className="fas fa-filter" />
              </button>
              <button className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded px-4 py-2">
                Add School Fees
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-xs font-semibold text-gray-700 text-left">
                  <th className="pl-4 pr-6 py-2">School ID <i className="fas fa-sort ml-1" /></th>
                  <th className="px-6 py-2">Session ID <i className="fas fa-sort ml-1" /></th>
                  <th className="px-6 py-2">Amount <i className="fas fa-sort ml-1" /></th>
                  <th className="px-6 py-2">Classroom ID <i className="fas fa-sort ml-1" /></th>
                  <th className="pr-4 py-2 text-center">Actions <i className="fas fa-sort ml-1" /></th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="bg-white shadow rounded-lg">
                    <td className="pl-4 pr-6 py-4 align-middle">
                      <input type="checkbox" className="w-4 h-4 border-gray-300 rounded" />
                      <span className="ml-4 text-xs text-gray-600 font-medium">10001</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">10005</td>
                    <td className="px-6 py-4 text-xs text-gray-600">230,000</td>
                    <td className="px-6 py-4 text-xs text-gray-600">100002</td>
                    <td className="pr-4 py-4 text-center space-x-3">
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm" aria-label="View">
                        <i className="fas fa-eye" />
                      </button>
                      <button className="text-green-600 hover:text-green-700 text-sm" aria-label="Edit">
                        <i className="fas fa-edit" />
                      </button>
                      <button className="text-red-600 hover:text-red-700 text-sm" aria-label="Delete">
                        <i className="fas fa-trash-alt" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <footer className="text-xs text-gray-600 flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-caret-left" />
              <span>Page 1 of 1</span>
              <i className="fas fa-caret-right" />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
