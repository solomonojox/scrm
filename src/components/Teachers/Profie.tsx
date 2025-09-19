import React, { useRef } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import imageAssets from "../../assets/imageAssets";
import Sidebar from "../../pages/Admin/guardian/Sidebar";

export default function PersonalInformation() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#f7f7f7] font-sans text-black min-h-screen">
      {/* Sidebar (collapses on mobile) */}
      <div className=" hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 mt-10 md:mt-0">
        <h2 className="font-bold text-lg md:text-xl mb-4 md:ml-10 text-center md:text-left">
          Personal Information
        </h2>

        <div className="max-w-[900px] mx-auto bg-white shadow rounded-lg overflow-hidden">
          {/* Banner */}
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-[120px] sm:h-[150px] object-cover bg-[#EE7306]"
            />
          </div>

          {/* Profile + Name + Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 mt-[-50px]">
            {/* Left section: Picture + Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 text-center sm:text-left">
              {/* Profile Picture */}
              <div className="w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] rounded-full border-4 border-white overflow-hidden bg-[#d9b89a] relative">
                <img
                  src={imageAssets.man}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 right-0 bg-[#EE7306] rounded-full p-[6px] sm:p-[8px] border-2 border-white cursor-pointer"
                  title="Change profile picture"
                  onClick={handleCameraClick}
                >
                  <FaCamera className="text-white text-xs sm:text-sm" />
                </div>
                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Name, Title, Buttons */}
              <div className="mt-3 sm:mt-0">
                <p className="font-bold text-sm sm:text-base">David Ethan</p>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mb-2">
                  Medical Doctor
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="bg-[#EE7306] text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-bold"
                  >
                    Change Picture
                  </button>
                  <button
                    type="button"
                    disabled
                    className="bg-gray-300 text-white text-xs sm:text-sm px-3 py-1.5 rounded-md font-bold cursor-not-allowed"
                  >
                    Delete Picture
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile */}
            <div className="mt-3 md:mt-0 text-xs sm:text-sm text-[#EE7306] flex items-center cursor-pointer select-none">
              <FaEdit className="mr-1" />
              Edit Profile
            </div>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 text-sm gap-y-4">
              {[
                { label: "First Name", id: "firstName", type: "text", placeholder: "Enter Name" },
                { label: "Last Name", id: "lastName", type: "text", placeholder: "Enter Name" },
                { label: "Phone Number", id: "phoneNumber", type: "text", placeholder: "Enter Number" },
                { label: "Home Address", id: "homeAddress", type: "text", placeholder: "Enter Address" },
                { label: "Nationality", id: "nationality", type: "text", placeholder: "Enter Here" },
                { label: "State of Origin", id: "stateOfOrigin", type: "text", placeholder: "Enter Here" },
                { label: "Gender", id: "gender", type: "text", placeholder: "Enter Here" },
                { label: "Religion", id: "religion", type: "text", placeholder: "Enter Here" },
                { label: "Email", id: "email", type: "email", placeholder: "Enter Here" },
                { label: "Username", id: "username", type: "text", placeholder: "Enter Here" },
                { label: "School ID", id: "occupation", type: "text", placeholder: "Enter Here" },
                { label: "Work Address", id: "workAddress", type: "text", placeholder: "Enter Here" },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-xs sm:text-sm text-gray-700 mb-1 font-bold"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded px-3 py-2 text-xs sm:text-sm border placeholder:text-xs sm:placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                    style={{ borderColor: "#EE7306" }}
                  />
                </div>
              ))}
            </form>

            {/* Save Button */}
            <div className="mt-6 text-center sm:text-left">
              <button
                type="submit"
                className="bg-[#EE7306] text-white text-xs sm:text-sm px-5 py-2 rounded font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
