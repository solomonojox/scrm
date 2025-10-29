import React from "react";
import { Link } from "react-router-dom";

const RegisterSchool = () => {
  return (
    <div className="min-h-screen bg-orange-50 font-sans py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between px-4">
        <h1 className="text-3xl font-bold text-orange-600">Educat CBT</h1>
        <Link
          to="/studentscbt"
          className="text-orange-500 font-semibold hover:underline"
        >
          ← Back to Login
        </Link>
      </div>

      {/* Registration Card */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-6">
          Register Your School
        </h2>

        {/* SCHOOL INFO */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
            School Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                placeholder="Enter school name"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">School Email</label>
              <input
                type="email"
                placeholder="Enter school email"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">School Phone NUmber</label>
             <input
                type="tel"
                placeholder="Enter school Phone number"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <div>
              <label className="block text-gray-700 mb-1">School Type</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none">
                <option value="">Select Type</option>
                <option>Primary</option>
                <option>Secondary</option>
                <option>College</option>
              </select>
            </div>
            </div>
          </div>
        </div>

        {/* ADDRESS INFO */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
            Address Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">School Address</label>
              <input
                type="text"
                placeholder="Enter school address"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">State</label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Country</label>
              <input
                type="text"
                placeholder="Enter country"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* PRINCIPAL INFO */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
            Principal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Principal’s name"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g., +234 801 234 5678"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="principal@school.edu"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* ADMIN SETUP */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
            Admin Setup
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Admin Username</label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Admin Email</label>
              <input
                type="email"
                placeholder="admin@school.edu"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter password"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition">
            Cancel
          </button>
          <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition">
            Register School
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSchool;


