import React from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";


const RegistrationForm = () => {
  return (
    <>
      {/* Site header */}
      <Header />

      {/* Page content */}
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-md shadow-md w-full max-w-2xl p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-black">Registration Form</h2>
          <p className="text-center text-orange-500 mt-1">
            Fill out the form below to get your school started with <span className="font-semibold">EduCat</span>.
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">
            Note: Complete each section before moving to the next.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4 mb-6">
            {/* TODO: Replace 100% with dynamic progress */}
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
          </div>

          {/* Steps Navigation */}
          <nav className="flex justify-between text-sm text-orange-600 font-medium mb-6">
            <Link to="/addschoolform" className="hover:underline">
              Add School
            </Link>
            <Link to="/AddSchool" className="hover:underline">
              Upload School License
            </Link>
            <Link to="/Accountregistration" className="hover:underline">
              Add Account Details
            </Link>
            <Link to="/AddAdmin" className="underline">
              Add School Admin
            </Link>
          </nav>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Site footer */}
      <Footer />
    </>
  );
};

export default RegistrationForm;
