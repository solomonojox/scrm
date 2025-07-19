import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

/**
 * RegistrationForm
 * -----------------
 * Collects and validates a school's banking details so that
 * EduCat can handle transactions such as fee payments and refunds.
 */
export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    branchName: "",
    accountType: "",
    sortCode: "",
    swiftCode: "",
  });

  /** Handle generic input changes */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /** Submit the form data (Replace with actual API call) */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted!");
  };

  /** Field definitions used to generate the inputs */
  const fields = [
    { id: "accountName", label: "Account Name" },
    { id: "bankName", label: "Bank Name" },
    { id: "accountNumber", label: "Account Number" },
    { id: "branchName", label: "Branch Name" },
    { id: "accountType", label: "Account Type" },
    { id: "sortCode", label: "Sort Code (For local transfers only)" },
    {
      id: "swiftCode",
      label: "Swift Code (For international payments only — Optional)",
    },
  ];

  return (
    <>
      {/* Site Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-6 font-sans">
        {/* Title & Description */}
        <h1 className="font-extrabold text-lg text-center">Registration Form</h1>
        <p className="text-center italic text-orange-600 mt-1 text-sm font-semibold">
          Fill out the form below to get your school started with EduCat.
        </p>
        <p className="text-center text-[10px] text-gray-600 mt-0.5">
          Note: Complete each section before moving to the next.
        </p>

        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full bg-gray-300 rounded-full relative">
          {/* Adjust width to reflect correct progress (100%) */}
          <div className="h-1 bg-green-600 rounded-full w-85"></div>
          <span className="absolute right-0 -top-4 text-[10px] text-gray-400 font-semibold">
            100%
          </span>
        </div>

        {/* Step Navigation */}
        <nav className="flex justify-between mt-3 text-orange-600 font-semibold text-xs">
          <Link to="/addschoolform" className="hover:underline">
            Add School
          </Link>
          <Link to="/AddSchool" className="hover:underline">
            Upload School License
          </Link>
          <Link to="/AddAccount" className="underline">
            Add Account Details
          </Link>
          <Link to="/AddAdmin" className="hover:underline">
            Add School Admin
          </Link>
        </nav>

        {/* Info Message */}
        <p className="mt-4 text-center italic text-xs font-semibold">
          <span className="not-italic">
            Please enter your school’s bank details to enable secure transactions like fee
            payments, refunds etc.
          </span>
        </p>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 text-xs text-gray-700 font-normal"
        >
          {fields.map(({ id, label }) => (
            <div key={id}>
              <label htmlFor={id} className="block mb-1 font-medium">
                {label}
              </label>
              <input
                id={id}
                type="text"
                value={formData[id]}
                onChange={handleChange}
                placeholder="Enter Here"
                className="w-full border border-orange-300 rounded px-2 py-1 text-xs placeholder:text-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded text-sm"
          >
            Submit
          </button>
        </form>

        {/* Security Notice */}
        <p className="mt-2 text-[10px] text-red-600 italic font-semibold">
          Security Notice: EduCat encrypts all sensitive banking information and complies
          with financial data protection standards to keep your information secure.
        </p>
      </main>

      {/* Site Footer */}
      <Footer />
    </>
  );
}
