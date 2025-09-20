import React from "react";

const ViewMyPupils = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Back Button */}
      <div className="relative bg-gradient-to-r from-orange-400 to-orange-600">
        <div className="absolute top-4 left-4 text-white text-xl cursor-pointer bg-black/20 p-2 rounded-full shrink-0 h-10 w-10 hover:bg-black/30 transition-all flex items-center justify-center" onClick={() => window.history.back()}>
          ←
        </div>
        <div className="h-40 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
          <h1 className="text-white text-2xl font-bold">Student Profile</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center -mt-16 px-4">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-1 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-800">Jason Ethan</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-600">12 years</span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">Male</span>
          <span className="text-gray-300">•</span>
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">JSS1</span>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="bg-orange-500 px-6 py-3">
            <h3 className="text-white font-medium">Student Information</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Personal Information Group */}
              <div className="space-y-5">
                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wide border-b pb-1">Personal Details</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">Jason</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">Ethan</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Date Of Birth</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">22/2/2222</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">12 years</span>
                  </div>
                </div>
              </div>

              {/* Academic Information Group */}
              <div className="space-y-5">
                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wide border-b pb-1">Academic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Entered Class</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">JSS1</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current Term</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">First Term</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Session ID</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">2023/2024</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Classroom ID</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">JSS1A</span>
                  </div>
                </div>
              </div>

              {/* Contact Information Group */}
              <div className="space-y-5">
                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wide border-b pb-1">Contact Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Guardian ID</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">2222222222</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Teacher ID</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">1111111111</span>
                  </div>
                </div>
              </div>

              {/* Identification Group */}
              <div className="space-y-5">
                <h4 className="text-gray-500 text-sm font-semibold uppercase tracking-wide border-b pb-1">Identification</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Student ID</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">STU-12345</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <div className="flex items-center border border-orange-200 rounded-lg px-4 py-3 bg-orange-50/50">
                    <span className="text-gray-700">Male</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-5 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-sm">
            Edit Profile
          </button>
          <button className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors" onClick={() => window.history.back()}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMyPupils;