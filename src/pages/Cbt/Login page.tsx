import React, { useState } from "react";

const EducatLogin = () => {
  const [activeTab, setActiveTab] = useState("student");

  const tabs = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "admin", label: "School Admin" },
  ];

  // ✅ Simple navigation (no router)
  const handleLogin = () => {
    if (activeTab === "admin") {
      window.location.href = "/admincbt";
    } else if (activeTab === "teacher") {
      window.location.href = "/teacher-dashboard.html";
    } else {
      window.location.href = "/student-dashboard.html";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 font-sans">
      {/* Header Tabs */}
      <div className="flex space-x-4 mb-8 w-[800px] items-center justify-center bg-white shadow-md rounded-full px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === tab.id
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:text-orange-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-white w-[800px] shadow-lg rounded-2xl p-4 border border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-2 capitalize">
          {activeTab} Login
        </h2>
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
            placeholder="e.g., SCH-2024-001"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="student@school.edu"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* ✅ Login Button (uses plain navigation) */}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Login as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Demo: Use any school registration number, email and password
        </p>
      </div>

      {/* Footer */}
      <p className="mt-6 text-gray-600 text-sm">
        School not registered yet?{" "}
        <a href="#" className="text-orange-500 font-semibold hover:underline">
          Register Your School
        </a>
      </p>
    </div>
  );
};

export default EducatLogin;
