import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setSuccessMsg("");
    setErrorMsg("");

    const schoolId = localStorage.getItem("schoolId");

    if (!schoolId) {
      setErrorMsg("School ID not found. Please complete previous steps.");

      setLoading(false);
      return;
    }


    const payload = {
      schoolId,
      fullName,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "https://scrmapi.tranquility.org.ng/api/SchoolAdmin/Register",
        payload
      );

      setSuccessMsg("✅ School admin registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const err = error.response?.data?.title || "Registration failed. Please try again.";
      setErrorMsg(`❌ ${err}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white rounded-md shadow-md w-full max-w-2xl p-8">

          <h2 className="text-2xl font-bold text-center text-black">Registration Form</h2>
          <p className="text-center text-orange-500 mt-1">
            Fill out the form below to get your school started with{" "}
            <span className="font-semibold">EduCat</span>.
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">
            Note: Complete each section before moving to the next.
          </p>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-4 mb-6">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }} />
          </div>

          <nav className="flex justify-between text-sm text-orange-600 font-medium mb-6">
            <Link to="/addschoolform" className="hover:underline">Add School</Link>
            <Link to="/AddSchool" className="hover:underline">Upload School License</Link>


            <Link to="/Accountregistration" className="hover:underline">Add Account Details</Link>
            <Link to="/AddAdmin" className="underline">Add School Admin</Link>
          </nav>

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {successMsg}
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
              {errorMsg}

            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"



                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter Name"

                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input

                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"

                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

                placeholder="Enter Password"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z" />
                </svg>
              )}
              {loading ? "Submitting..." : "Submit"}

            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegistrationForm;
