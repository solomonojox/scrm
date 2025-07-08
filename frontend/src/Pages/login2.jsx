mport React from "react";

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/path-to/WhatsApp Image 2025-07-08 at 14.45.16_7c0e90a5.jpg')",
      }}
    >
      {/* Login form container */}
      <div className="bg-white rounded-lg shadow-md px-8 py-10 w-full max-w-md">
        {/* Leave this section untouched as per your request */}
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Please Login</p>
        <form>
          <div className="mb-4">
            <label className="block text-sm mb-1">School Registration Number</label>
            <input
              type="text"
              placeholder="Enter Number"
              className="w-full border border-orange-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full border border-orange-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-orange-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
          <p className="text-xs text-center text-gray-600 mt-4">
            By signing up, you confirm our{" "}
            <a href="#" className="text-orange-500 font-semibold underline">
              Terms of Use
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-500 font-semibold underline">
              privacy policy
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
