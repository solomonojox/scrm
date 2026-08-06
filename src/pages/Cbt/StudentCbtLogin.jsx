import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";
import { cbtAuthService } from "../../Services/Cbt/Auth/Auth";
import { AppContext } from "../../Context/AppContext";
import { jwtDecode } from "jwt-decode";

const StudentCbtLogin = () => {
  const { cbtLogin } = useAuth();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);

  const [schoolRegistrationNumber, setSchoolRegistrationNumber] = useState("");
  const [studentRegNumber, setStudentRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Validation states
  const [schoolRegError, setSchoolRegError] = useState("");
  const [studentRegError, setStudentRegError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateSchoolReg = (value) => {
    if (!value) {
      setSchoolRegError("School Registration Number is required");
      return false;
    }
    setSchoolRegError("");
    return true;
  };

  const validateStudentReg = (value) => {
    if (!value) {
      setStudentRegError("Student Registration Number is required");
      return false;
    }
    setStudentRegError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
      return false;
    } else if (value.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const isFormValid =
    !schoolRegError &&
    !studentRegError &&
    !passwordError &&
    schoolRegistrationNumber &&
    studentRegNumber &&
    password;

  const handleLogin = async (e) => {
    e.preventDefault();

    const validSchoolReg = validateSchoolReg(schoolRegistrationNumber);
    const validStudentReg = validateStudentReg(studentRegNumber);
    const validPassword = validatePassword(password);
    if (!validSchoolReg || !validStudentReg || !validPassword) return;

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const data = {
        schoolRegNumber: schoolRegistrationNumber,
        email: studentRegNumber,
        password,
      };
      const response = await cbtAuthService.studentCbtLogin(data);
      cbtLogin(response?.token);

      setSuccessMessage("Login successful!");
      notifySuccess("Login successful!");

      const decoded = jwtDecode(response?.token);
      const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
      const role = decoded[roleClaim];

      if (role === "Student") {
        navigate("/cbt/student/dashboard");
      } else {
        // Fallback in case a non-student account attempts this login form
        navigate("/cbt/login");
      }
    } catch (err) {
      const message =
        err?.response?.data?.responseMessage ||
        err?.message ||
        "Login failed. Please check your details and try again.";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-200 shadow-lg rounded-2xl p-6 border border-orange-100">
          <h2 className="text-2xl font-bold text-orange-600 mb-2 capitalize">Student Login</h2>

          <p className="text-gray-600 mb-6 text-sm">
            Enter your school registration number, student registration number and password to
            access your exams.
          </p>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="schoolRegNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                School Registration Number
              </label>
              <input
                id="schoolRegNumber"
                type="text"
                value={schoolRegistrationNumber}
                onChange={(e) => {
                  setSchoolRegistrationNumber(e.target.value);
                  validateSchoolReg(e.target.value);
                }}
                placeholder="Enter School Registration Number"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onBlur={() => validateSchoolReg(schoolRegistrationNumber)}
              />
              {schoolRegError && (
                <p className="text-red-500 text-xs mt-1">{schoolRegError}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="studentRegNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Student Registration Number
              </label>
              <input
                id="studentRegNumber"
                type="text"
                value={studentRegNumber}
                onChange={(e) => {
                  setStudentRegNumber(e.target.value);
                  validateStudentReg(e.target.value);
                }}
                placeholder="Enter Student Registration Number"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onBlur={() => validateStudentReg(studentRegNumber)}
              />
              {studentRegError && (
                <p className="text-red-500 text-xs mt-1">{studentRegError}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <PasswordField
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                placeholder="Enter Password"
                inputClassName="border-orange-300 focus:ring-orange-500"
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

        <p className="mt-6 text-gray-600 text-sm">
          Not a student?{" "}
          <Link to="/cbt/login" className="text-orange-500 font-semibold hover:underline">
            Go to main login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentCbtLogin;