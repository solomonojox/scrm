import React from "react";
import h from '../assets/Ha.png';


const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${h})`,
        }}
        aria-label="School corridor with students"
      />

      <div
        className="flex w-full lg:w-1/2 items-center justify-center bg-cover bg-center"
      // style={{
      //   backgroundImage: `url(${})`,
      // }}
      >

        {/*  */}
        <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-lg px-8 py-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">Welcome Back!</h2>
          <p className="text-center text-gray-600 mb-6">Please Login</p>

          <form onSubmit={(e) => e.preventDefault()}>

            <div className="mb-4">
              <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
                School Registration Number
              </label>
              <input
                id="regNumber"
                type="text"
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
                placeholder="Enter Email"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            d
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                className="w-full border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors"
            >
              Login
            </button>

            <p className="text-xs text-center text-gray-600 mt-4">
              By signing in, you confirm our{' '}
              <a href="#" className="text-orange-500 font-semibold underline">
                Terms of Use
              </a>{' '}and{' '}
              <a href="#" className="text-orange-500 font-semibold underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
