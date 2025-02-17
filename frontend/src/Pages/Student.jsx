import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Student = () => {
  return (
    <div>
      <div className="bg-white h-screen flex px-6 py-3">
        {/* Sidebar  */}
        <div className="hidden md:block md:bg-[whitesmoke] md:h-screen md:w-[400px] md:fixed md:py-10 md:px-10 md:rounded-md md:shadow-md">
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

        {/* Main Form Section */}
        <div className="mt-10 h-screen w-full md:w-[500px] flex flex-col items-center md:ml-[500px] px-6">
          <p className="text-3xl font-bold ml-[20px] mb-4">Student details</p>
          <form action="" className="flex flex-col w-full max-w-md">
            <label htmlFor="" className="font-semibold text-lg">Firstname:</label>
            <input
              type="text"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Enter your firstname"
            />

            <label htmlFor="" className="font-semibold text-lg mt-4">Lastname:</label>
            <input
              type="text"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Enter your lastname"
            />

            <label htmlFor="" className="font-semibold text-lg mt-4">Age:</label>
            <input
              type="number"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Age"
            />

            <label htmlFor="" className="font-semibold text-lg mt-4">Class:</label>
            <input
              type="text"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Class"
            />

            <label htmlFor="" className="font-semibold text-lg mt-4">Teacher:</label>
            <input
              type="text"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Teacher"
            />

            <label htmlFor="" className="font-semibold text-lg mt-4">Home Address:</label>
            <input
              type="text"
              className="border-2 w-full rounded-md py-3 px-4 focus:outline-none text-sm"
              placeholder="Home Address"
            />

           <Link to={"/welcome"}>
           <button className="px-10 py-2 mb-2 text-white w-full bg-green-800 rounded-md mt-4 text-xl font-bold hover:bg-green-700 shadow-md">
              Continue
            </button>
           </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Student;
