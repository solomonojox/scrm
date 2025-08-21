import React, { useRef } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import imageAssets from "../../../assets/imageAssets";

export default function GuardianProfile() {
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
    <div className="">
      <div className="">
        <h2 className="font-bold text-[16px] m-4">Personal Information</h2>
        <div className=" bg-white  shadow overflow-hidden">
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-[150px] object-cover bg-[#EE7306]"
            />
          </div>

          {/* Profile + Name + Actions */}
          <div className="flex items-center justify-between px-4 md:px-6 mt-[-50px]">
            {/* Left section: Picture + Info */}
            <div className="flex flex-col md:flex-row items-center space-x-4">
              <div className="w-[200px] h-[200px] md:w-[100px] md:h-[100px] rounded-full border-4 border-white overflow-hidden bg-[#d9b89a] relative">
                <img
                  src={imageAssets.man}
                  alt="Profile"
                  className="w-full h-full object-cover z-0"
                />
                <div
                  className="absolute bottom-6 md:bottom-2 right-6 md:right-2 z-10 bg-[#EE7306] rounded-full p-[8px] border-2 border-white cursor-pointer"
                  title="Change profile picture"
                  onClick={handleCameraClick}
                >
                  <FaCamera className="text-white text-sm" />
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
              <div className="mt-19">
                <p className="font-bold text-[15px] leading-none">David Ethan</p>
                <p className="text-[12px] text-gray-600 font-semibold mb-2">Medical Doctor</p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="bg-[#EE7306] text-white text-[12px] px-4 py-2 rounded-md font-bold"
                  >
                    Change Picture
                  </button>
                  <button
                    type="button"
                    disabled
                    className="bg-gray-300 text-white text-[12px] px-4 py-2 rounded-md font-bold cursor-not-allowed"
                  >
                    Delete Picture
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile */}
            <div className="text-[12px] md:text-[16px] text-[#EE7306] flex items-center cursor-pointer select-none">
              <FaEdit className="mr-1" />
              Edit Profile
            </div>
          </div>

          {/* Form */}
          <div className="p-4 md:p-6">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-md gap-y-5">
              {[
                { label: "First Name", id: "firstName", type: "text", placeholder: "Enter Name" },
                { label: "Last Name", id: "lastName", type: "text", placeholder: "Enter Name" },
                {
                  label: "Phone Number",
                  id: "phoneNumber",
                  type: "text",
                  placeholder: "Enter Number",
                },
                {
                  label: "Home Address",
                  id: "homeAddress",
                  type: "text",
                  placeholder: "Enter Address",
                },
                {
                  label: "Nationality",
                  id: "nationality",
                  type: "text",
                  placeholder: "Enter Here",
                },
                {
                  label: "State of Origin",
                  id: "stateOfOrigin",
                  type: "text",
                  placeholder: "Enter Here",
                },
                { label: "Gender", id: "gender", type: "text", placeholder: "Enter Here" },
                { label: "Religion", id: "religion", type: "text", placeholder: "Enter Here" },
                { label: "Email", id: "email", type: "email", placeholder: "Enter Here" },
                { label: "Username", id: "username", type: "text", placeholder: "Enter Here" },
                { label: "Occupation", id: "occupation", type: "text", placeholder: "Enter Here" },
                {
                  label: "Work Address",
                  id: "workAddress",
                  type: "text",
                  placeholder: "Enter Here",
                },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[12px] text-gray-700 mb-1 font-bold"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded px-3 py-2 text-[12px] border placeholder:text-[12px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#e67e22]"
                    style={{ borderColor: "#EE7306" }}
                  />
                </div>
              ))}
            </form>

            {/* Save Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-[#EE7306] text-white text-[12px] px-5 py-2 rounded font-bold"
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
