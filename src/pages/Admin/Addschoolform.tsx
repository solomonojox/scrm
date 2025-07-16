import React from "react";
import { Link } from "react-router-dom";

const Addschoolform = () => {
  const formFields = [
    { label: "School Name", name: "schoolName", type: "text", placeholder: "Enter Name" },
    { label: "School Email", name: "schoolEmail", type: "email", placeholder: "Enter Email" },
    { label: "School Phone Number", name: "schoolPhone", type: "tel", placeholder: "Enter Number" },
    { label: "School Address", name: "schoolAddress", type: "text", placeholder: "Enter Address" },
    { label: "Country", name: "country", type: "text", placeholder: "Enter Country" },
    { label: "State", name: "state", type: "text", placeholder: "Enter State" },
    { label: "City", name: "city", type: "text", placeholder: "Enter City" },
    { label: "Type of School", name: "type", type: "text", placeholder: "Select Type" },
    { label: "Owner Name", name: "ownerName", type: "text", placeholder: "Enter Name" },
    { label: "Owner Phone Number", name: "ownerPhone", type: "text", placeholder: "Enter Number" },
    { label: "Owner Email", name: "ownerEmail", type: "text", placeholder: "Enter Email" },
    { label: "Password", name: "password", type: "password", placeholder: "Enter Password" },
  ];

  return (
    <div className="bg-white flex justify-center px-4 py-8 font-[Inter]">
      <div className="w-full max-w-lg">
        <h1 className="text-center font-extrabold text-black text-xl leading-tight">
          Registration Form
        </h1>
        <p className="text-center italic text-orange-600 text-sm mt-1 font-semibold">
          Fill out the form below to get your school started with EduCat.
        </p>
        <p className="text-center text-[9px] text-gray-600 mt-1">
          Note: Complete each section before moving to the next.
        </p>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="h-2 w-full bg-gray-200 rounded-full relative">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: "30%" }}
              aria-label="progress bar"
            ></div>
          </div>
          <div className="text-right text-[11px] text-gray-600 mt-1 font-normal">
            100%
          </div>
          <div className="flex justify-between text-[11px] mt-2 font-semibold text-orange-600">
            <button type="button" className="underline">
              Add School
            </button>
            <button type="button">Upload School License</button>
            <button type="button">Add School Admin</button>
          </div>
        </div>

        {/* Form */}
        <form className="mt-6 space-y-6">
          {formFields.map((field, index) => (
            <div key={index}>
              <label
                htmlFor={field.name}
                className="block text-[13px] text-gray-700 font-normal mb-1"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border border-orange-400 rounded-md px-3 py-2 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />

              {/* Terms & Conditions + Save Button appear after Password input */}
              {field.name === "password" && (
                <>
                  <p className="text-[11px] text-orange-500 font-semibold mt-2">
                    <Link to="/terms" className="hover:underline">
                      View Terms &amp; Conditions
                    </Link>
                  </p>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default Addschoolform;
