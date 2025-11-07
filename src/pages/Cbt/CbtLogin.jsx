import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";
import { cbtAuthService } from "../../Services/Cbt/Auth/Auth";
import { AppContext } from "../../Context/AppContext";
import { jwtDecode } from "jwt-decode";

const CbtLogin = () => {
  const { cbtLogin } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [schoolRegistrationNumber, setschoolRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [regNumberError, setRegNumberError] = useState("");

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Input validation handlers
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Invalid email format");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const validateRegNumber = (value) => {
    if (!value) {
      setRegNumberError("School Registration Number is required");
      return false;
    } else {
      setRegNumberError("");
      return true;
    }
  };

  // Combined form validity: use error states and field values
  const isFormValid =
    !emailError &&
    !passwordError &&
    !regNumberError &&
    email &&
    password &&
    schoolRegistrationNumber;

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate all fields before submit
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
    const validRegNumber = validateRegNumber(schoolRegistrationNumber);
    if (!validEmail || !validPassword || !validRegNumber) return;

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = {
        schoolRegistrationNumber,
        email,
        password,
      };
      const response = await cbtAuthService.login(data);
      cbtLogin(response.data);
      
      setSuccessMessage("Login successful!");
      notifySuccess("Login successful!");
      


      const decoded = jwtDecode(response.data);
      const role = decoded?.role;

      if (role === "SchoolAdmin") {
        navigate("/cbt/admin/dashboard");
      } else if (role === "Student") {
        navigate("/cbt/student/dashboard");
      } else if (role === "Teacher") {
        navigate("/cbt/teacher/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data.responseMessage ||
          err?.message ||
          "Login failed. Please check your credentials."
      );
      notifyError(err.response?.data.responseMessage || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Center Content */}
      <div className="flex flex-col items-center justify-center px-4 py-10">
        {/* Login Card */}
        <div className="bg-white w-full max-w-[800px] shadow-lg rounded-2xl p-6 border border-orange-100">
          <h2 className="text-2xl font-bold text-orange-600 mb-2 capitalize">Login</h2>

          <p className="text-gray-600 mb-6 text-sm">
            Enter your school registration number, email and password to access your exams.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
                School Registration Number
              </label>
              <input
                id="regNumber"
                type="text"
                value={schoolRegistrationNumber}
                onChange={(e) => {
                  setschoolRegistrationNumber(e.target.value);
                  validateRegNumber(e.target.value);
                }}
                placeholder="Enter Number"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onBlur={() => validateRegNumber(schoolRegistrationNumber)}
              />
              {regNumberError && <p className="text-red-500 text-xs mt-1">{regNumberError}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="Enter Email"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onBlur={() => validateEmail(email)}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="Enter Password"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onBlur={() => validatePassword(password)}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              disabled={loading || !isFormValid}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-20"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-gray-600 text-sm">
          School not registered yet?{" "}
          <Link to="/cbt/registerschool" className="text-orange-500 font-semibold hover:underline">
            Register Your School
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CbtLogin;
