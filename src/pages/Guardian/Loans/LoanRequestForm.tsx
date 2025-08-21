import React from "react";
import GuardianSidebar from "../GuardianSidebar";

export default function LoanRequestForm() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <GuardianSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Request For Loan
        </h2>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto bg-white border-4 border-blue-400 rounded-md shadow p-8 relative">
          {/* Profile Image */}
          <div className="flex justify-center -mt-20 mb-6">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md"
            />
          </div>

          {/* Form */}
          <form className="space-y-4">
            {/* Name */}
            <input
              type="text"
              placeholder="Enter Here"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Guardian ID */}
            <input
              type="text"
              placeholder="Enter Here"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Phone Number */}
            <input
              type="text"
              placeholder="Enter Here"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Loan Purpose */}
            <input
              type="text"
              placeholder="Enter Here"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Amount Requested */}
            <input
              type="text"
              placeholder="Enter Here"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Request Date */}
            <input
              type="date"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none text-gray-500"
            />

            {/* Payment Duration */}
            <input
              type="text"
              placeholder="3 Months"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Interest Rate */}
            <input
              type="text"
              placeholder="20%"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Monthly Payment */}
            <input
              type="text"
              placeholder="₦50,000"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Status */}
            <input
              type="text"
              placeholder="Not Approved"
              className="w-full border border-orange-400 rounded-md p-2 focus:outline-none"
            />

            {/* Upload (styled as link) */}
            <div className="text-sm text-orange-600 underline cursor-pointer">
              Upload guarantor’s form ⬇
              <input type="file" className="hidden" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-md font-medium hover:bg-orange-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
