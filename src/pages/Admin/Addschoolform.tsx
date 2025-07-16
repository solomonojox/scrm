import React from "react";
import { Link } from "react-router-dom";


import Header from "../Header";   
import Footer from "../Footer";

const formFields = [
  { label: "School Name",           name: "schoolName",   type: "text",     placeholder: "Enter Name" },
  { label: "School Email",          name: "schoolEmail",  type: "email",    placeholder: "Enter Email" },
  { label: "School Phone Number",   name: "schoolPhone",  type: "tel",      placeholder: "Enter Number" },
  { label: "School Address",        name: "schoolAddress",type: "text",     placeholder: "Enter Address" },
  { label: "Country",               name: "country",      type: "text",     placeholder: "Enter Country" },
  { label: "State",                 name: "state",        type: "text",     placeholder: "Enter State" },
  { label: "City",                  name: "city",         type: "text",     placeholder: "Enter City" },
  { label: "Type of School",        name: "type",         type: "text",     placeholder: "Select Type" },
  { label: "Owner Name",            name: "ownerName",    type: "text",     placeholder: "Enter Name" },
  { label: "Owner Phone Number",    name: "ownerPhone",   type: "text",     placeholder: "Enter Number" },
  { label: "Owner Email",           name: "ownerEmail",   type: "text",     placeholder: "Enter Email" },
  { label: "Password",              name: "password",     type: "password", placeholder: "Enter Password" },
];

const Addschoolform = () => (
  <>
  
    <Header />

    {/* ---------- Page body ---------- */}
    <main className="bg-white flex justify-center px-4 py-8 font-[Inter]">
      <div className="w-full max-w-lg">
        <h1 className="text-center font-extrabold text-black text-xl">
          Registration Form
        </h1>
        <p className="text-center italic text-orange-600 text-sm mt-1 font-semibold">
          Fill out the form below to get your school started with EduCat.
        </p>
        <p className="text-center text-[9px] text-gray-600 mt-1">
          Note: Complete each section before moving to the next.
        </p>

        {/* Progress bar */}
        <section className="mt-6">
          <div className="h-2 w-full bg-gray-200 rounded-full relative">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: "30%" }}
              aria-label="progress bar"
            />
          </div>
          <div className="text-right text-[11px] text-gray-600 mt-1">100%</div>
          <div className="flex justify-between text-[11px] mt-2 font-semibold text-orange-600">
             <Link
                to="/addschoolform" className="underline"
            >
             Add School
              </Link>
             <Link
                to="/AddSchool" className="hover:underline"
            >
               Upload School License
              </Link>
          
             <Link
                to="/" className="hover:underline"
            >
              Add Account details
              </Link>
              <Link
                to="AddAdmin" className="hover:underline"
            >
              Add School Admin
              </Link>
          </div>
        </section>

        {/* Actual form */}
        <form className="mt-6 space-y-6">
          {formFields.map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block text-[13px] text-gray-700 mb-1"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                className="w-full border border-orange-400 rounded-md px-3 py-2 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
              />

              {/* Show T&C + Save only after the last field (password) */}
              {name === "password" && (
                <>
                  <p className="text-[11px] text-orange-500 font-semibold mt-2">
                    <Link to="/terms" className="hover:underline">
                      View Terms &amp; Conditions
                    </Link>
                  </p>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition"
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
    </main>

    {/* ---------- Global footer ---------- */}
    <Footer />
  </>
);

export default Addschoolform;
