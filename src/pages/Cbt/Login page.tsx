import React, { useState } from "react";
import { cbtAuthService } from "../../Services/Cbt/Auth/Auth";
import { useAuth } from "../../Context/Auth/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const EducatLogin = () => {
  const navigate = useNavigate();
  const { cbtLogin } = useAuth();
  const [activeTab, setActiveTab] = useState("student");
  const [schoolId, setSchoolId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ schoolId: string; email: string; password: string }>({
    schoolId: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<{ schoolId: boolean; email: boolean; password: boolean }>({
    schoolId: false,
    email: false,
    password: false,
  });

  const tabs = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "admin", label: "School Admin" },
  ];

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "schoolId":
        if (!value.trim()) {
          return "School ID is required";
        } else if (value.trim().length < 5) {
          return "School ID must be at least 5 characters";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "password":
        if (!value) {
          return "Password is required";
        } else if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const validateAll = () => {
    const newErrors = {
      schoolId: validateField("schoolId", schoolId),
      email: validateField("email", email),
      password: validateField("password", password),
    };

    setErrors(newErrors);

    // Mark all fields as touched
    setTouched({
      schoolId: true,
      email: true,
      password: true,
    });

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate the specific field on blur
    let errorMessage = "";
    switch (field) {
      case "schoolId":
        errorMessage = validateField("schoolId", schoolId);
        setErrors(prev => ({ ...prev, schoolId: errorMessage }));
        break;
      case "email":
        errorMessage = validateField("email", email);
        setErrors(prev => ({ ...prev, email: errorMessage }));
        break;
      case "password":
        errorMessage = validateField("password", password);
        setErrors(prev => ({ ...prev, password: errorMessage }));
        break;
    }
  };

  const handleChange = (field: string, value: string) => {
    // Update the field value
    switch (field) {
      case "schoolId":
        setSchoolId(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }

    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const isValid = validateAll();
    if (isValid) {
      setLoading(true);

      try {
        if (activeTab === "admin") {
          const response = await cbtAuthService.login({ email, password, schoolRegistrationNumber: schoolId });

          cbtLogin(response.data);
          const decoded = jwtDecode<Partial<any>>(response.data);
          if (decoded.role !== 'SchoolAdmin') {
            toast.error("Unauthorized: Only Admins can access this portal");
          }
          if (decoded.role === 'SchoolAdmin') {
            navigate('/cbt/admin/dashboard')
          }
        } else if (activeTab === "teacher") {
          const response = await cbtAuthService.login({ email, password, schoolRegistrationNumber: schoolId });
          cbtLogin(response.data);
          const decoded = jwtDecode<Partial<any>>(response.data);
          if (decoded.role !== 'Teacher') {
            toast.error("Unauthorized: Only Teachers can access this portal");
          }
          if (decoded.role === 'Teacher') {
            navigate('/cbt/teacher/dashboard')
          }
        } else {
          window.location.href = "/studentcbt";
        }
      } catch (error: any) {
        // console.log(error);
        toast.error(error.response?.data?.responseMessage || "Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 font-sans">
      {/* Header Tabs */}
      <div className="flex space-x-4 mb-8 w-[800px] items-center justify-center bg-white shadow-md rounded-full px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Clear all fields and errors when switching tabs
              setSchoolId("");
              setEmail("");
              setPassword("");
              setErrors({ schoolId: "", email: "", password: "" });
              setTouched({ schoolId: false, email: false, password: false });
            }}
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === tab.id
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:text-orange-500"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Login Card */}
      <div className="bg-white w-[800px] shadow-lg rounded-2xl p-8 border border-orange-100">
        <h2 className="text-2xl font-bold text-orange-600 mb-2 capitalize">
          {activeTab} Login
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your school registration number, email and password to access your exams.
        </p>

        <form action="submit" onSubmit={handleLogin}>
          {/* Registration Number */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              School Registration Number
            </label>
            <input
              type="text"
              placeholder="e.g., SCH-2024-001"
              value={schoolId}
              onChange={(e) => handleChange("schoolId", e.target.value)}
              onBlur={() => handleBlur("schoolId")}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition-colors ${touched.schoolId && errors.schoolId
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
                }`}
            />
            {touched.schoolId && errors.schoolId && (
              <p className="text-red-500 text-sm mt-1">{errors.schoolId}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="student@school.edu"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition-colors ${touched.email && errors.email
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
                }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none transition-colors ${touched.password && errors.password
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
                }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold py-2 rounded-lg transition`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : `Login as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Demo: Use any school registration number, email and password
        </p>
      </div>

      {/* Footer with working Register School link */}
      <p className="mt-6 text-gray-600 text-sm">
        School not registered yet?{" "}
        <a
          href="/registerschool"
          className="text-orange-500 font-semibold hover:underline"
        >
          Register Your School
        </a>
      </p>
    </div>
  );
};

export default EducatLogin;