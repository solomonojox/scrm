import React from "react";
import { FaSearch, FaBell, FaCommentAlt, FaArrowLeft, FaCheck } from "react-icons/fa";
import GuardianSidebar from "../GuardianSidebar";
import Footer from "../../Footer";

export default function LoanPayment() {
  return (
    <div className="flex min-h-screen bg-[#EDEDED]  text-gray-900 font-inter">
      {/* Main + Footer wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full bg-white rounded-2xl shadow-md p-6">

            {/* Title */}
            <div className="mb-6 flex items-center border-b pb-3">
              <FaArrowLeft className="text-gray-700 text-lg mr-2" />
              <span className="font-semibold text-lg tracking-wide">
                Settle Your Loan, Fast and Convenient!
              </span>
            </div>

            {/* Progress steps */}
            <div className="bg-white rounded p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between max-w-3xl mx-auto relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-green-600" />
                <div className="flex flex-col items-center w-1/3 relative z-10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-600 bg-green-50">
                    <FaCheck className="text-green-600 text-sm" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-700">Loan Details</p>
                </div>
                <div className="flex flex-col items-center w-1/3 relative z-10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-600 bg-white text-green-600 font-semibold">
                    2
                  </div>
                  <p className="mt-2 text-xs font-semibold text-gray-700">Payment Method</p>
                </div>
                <div className="flex flex-col items-center w-1/3 relative z-10">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-600 bg-white"></div>
                  <p className="mt-2 text-xs font-semibold text-gray-700">Confirmation</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="max-w-4xl mx-auto space-y-8">
              {/* Payment methods */}
              <fieldset className="flex items-center justify-between max-w-4xl">
                {["mastercard", "visa", "verve"].map((method, idx) => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      defaultChecked={idx === 0}
                      className={`w-4 h-4 ${idx === 0 ? "text-orange-600 border-orange-600 focus:ring-orange-600" : "text-gray-400 border-gray-400 focus:ring-gray-400"
                        }`}
                    />
                    <div className="border border-gray-300 rounded-lg p-2 shadow-sm hover:shadow-md transition">
                      <img
                        src={
                          idx === 0
                            ? "https://storage.googleapis.com/a1aa/image/74f764ac-a102-4b65-003c-e41b3ff54d55.jpg"
                            : idx === 1
                              ? "https://storage.googleapis.com/a1aa/image/8c4ac3f2-7d78-45af-6fef-c01f15fc4c06.jpg"
                              : "https://storage.googleapis.com/a1aa/image/df408d70-2a32-4931-61c9-a4ddd12450c0.jpg"
                        }
                        alt={method}
                        className="w-20 h-auto"
                      />
                    </div>
                  </label>
                ))}
              </fieldset>

              {/* Card details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-gray-600 text-sm font-normal">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    placeholder="Enter Number"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cardHolder" className="text-gray-600 text-sm font-normal">
                    Card Holder
                  </label>
                  <input
                    id="cardHolder"
                    type="text"
                    defaultValue="David Ethan"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-gray-600 text-sm font-normal">Expiry Date</label>
                  <div className="flex space-x-4">
                    <select className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600">
                      <option>Month</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i}>{String(i + 1).padStart(2, "0")}</option>
                      ))}
                    </select>
                    <select className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600">
                      <option>Year</option>
                      {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvc" className="text-gray-600 text-sm font-normal">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="Enter Here"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Save details */}
              <div className="max-w-4xl mx-auto flex items-center space-x-2 text-gray-600 text-xs">
                <input
                  type="checkbox"
                  id="saveDetails"
                  className="w-4 h-4 border border-gray-300 rounded text-green-600 focus:ring-green-600"
                />
                <label htmlFor="saveDetails">Save my details for future payments</label>
              </div>

              {/* Subtotal + total */}
              <div className="max-w-4xl mx-auto mt-6 space-y-2">
                <div className="flex justify-between bg-gray-100 px-4 py-2 text-gray-700 text-sm rounded">
                  <span>Subtotal</span>
                  <span>N150,000</span>
                </div>
                <div className="flex justify-between bg-gray-200 px-4 py-2 font-semibold text-gray-900 text-sm rounded">
                  <span>Total</span>
                  <span>N150,000</span>
                </div>
              </div>

              {/* Confirm button */}
              <div className="max-w-4xl mx-auto mt-6">
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm py-3 rounded-lg shadow-md transition"
                >
                  Confirm Payment
                </button>
              </div>

              {/* Bank transfer info */}
              <div className="max-w-4xl mx-auto mt-6 text-xs text-gray-700 space-y-1">
                <p className="font-bold">For Bank transfers only</p>
                <p>Account Type: Savings Account</p>
                <p>Bank: Sterling Bank</p>
                <p>Account Name: Gold Academy</p>
                <p>Branch: Ikorodu, Lagos</p>
                <p className="text-red-700 font-semibold">
                  Kindly call this number to confirm your transaction - 07277777767
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
