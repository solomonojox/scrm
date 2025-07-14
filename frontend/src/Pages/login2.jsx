import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Top section: Image left + Form right */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left Image */}
        <div className="md:w-1/2 w-full h-64 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80"
            alt="Left Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Login Form */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-white">
          <div className="bg-white rounded-lg shadow-md px-8 py-10 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-1">Welcome Back!</h2>
            <p className="text-center text-gray-600 mb-6">Please Login</p>
            <form>
              <div className="mb-4">
                <label className="block text-sm mb-1">
                  School Registration Number
                </label>
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
                .
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Image */}
      <div className="w-full h-48 mt-4">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1600&q=80"
          alt="Bottom Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
