import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      <div className="bg-white h-screen flex flex-col md:flex-row px-6 py-3">
        {/* Left Sidebar */}
        <div className="hidden md:block md:bg-[whitesmoke] md:h-full md:w-[400px] md:fixed md:py-10 md:px-10 md:rounded-md md:shadow-md">
          <div>
            <p className="text-3xl font-bold capitalize">SCRM</p>
          </div>
          <div className="mt-10 flex items-center space-x-3">
            <div className="bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border">
              <FaUser />
            </div>
            <Link to={"/"}>
              <div className="font-bold text-xl">
                <p>Add Guardian Details</p>
              </div>
            </Link>
          </div>
          <div className="mt-10 flex items-center space-x-3">
            <div className="bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border">
              <MdEmail />
            </div>
            <Link to={"/student"}>
              <div className="text-lg">
                <p>Add Student Details</p>
              </div>
            </Link>
          </div>
          <div className="mt-10 flex items-center space-x-3">
            <div className="bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border">
              <IoIosRocket />
            </div>
            <Link to={"/welcome"}>
              <div className="text-lg">
                <p>Welcome to SCRM!</p>
                <p className="font-normal text-gray-700 text-sm">Get up and running in 3 minutes</p>
              </div>
            </Link>
          </div>
          <div className="mt-[200px] flex items-center">
            <div className="flex space-x-2 items-center">
              <FaArrowLeft className="text-xl" />
              <p className="font-bold text-lg">Back to home</p>
            </div>
            <div>
              <p className="text-lg font-bold ml-20">Sign In</p>
            </div>
          </div>
        </div>

        {/* Right Content (Form Section) */}
        <div className="bg-white md:h-screen w-full md:w-[500px] py-10 md:ml-[500px] px-6 md:px-10 flex flex-col items-center">
          <div className="text-4xl font-bold text-center">
            <p>Register a Student</p>
            <p className="font-normal text-lg ml-2 text-gray-700">Provide your email and choose a password.</p>
          </div>

          <div className="mt-5 w-full max-w-md">
            <form className="flex flex-col space-y-4">
              <label htmlFor="" className="font-semibold text-lg">
                Firstname:
              </label>
              <input
                type="text"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Enter your firstname"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Lastname:
              </label>
              <input
                type="text"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Enter your lastname"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Email:
              </label>
              <input
                type="email"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Enter your email"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Occupation:
              </label>
              <input
                type="text"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Occupation"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Home Address:
              </label>
              <input
                type="text"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Home Address"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Work Address:
              </label>
              <input
                type="text"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Work Address"
              />

              <label htmlFor="" className="font-semibold text-lg">
                Phone:
              </label>
              <input
                type="number"
                className="border-2 w-full max-w-md rounded-md py-3 px-4 focus:outline-none text-sm"
                placeholder="Enter your phone number"
              />
              <Link to={"/student"}>
              <button className="px-10 py-2 text-white w-full max-w-md bg-green-800 rounded-md mt-2 text-xl font-bold hover:bg-green-700 shadow-md mb-2">
                Continue
              </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
