import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import axios from "axios";
import "../../Styles/loader.css";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!formData.fullname || !formData.username || !formData.password) {
      setMessage({ type: "error", text: "All fields are required." });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://scrmapi.tranquility.org.ng/api/Admin/AddAdmin",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      setMessage({ type: "success", text: "Admin registered successfully!" });
      console.log("✅ API Response:", response.data);
    } catch (error) {
      console.error("❌ API Error:", error);

      let errorMsg = "Something went wrong. Try again later.";

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.code === "ECONNABORTED") {
        errorMsg = "Request timed out. Try again.";
      } else if (error.request) {
        errorMsg = "No response from server. Check your network or API URL.";
      }

      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-md shadow-md w-full max-w-2xl p-8 relative z-10">
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
            <Link to="/AddAccount" className="hover:underline">Add Account Details</Link>
            <Link to="/AddAdmin" className="underline">Add School Admin</Link>
          </nav>

          {message && (
            <div className={`text-center mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {message.text}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <span className="loader" /> : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
          <div className="loader scale-150" />
        </div>
      )}

      <Footer />
    </>
  );
};

export default RegistrationForm;
