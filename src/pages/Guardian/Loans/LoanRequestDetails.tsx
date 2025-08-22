import React from "react";
import {
  FaSearch,
  FaBell,
  FaArrowLeft,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import GuardianSidebar from "../GuardianSidebar";
import Footer from "../../Footer"; // ✅ import footer

const loanData = {
  name: "David Ethan",
  role: "Medical Doctor",
  email: "ethandavid12@gmail.com",
  phone: "0213566878885",
  address: "No 12 woodwork street Lagos",
  status: "Approved",
  profileImg:
    "https://storage.googleapis.com/a1aa/image/ba89311d-c755-413c-f40c-8646b05590fe.jpg",
  heroImg:
    "https://storage.googleapis.com/a1aa/image/db5a3e9d-6e26-4020-9c5b-c7db77a75965.jpg",
  guarantorFormImg:
    "https://storage.googleapis.com/a1aa/image/5668e63f-8ec1-4fae-1a28-a76bff912501.jpg",
  details: {
    guardianId: "David Ethan",
    phoneNumber: "09876522333",
    loanPurpose: "School Fees",
    amountRequested: "N150,000",
    requestDate: "22-03-2025",
    paymentDuration: "3 Months",
    interestRate: "20%",
    monthlyPayment: "N50,000",
    statusBadge: "Approved",
    dateApproved: "27-09-2025",
    firstRepaymentDate: "29-09-2025",
    finalRepaymentDate: "23-12-2025",
    guarantorName: "Joseph Peters",
    relationship: "Uncle",
    balanceRemaining: "N50,000",
  },
};

export default function LoanRequestDetails({ data = loanData }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 h-screen sticky top-0">
        <GuardianSidebar />
      </aside>

      {/* Main Content + Footer */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between py-3 px-4 bg-white rounded-md shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="relative text-gray-400">
                  <input
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search"
                    type="search"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <button
                  aria-label="Notifications"
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  <FaBell />
                </button>
                <div className="flex items-center space-x-3">
                  <img
                    alt="profile"
                    src={data.profileImg}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{data.name}</p>
                    <p className="text-xs text-gray-500">Guardian</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Greeting */}
            <section className="mt-6 px-2">
              <h1 className="text-lg font-semibold text-gray-900">
                Hello {data.name}! Find Details of Your Loan Request Below
              </h1>
            </section>

            {/* Actions */}
            <section className="mt-3 flex items-center justify-between px-2">
              <button className="text-gray-700 text-lg font-semibold flex items-center space-x-2">
                <FaArrowLeft />
                <span>Back</span>
              </button>

              <div className="flex space-x-3">
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2 px-4 rounded flex items-center space-x-2"
                  type="button"
                >
                  <FaPrint />
                  <span>Print</span>
                </button>
                <button
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2 px-4 rounded flex items-center space-x-2"
                  type="button"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
              </div>
            </section>

            {/* Loan Details Card */}
            <main className="mt-4 bg-white rounded-md shadow-sm overflow-hidden">
              <div className="relative">
                {/* Hero image */}
                <div className="w-full h-44 md:h-56 overflow-hidden">
                  <img
                    src={data.heroImg}
                    alt="hero"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Profile */}
                <div className="absolute left-6 -bottom-14 flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={data.profileImg}
                      alt="profile"
                      className="w-32 h-32 md:w-32 md:h-32 rounded-full object-cover border-8 border-white shadow-lg"
                    />
                  </div>

                  <div className="ml-1 mt-20">
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {data.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{data.role}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="absolute right-6 -bottom-28 flex flex-col items-end space-y-2">
                  <div className="text-sm font-semibold text-gray-700">
                    Status: <span className="text-green-600">{data.status}</span>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-md shadow-md p-3 text-xs text-gray-700 max-w-xs w-full">
                    <p className="mb-1">
                      <span className="font-semibold">Email: </span>
                      {data.email}
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold">Phone Number: </span>
                      {data.phone}
                    </p>
                    <p className="whitespace-normal">
                      <span className="font-semibold">Address: </span>
                      {data.address}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-20" />

              {/* Loan Info */}
              <section className="px-6 py-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Loan Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 text-sm text-gray-700">
                  {Object.entries(data.details).map(([key, value]) => (
                    <div key={key}>
                      <p className="font-semibold mb-1">
                        {key.replace(/([A-Z])/g, " $1")}
                      </p>
                      {key === "guarantorFormImg" ? (
                        <img
                          alt="guarantor form"
                          className="border border-orange-400 rounded-sm"
                          height={50}
                          width={80}
                          src={value}
                        />
                      ) : (
                        <p>{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </main>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </div>
  );
}
