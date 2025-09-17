import React from "react";

const StudentProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-4 left-4 text-gray-700 text-xl cursor-pointer">
          ←
        </div>
        <img
          src="https://img.freepik.com/free-photo/back-school-desk-background_23-2149271119.jpg" // replace with your header image
          alt="Header"
          className="w-full h-40 object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center -mt-12">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg" // replace with student image
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <h2 className="mt-2 text-lg font-semibold text-gray-800">
          Jason Ethan, 12
        </h2>
        <p className="text-sm text-gray-500">Jss1</p>
      </div>

      {/* Form Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6 mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              value="Jason"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              value="Ethan"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700 focus:outline-none"
            />
          </div>

          {/* Entered Class */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Entered Class
            </label>
            <input
              type="text"
              value="Jss1"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Date Of Birth
            </label>
            <input
              type="text"
              value="22/2/2222"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Age
            </label>
            <input
              type="text"
              value="12"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Guardian ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Guardian ID
            </label>
            <input
              type="text"
              value="2222222222"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Teacher ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Teacher ID
            </label>
            <input
              type="text"
              value="1111111111"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <input
              type="text"
              value="Male"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Current Term */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Current Term
            </label>
            <input
              type="text"
              value="First"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Session ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Session ID
            </label>
            <input
              type="text"
              value="/////////////"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Classroom ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Classroom ID
            </label>
            <input
              type="text"
              value="22222222222"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Student ID
            </label>
            <input
              type="text"
              value="/////////////"
              readOnly
              className="mt-1 w-full border border-orange-400 rounded-md p-2 text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
