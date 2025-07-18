import React, { useState } from "react";
import axios from "axios";
import h from "../assets/image.jpg";

const LoginPage = () => {
  const [schoolRegistrationNumber, setSchoolRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "https://scrmapi.tranquility.org.ng/api/Login/Login",
        {
          schoolRegistrationNumber,
          email,
          password,
        }
      );

      console.log("Login successful:", response.data);
      setSuccessMessage("Login successful!");

      // Example: store token or redirect
      // localStorage.setItem("token", response.data.token);
      // navigate("/dashboard");

    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${h})`,
      }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-8 py-10 w-full max-w-md ml-[950px]">
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
              onChange={(e) => setSchoolRegistrationNumber(e.target.value)}
              placeholder="Enter Number"
              className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-sm mb-4">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
            disabled={loading}
          >
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
  );
};

export default LoginPage;
