import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { cbtAuthService } from "../../Services/Cbt/Auth/Auth";
import { AppContext } from "../../Context/AppContext";

const RegisterSchool = () => {
  // const { login } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [step, setStep] = useState(1);
  const [schoolData, setSchoolData] = useState({
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
    confirmPassword: "",
    hasAgreedToTerms: false,
  });

  const [adminData, setAdminData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [registeredSchoolId, setRegisteredSchoolId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSchoolChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchoolData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateSchoolForm = () => {
    const newErrors = {};

    if (!schoolData.schoolName.trim()) newErrors.schoolName = "School name is required";
    if (!schoolData.schoolEmail.trim()) newErrors.schoolEmail = "School email is required";
    if (!schoolData.schoolPhone.trim()) newErrors.schoolPhone = "School phone is required";
    if (!schoolData.address.trim()) newErrors.address = "Address is required";
    if (!schoolData.typeOfSchool) newErrors.typeOfSchool = "School type is required";
    if (!schoolData.country.trim()) newErrors.country = "Country is required";
    if (!schoolData.state.trim()) newErrors.state = "State is required";
    if (!schoolData.city.trim()) newErrors.city = "City is required";
    if (!schoolData.ownerName.trim()) newErrors.ownerName = "Owner name is required";
    if (!schoolData.ownerPhone.trim()) newErrors.ownerPhone = "Owner phone is required";
    if (!schoolData.ownerEmail.trim()) newErrors.ownerEmail = "Owner email is required";
    if (!schoolData.password) newErrors.password = "Password is required";
    if (schoolData.password !== schoolData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!schoolData.hasAgreedToTerms) {
      newErrors.hasAgreedToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdminForm = () => {
    const newErrors = {};

    if (!adminData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!adminData.email.trim()) newErrors.email = "Email is required";
    if (!adminData.password) newErrors.password = "Password is required";
    if (adminData.password !== adminData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSchoolSubmit = async (e) => {
    e.preventDefault();

    if (!validateSchoolForm()) return;

    setLoading(true);

    try {
      // Prepare data for API
      const { confirmPassword, ...dataToSend } = schoolData;
      console.log(dataToSend);

      const response = await cbtAuthService.registerSchool(dataToSend);


      if (response?.status === true) {
        const result = response?.data?.data?.applicationInformation
        notifySuccess("School registered successfully", "success");
        // Store the schoolId from response
        setRegisteredSchoolId(result.schoolId);

        // Move to step 2
        setStep(2);
      }
    } catch (error) {
      console.error("School registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if (!validateAdminForm()) return;

    setLoading(true);

    try {
      // Prepare data for API
      const { confirmPassword, ...dataToSend } = adminData;
      const payload = {
        ...dataToSend,
        schoolId: registeredSchoolId,
      };

      const response = await cbtAuthService.registerAdmin(payload);

      if (response?.status === true) {
        notifySuccess("Admin registered successfully", "success");
        navigate('/cbt/login');
      }
    } catch (error) {
      console.error("Admin creation error:", error);
      alert("Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen font-sans py-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8 flex items-center justify-between px-4">
          <Link to="/cbt/login" className="text-orange-500 font-semibold hover:underline">
            ← Back to Login
          </Link>
          <div className="text-sm text-gray-600">Step {step} of 2</div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-6 px-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div
                className={`h-2 rounded-full ${step >= 1 ? "bg-orange-500" : "bg-gray-200"}`}
              ></div>
              <p className="text-xs mt-1 text-center">School Info</p>
            </div>
            <div className="w-8"></div>
            <div className="flex-1">
              <div
                className={`h-2 rounded-full ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`}
              ></div>
              <p className="text-xs mt-1 text-center">Admin Setup</p>
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-orange-100">
          {step === 1 ? (
            // STEP 1: SCHOOL REGISTRATION
            <form onSubmit={handleSchoolSubmit}>
              <h2 className="text-2xl font-bold text-orange-600 mb-6">Register Your School</h2>

              {/* SCHOOL INFO */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
                  School Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">School Name *</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={schoolData.schoolName}
                      onChange={handleSchoolChange}
                      placeholder="Enter school name"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.schoolName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">School Email *</label>
                    <input
                      type="email"
                      name="schoolEmail"
                      value={schoolData.schoolEmail}
                      onChange={handleSchoolChange}
                      placeholder="Enter school email"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.schoolEmail ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.schoolEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.schoolEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">School Phone Number *</label>
                    <input
                      type="tel"
                      name="schoolPhone"
                      value={schoolData.schoolPhone}
                      onChange={handleSchoolChange}
                      placeholder="Enter phone number"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.schoolPhone ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.schoolPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.schoolPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">School Type *</label>
                    <select
                      name="typeOfSchool"
                      value={schoolData.typeOfSchool}
                      onChange={handleSchoolChange}
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.typeOfSchool ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select Type</option>
                      <option value="Primary">Primary</option>
                      <option value="Secondary">Secondary</option>
                      <option value="College">College</option>
                    </select>
                    {errors.typeOfSchool && (
                      <p className="text-red-500 text-xs mt-1">{errors.typeOfSchool}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ADDRESS INFO */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
                  Address Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1">School Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={schoolData.address}
                      onChange={handleSchoolChange}
                      placeholder="Enter school address"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.address ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={schoolData.city}
                      onChange={handleSchoolChange}
                      placeholder="Enter city"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.city ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={schoolData.state}
                      onChange={handleSchoolChange}
                      placeholder="Enter state"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.state ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={schoolData.country}
                      onChange={handleSchoolChange}
                      placeholder="Enter country"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.country ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* OWNER INFO */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
                  School Owner Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={schoolData.ownerName}
                      onChange={handleSchoolChange}
                      placeholder="Owner's name"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.ownerName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={schoolData.ownerPhone}
                      onChange={handleSchoolChange}
                      placeholder="e.g., +234 801 234 5678"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.ownerPhone ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.ownerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.ownerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={schoolData.ownerEmail}
                      onChange={handleSchoolChange}
                      placeholder="owner@school.edu"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.ownerEmail ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.ownerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.ownerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={schoolData.password}
                      onChange={handleSchoolChange}
                      placeholder="Enter password"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={schoolData.confirmPassword}
                      onChange={handleSchoolChange}
                      placeholder="Re-enter password"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="hasAgreedToTerms"
                    checked={schoolData.hasAgreedToTerms}
                    onChange={handleSchoolChange}
                    className="mt-1 mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and conditions *
                  </span>
                </label>
                {errors.hasAgreedToTerms && (
                  <p className="text-red-500 text-xs mt-1">{errors.hasAgreedToTerms}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Link to="/cbt/login">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Next: Add Admin"}
                </button>
              </div>
            </form>
          ) : (
            // STEP 2: ADMIN SETUP
            <form onSubmit={handleAdminSubmit}>
              <h2 className="text-2xl font-bold text-orange-600 mb-6">Setup Admin Account</h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-orange-500 pl-2">
                  Admin Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={adminData.fullName}
                      onChange={handleAdminChange}
                      placeholder="Admin's full name"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={adminData.email}
                      onChange={handleAdminChange}
                      placeholder="admin@school.edu"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={adminData.password}
                      onChange={handleAdminChange}
                      placeholder="Enter password"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.password ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={adminData.confirmPassword}
                      onChange={handleAdminChange}
                      placeholder="Re-enter password"
                      className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none ${
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Admin..." : "Complete Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterSchool;
