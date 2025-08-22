import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import { onboardingService } from "../../Services/Auth/onboarding";

const formFields = [
  { label: "School Name", name: "schoolName", type: "text", placeholder: "Enter Name" },
  { label: "School Email", name: "schoolEmail", type: "email", placeholder: "Enter Email" },
  { label: "School Phone Number", name: "schoolPhone", type: "tel", placeholder: "Enter Number" },
  { label: "School Address", name: "address", type: "text", placeholder: "Enter Address" },
  { label: "Country", name: "country", type: "text", placeholder: "Enter Country" },
  { label: "State", name: "state", type: "text", placeholder: "Enter State" },
  { label: "City", name: "city", type: "text", placeholder: "Enter City" },
  { label: "Owner Name", name: "ownerName", type: "text", placeholder: "Enter Name" },
  { label: "Owner Phone Number", name: "ownerPhone", type: "tel", placeholder: "Enter Number" },
  { label: "Owner Email", name: "ownerEmail", type: "email", placeholder: "Enter Email" },
  { label: "Password", name: "password", type: "password", placeholder: "Enter Password" }
];

const schoolTypes = ["Primary", "Secondary", "College"];

const AddSchoolForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolEmail: "",
    schoolPhone: "",
    address: "",
    typeOfSchool: "",
    country: "",
    state: "",
    city: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
    password: "",
    hasAgreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [schoolRegNumber, setSchoolRegNumber] = useState("");


  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };


  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await onboardingService.addSchool(formData);
      console.log(res.schoolId);
      const id = res.schoolId
      // console.log(id);
      if (id) {
        localStorage.setItem("schoolIdOnRegistration", id);
        localStorage.setItem("continueRegistration", 'upload-license');
        setSchoolRegNumber(res.registrationNumber);
        setSuccessModal(true);
      }
      setSuccess("School registered successfully!");

    } catch (err) {
      console.log(err)
      const msg = err.response?.data?.responseMessage || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const [isContinueRegistration, setIsContinueRegistration] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("continueRegistration")) {
      setIsContinueRegistration(true);
    }
  }, []);

  if (isContinueRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Registration in Progress</h2>
          <p className="text-gray-600 mb-4">
            You have already started the registration process. Please continue from where you left
            off.
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-400 hover:bg-orange-300 text-white font-semibold py-2 px-4 rounded"
            >
              Back Home
            </button>

            <button
              onClick={() => { setIsContinueRegistration(false); localStorage.removeItem("continueRegistration") }}
              className="bg-green-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
            >
              New Registration
            </button>

            <button
              onClick={() => navigate(`/${localStorage.getItem("continueRegistration")}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
            >
              Continue Registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-white flex justify-center px-4 py-8 font-[Inter]">
        <div className="w-full max-w-lg">
          <h1 className="text-center font-extrabold text-black text-xl">Registration Form</h1>
          <p className="text-center italic text-orange-600 text-sm mt-1 font-semibold">
            Fill out the form below to get your school started with EduCat.
          </p>
          <p className="text-center text-[9px] text-gray-600 mt-1">
            Note: Complete each section before moving to the next.
          </p>

          <section className="mt-6">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-600 rounded-full"
                style={{ width: "30%" }}
                aria-label="progress bar"
              />
            </div>
            <div className="text-right text-[11px] text-gray-600 mt-1">30%</div>
            <div className="flex justify-between text-[11px] mt-2 font-semibold text-orange-600">
              <Link to="/add-school-form" className="underline">
                Add School
              </Link>
              <Link to="/upload-license" className="hover:underline">
                Upload School License
              </Link>
              <Link to="/account-registration" className="hover:underline">
                Add Account details
              </Link>
              <Link to="/add-admin" className="hover:underline">
                Add School Admin
              </Link>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {formFields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-[13px] text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full border border-orange-400 rounded-md px-3 py-2 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  required
                />
              </div>
            ))}

            <div>
              <label htmlFor="typeOfSchool" className="block text-[13px] text-gray-700 mb-1">
                Type of School
              </label>
              <select
                id="typeOfSchool"
                name="typeOfSchool"
                value={formData.typeOfSchool}
                onChange={handleChange}
                className="w-full border border-orange-400 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {schoolTypes.map((type) => (
                  <option key={type} value={type.toLowerCase()}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="hasAgreedToTerms"
                type="checkbox"
                checked={formData.hasAgreedToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 accent-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <Link to="/terms" className="text-orange-600 hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading || !formData.hasAgreedToTerms}
              className={`w-full font-semibold py-2 px-4 rounded-md text-sm transition 
                ${loading || !formData.hasAgreedToTerms
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>

        {successModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white max-w-sm w-full p-6 rounded-2xl shadow-xl text-center animate-fade-in">
              {/* Success Icon */}
              <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-green-100">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Heading */}
              <h2 className="text-xl font-bold text-green-600">Success!</h2>

              {/* Message */}
              <p className="mt-2 text-gray-700">
                Your school has been registered successfully. Please copy the School Registration Number below and click
                <strong className="font-medium"> Continue </strong>
                to upload the license.
              </p>

              {/* School ID */}
              <div className="mt-3 bg-gray-100 px-3 py-2 rounded text-sm text-gray-600 font-mono">
                School Reg No.: {schoolRegNumber}
              </div>

              {/* Button */}
              <button
                onClick={() => {
                  setSuccessModal(false);
                  navigate("/upload-license");
                }}
                className="mt-5 w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow-md"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div>
          <button onClick={() => navigate("/upload-license")}>Next</button>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AddSchoolForm;
