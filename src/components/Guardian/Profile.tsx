import React, { useRef } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import imageAssets from "../../assets/imageAssets";

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
    <div className="flex bg-[#f7f7f7] font-sans text-black min-h-screen">
     
      <aside className="w-[220px] bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-6">Sidebar</h2>
        <nav className="flex flex-col space-y-3">
          <a href="#" className="hover:text-[#e67e22]">Dashboard</a>
          <a href="#" className="hover:text-[#e67e22]">Profile</a>
          <a href="#" className="hover:text-[#e67e22]">Settings</a>
        </nav>
      </aside>

      <div className="flex-1 p-6">
        <h2 className="font-bold text-[16px] ml-70 mb-3">Personal Information</h2>

        <div className="max-w-[900px] mx-auto bg-white rounded shadow overflow-hidden">
       
          <div className="relative w-full">
            <img
              src={imageAssets.color}
              alt="Orange gradient banner"
              className="w-full h-[150px] object-cover bg-[#e67e22]"
            />
          </div>

          {/* Profile + Name + Actions */}
          <div className="flex items-center justify-between px-6 mt-[-50px]">
            {/* Left section: Picture + Info */}
            <div className="flex items-center space-x-4">
            
              <div className="w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden bg-[#d9b89a] relative">
                <img
                  src="https://placehold.co/90x90?text=Man+with+glasses+and+plaid+shirt"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 right-0 bg-[#e67e22] rounded-full p-[8px] border-2 border-white cursor-pointer"
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
                    className="bg-[#e67e22] text-white text-[12px] px-4 py-2 rounded-md font-bold"
                  >
                    Change Picture
                  </button>
                  <button
                    type="button"
                    disabled
                    className="bg-gray-300 text-gray-600 text-[12px] px-4 py-2 rounded-md font-bold cursor-not-allowed"
                  >
                    Delete Picture
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile */}
            <div className="text-[12px] text-[#e67e22] flex items-center cursor-pointer select-none">
              <FaEdit className="mr-1" />
              Edit Profile
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
                { label: "Occupation", id: "occupation", type: "text", placeholder: "Enter Here" },
                { label: "Work Address", id: "workAddress", type: "text", placeholder: "Enter Here" },
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
                    style={{ borderColor: "#e67e22" }}
                  />
                </div>
              ))}
            </form>

            {/* Save Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-[#e67e22] text-white text-[12px] px-5 py-2 rounded font-bold"
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
