import React, { useContext, useState } from "react";
import imageAssets from "../assets/imageAssets";
import { loginService } from "../Services/Auth/loginService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { useAuth } from "../Context/Auth/useAuth";
import logo from "../assets/looogo.png";
import useTawkTo from "../Context/useTawkTo";

const LoginPage = () => {
  const { login } = useAuth();
  useTawkTo();
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useContext(AppContext);
  const [schoolRegistrationNumber, setSchoolRegistrationNumber] = useState("");
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
      const response = await loginService.staffLogin(data);
      login(response.data);

      setSuccessMessage("Login successful!");
      notifySuccess("Login successful!");

      const decoded = jwtDecode(response.data);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "SchoolAdmin") {
        navigate("/admin/dashboard");
      } else if (role === "Guardian") {
        navigate("/guardian/dashboard");
      } else if (role === "Teacher") {
        navigate("/teacher/dashboard");
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
    <div className="relative">
      {/* Background Image */}
      <img
        src={imageAssets.loginImage}
        alt="login image"
        className="hidden lg:block w-[35vw] object-cover fixed top-[10%] left-[10%] -z-11"
      />

      {/* Logo at Top Right on large screens */}
      <div className="hidden lg:block absolute top-6 left-6">
        <img src={logo} alt="EduCat logo" className="h-[50px]" />
      </div>

      {/* Logo at Top Center on small screens */}
      <div className="lg:hidden flex justify-center absolute top-[2vh] md:top-[10vh] left-0 right-0">
        <img src={logo} alt="EduCat logo" className="h-[50px]" />
      </div>

      {/* Login Form Section */}
      <div className="h-screen w-full flex items-center justify-center lg:justify-end lg:pr-[10%]">
        <div className="bg-white backdrop-blur-md rounded-lg shadow-lg px-8 py-10 w-[539px] max-w-md">
          <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Welcome Back!</h2>
          <p className="text-center text-gray-600 mb-6">Please Login</p>

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
                  setSchoolRegistrationNumber(e.target.value);
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

            <p className="text-xs text-center text-gray-600 mt-4">
              By signing in, you confirm our{" "}
              <a href="#" className="text-orange-500 font-semibold underline">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-500 font-semibold underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Orange Curved Background */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10">
        <svg
          viewBox="0 0 1438 953"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <path
            d="M954.001 0H1438V953H954.001C954.001 953 674 755 901.5 464.5C1129 174 954.001 0 954.001 0Z"
            fill="#EE7306"
          />
          <path
            d="M954 630V960H1L-33 807C-33 807 -39.5 840 132 731C303.5 622 458.5 813 539 731C619.5 649 694.5 593.5 773.5 590C852.5 586.5 954 630 954 630Z"
            fill="#EE7306"
          />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
