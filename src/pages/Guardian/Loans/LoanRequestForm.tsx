import React, { useState } from "react";
import { FaSearch, FaBell, FaComment, FaArrowLeft, FaUpload } from "react-icons/fa";
import GuardianSidebar from "../GuardianSidebar";
import Footer from "../../Footer"; // ✅ import Footer

export default function LoanRequestDetails() {
  const [form, setForm] = useState({
    name: "",
    guardian: "",
    phone: "",
    purpose: "",
    amount: "",
    date: "",
    duration: "3 Months",
    interest: "20%",
    monthly: "N60,000",
    status: "Not Approved",
    guarantorFile: null,
  });

  function handleChange(e) {
    const { id, value, files } = e.target;
    if (files) {
      setForm(prev => ({ ...prev, guarantorFile: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [id]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting loan request:", form);
    alert("Loan request submitted (see console)");
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-100 text-gray-700">
      {/* Sidebar */}
      <aside className="w-64 hidden md:block">
        <GuardianSidebar />
      </aside>

      {/* Main Content + Footer */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white px-4 py-2 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-200 text-gray-600 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    placeholder="Search"
                    type="search"
                    aria-label="Search"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <button aria-label="Notifications" className="text-gray-400 hover:text-gray-600 text-lg">
                  <FaBell />
                </button>
                <button aria-label="Messages" className="text-gray-400 hover:text-gray-600 text-lg">
                  <FaComment />
                </button>
                <div className="flex items-center space-x-3">
                  <img
                    alt="Profile"
                    className="rounded-full border border-gray-300"
                    height="40"
                    width="40"
                    src="https://storage.googleapis.com/a1aa/image/6a0a8fef-eea8-49eb-e587-d5a301ad52af.jpg"
                  />
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-700 leading-none">David Ethan</p>
                    <p className="text-[10px] text-gray-400 leading-none">Customer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Title + Back Button */}
            <div className="mb-3">
              <h1 className="text-gray-800 font-semibold text-lg">Request For Loan</h1>
              <div className="mt-2">
                <button
                  aria-label="Go back"
                  className="text-gray-600 hover:text-gray-800 text-lg flex items-center gap-2"
                >
                  <FaArrowLeft />
                  <span className="text-sm">Back</span>
                </button>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded shadow p-8">
              <div className="flex justify-center mb-8">
                <img
                  alt="Avatar"
                  className="rounded-full border border-white shadow-lg"
                  height="120"
                  width="120"
                  src="https://storage.googleapis.com/a1aa/image/48c48f9b-a598-4bcc-5a46-b4fd8d7b64ea.jpg"
                />
              </div>

              <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
                {/* Inputs */}
                {[
                  { id: "name", label: "Name", type: "text" },
                  { id: "guardian", label: "Guardian ID", type: "text" },
                  { id: "phone", label: "Phone Number", type: "text" },
                  { id: "purpose", label: "Loan Purpose", type: "text" },
                  { id: "amount", label: "Amount Requested", type: "text" },
                  { id: "date", label: "Request Date", type: "date" },
                  { id: "duration", label: "Payment Duration", type: "text" },
                  { id: "interest", label: "Interest Rate", type: "text" },
                  { id: "monthly", label: "Monthly payment Amount", type: "text" },
                  { id: "status", label: "Status", type: "text" },
                ].map(({ id, label, type }) => (
                  <div key={id}>
                    <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor={id}>
                      {label}
                    </label>
                    <input
                      id={id}
                      value={form[id]}
                      onChange={handleChange}
                      className="w-full text-xs border border-orange-400 rounded px-3 py-1.5 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                      placeholder="Enter Here"
                      type={type}
                    />
                  </div>
                ))}

                {/* File Upload */}
                <div>
                  <label className="block text-[10px] text-orange-600 font-semibold mb-1 flex items-center gap-2">
                    <FaUpload className="text-[12px]" />
                    Upload guarantor's form
                  </label>
                  <input
                    onChange={handleChange}
                    className="w-full text-[12px] border border-orange-400 rounded px-2 py-2 text-gray-600 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    type="file"
                    id="guarantorFile"
                    accept=".pdf,.jpg,.png"
                  />
                </div>

                {/* Submit */}
                <button
                  className="w-full bg-orange-600 text-white text-xs font-semibold py-2 rounded mt-6 hover:bg-orange-700 transition"
                  type="submit"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>

        {/* ✅ Footer */}
        <Footer />
      </div>

      <style>
        {`input:focus { outline: none; box-shadow: 0 0 0 1px #f97316; }`}
      </style>
    </div>
  );
}
