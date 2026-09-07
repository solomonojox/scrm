import React, { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../Services/Auth/loginService";
import { AppContext } from "../Context/AppContext";
import { useAuth } from "../Context/Auth/useAuth";
import useTawkTo from "../Context/useTawkTo";
import PasswordField from "../components/ui/PasswordField";
import { getErrorMessage } from "../utils/getErrorMessage";
import logo from "../assets/looogo.png";
import heroImage from "../assets/image.avif"; // swap for your own school/student photo

const ROLES = [
  {
    key: "admin",
    label: "School Admin",
    detail: "Run enrolment, staff and fees from one dashboard.",
  },
  {
    key: "teacher",
    label: "Teacher",
    detail: "Manage classes, attendance and grade entry.",
  },
  {
    key: "guardian",
    label: "Guardian",
    detail: "Track your ward's attendance, results and fees.",
  },
];

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      // console.log("Login response:", response.data);
      login(response.data.accessToken, response.data.refreshToken);

      setSuccessMessage("Login successful!");
      notifySuccess("Login successful!");

      const decoded = jwtDecode(response.data.accessToken);
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (role === "SchoolAdmin") {
        navigate("/admin/dashboard");
      } else if (role === "Guardian") {
        navigate("/guardian/dashboard");
      } else if (role === "Teacher") {
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      const msg = getErrorMessage(err)
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white/40 flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[44%] relative bg-[#1B1207] overflow-hidden flex-col justify-between px-12 py-10">
        {/* Decorative rings + student photo inset — the photo sits inside the ring motif */}
        <div className="absolute -top-24 -right-32 w-[520px] h-[520px]">
          <svg
            className="absolute inset-0 w-full h-full opacity-90"
            viewBox="0 0 520 520"
            fill="none"
          >
            <circle cx="260" cy="260" r="259" stroke="#EE7306" strokeOpacity="0.35" />
            <circle cx="260" cy="260" r="190" stroke="#EE7306" strokeOpacity="0.5" />
          </svg>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[240px] w-[240px] rounded-full overflow-hidden ring-1 ring-[#EE7306]/40">
            <img
              src={heroImage}
              alt="Students at school"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1B1207]/70 via-[#EE7306]/10 to-transparent" />
          </div>
        </div>

        <Link to="/" className="relative z-30 inline-flex w-fit">
          <img src={logo} alt="EduCat logo" className="h-10 brightness-4 invert" />
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-[2.35rem] leading-[1.15] font-semibold text-white tracking-tight">
            Every role, one login.
          </h1>
          <p className="mt-4 text-[#D8CFC5] text-[15px] leading-relaxed">
            Admins, teachers and guardians sign in here. Attendance,
            results and fees stay in sync the moment you log in.
          </p>

          <ul className="mt-9 space-y-4">
            {ROLES.map((r) => (
              <li key={r.key} className="flex gap-3.5">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#EE7306]/20 flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#EE7306]" />
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{r.label}</p>
                  <p className="text-[#B9AE9F] text-[13px] mt-0.5">{r.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
          <p className="text-white text-sm font-medium">Logging in as a student?</p>
          <p className="text-[#B9AE9F] text-[13px] mt-1 leading-relaxed">
            Exams are handled on the CBT portal, separate from staff and
            guardian access.
          </p>
          <Link
            to="/cbt/login"
            className="mt-3 inline-flex items-center gap-1.5 text-[#EE7306] text-sm font-semibold"
          >
            Go to CBT student login
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10 ">
        <div className="w-full max-w-105 md:border md:rounded-2xl md:border-[#E7DFD4] bg-white px-0 py-0 sm:px-6 sm:py-8">
          <div className="lg:hidden flex justify-center mb-8">
            <img src={logo} alt="EduCat logo" className="h-10" />
          </div>

          <h2 className="text-[1.7rem] font-semibold text-[#1B1207] tracking-tight">
            Welcome back
          </h2>
          <p className="mt-1.5 text-[#7A6F63] text-[15px]">
            Sign in with your school registration number and email.
          </p>

          <form onSubmit={handleLogin} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="regNumber"
                className="block text-[13px] font-medium text-[#4A4038] mb-1.5"
              >
                School registration number
              </label>
              <input
                id="regNumber"
                type="text"
                value={schoolRegistrationNumber}
                onChange={(e) => {
                  setSchoolRegistrationNumber(e.target.value);
                  validateRegNumber(e.target.value);
                }}
                onBlur={() => validateRegNumber(schoolRegistrationNumber)}
                placeholder="e.g. EDU-2026-0142"
                className={`w-full rounded-md border bg-[#FBF9F6] px-4 py-3 text-[15px] text-[#1B1207] placeholder:text-[#B5AA9C] outline-none transition-colors focus:bg-white focus:ring-2 ${
                  regNumberError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-[#E7DFD4] focus:border-[#EE7306] focus:ring-[#EE7306]/20"
                }`}
              />
              {regNumberError && (
                <p className="text-red-500 text-xs mt-1.5">{regNumberError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-[#4A4038] mb-1.5"
              >
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
                onBlur={() => validateEmail(email)}
                placeholder="you@school.edu"
                className={`w-full rounded-md border bg-[#FBF9F6] px-4 py-3 text-[15px] text-[#1B1207] placeholder:text-[#B5AA9C] outline-none transition-colors focus:bg-white focus:ring-2 ${
                  emailError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-[#E7DFD4] focus:border-[#EE7306] focus:ring-[#EE7306]/20"
                }`}
              />
              {emailError && <p className="text-red-500 text-xs mt-1.5">{emailError}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[13px] font-medium text-[#4A4038]">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[13px] font-medium text-[#EE7306]">
                  Forgot password?
                </Link>
              </div>
              <PasswordField
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                placeholder="Enter password"
                inputClassName={`bg-[#FBF9F6] focus:bg-white ${
                  passwordError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-[#E7DFD4] focus:border-[#EE7306] focus:ring-[#EE7306]/20"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            {successMessage && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#EE7306] py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#D96504] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Logging in…" : "Log in"}
            </button>

            <p className="text-[13px] text-center text-[#8C8074] leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="text-[#EE7306] font-medium">Terms of Use</a>{" "}
              and{" "}
              <a href="#" className="text-[#EE7306] font-medium">Privacy Policy</a>.
            </p>
          </form>

          {/* Mobile-only CBT hand-off (left panel is hidden below lg) */}
          <div className="lg:hidden mt-6 rounded-2xl border border-[#E7DFD4] bg-[#FBF9F6] px-4 py-3.5">
            <p className="text-[#1B1207] text-sm font-medium">Logging in as a student?</p>
            <Link
              to="/cbt/login"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[#EE7306] text-sm font-semibold"
            >
              Go to CBT student login
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;