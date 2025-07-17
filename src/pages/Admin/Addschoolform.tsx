import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";

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
      const res = await axios.post(
        "https://scrmapi.tranquility.org.ng/api/School/RegisterSchool",
        formData,
       
      );
      setSuccess("School registered successfully!");
      // Optionally navigate or reset
      // navigate('/AddSchool');
      console.log(res.data)
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
              <Link to="/addschoolform" className="underline">Add School</Link>
              <Link to="/AddSchool" className="hover:underline">Upload School License</Link>
              <Link to="/Accountregistration" className="hover:underline">Add Account details</Link>
              <Link to="/AddAdmin" className="hover:underline">Add School Admin</Link>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {formFields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-[13px] text-gray-700 mb-1">{label}</label>
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
              <label htmlFor="typeOfSchool" className="block text-[13px] text-gray-700 mb-1">Type of School</label>
              <select
                id="typeOfSchool"
                name="typeOfSchool"
                value={formData.typeOfSchool}
                onChange={handleChange}
                className="w-full border border-orange-400 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-orange-400"
                required
              >
                <option value="" disabled>Select Type</option>
                {schoolTypes.map(type => (
                  <option key={type} value={type.toLowerCase()}>{type}</option>
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
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the <Link to="/terms" className="text-orange-600 hover:underline">Terms &amp; Conditions</Link>
              </label>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AddSchoolForm;
