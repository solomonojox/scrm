import React from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const CbtLogin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center px-4 py-10">
        {/* Login Card */}
        <div className="bg-white w-full max-w-[800px] shadow-lg rounded-2xl p-6 border border-orange-100">
          <h2 className="text-2xl font-bold text-orange-600 mb-2 capitalize">Login</h2>

          <p className="text-gray-600 mb-6 text-sm">
            Enter your school registration number, email and password to access your exams.
          </p>

          {/* Registration Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              School Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g., SCH2024001"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email Address</label>
            <input
              type="email"
              placeholder="info@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2 
              focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white 
            font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-gray-600 text-sm">
          School not registered yet?{" "}
          <Link to="/cbt/registerschool" className="text-orange-500 font-semibold hover:underline">
            Register Your School
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CbtLogin;
