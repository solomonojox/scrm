import React from 'react';

const RegistrationForm = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-md w-full max-w-2xl p-8">
        
        {/* Back Arrow */}
        <div className="mb-4">
          <button className="text-gray-500 hover:text-black">&larr;</button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-black">
          Registration Form
        </h2>
        <p className="text-center text-orange-500 mt-1">
          Fill out the form below to get your school started with <span className="font-semibold">EduCat</span>.
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">
          Note: Complete each section before moving to the next.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4 mb-6">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between text-sm text-orange-600 font-medium mb-6">
          <span className="cursor-pointer">Add School</span>
          <span className="cursor-pointer">Upload School License</span>
          <span className="cursor-pointer">Add Account Details</span>
          <span className="cursor-pointer underline text-black">Add School Admin</span>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full mt-1 border border-orange-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
