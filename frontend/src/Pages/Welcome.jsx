import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoIosRocket } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import womanImg from "../Assets/woman.jpeg";

const Welcome = () => {
  return (
    <div>
      <div className='bg-white h-screen flex flex-col md:flex-row px-6 py-3'>
        
        {/* Left Sidebar */}
        <div className='hidden md:block bg-[whitesmoke] md:h-screen md:w-[400px] md:fixed md:py-10 md:px-10 md:rounded-md md:shadow-md'>
          <div>
            <p className='text-3xl font-bold capitalize'> SCRM</p>
          </div>
          <div className='mt-10 flex items-center space-x-3'>
            <div className='bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border'>
              <FaUser />
            </div>
            <Link to={"/"}>
              <div className='font-bold text-lg'>
                <p>Add Guardian Details</p>
               
              </div>
            </Link>
          </div>
          <div className='mt-10 flex items-center space-x-3'>
            <div className='bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border'>
              <MdEmail />
            </div>
            <Link to={"/student"}>
              <div className='text-lg'>
                <p>Add Student Details</p>
              </div>
            </Link>
          </div>
          <div className='mt-10 flex items-center space-x-3'>
            <div className='bg-white px-4 py-2 flex items-center text-2xl w-[55px] h-[50px] rounded-md border'>
              <IoIosRocket />
            </div>
            <Link to={"/welcome"}>
              <div className='text-lg'>
                <p>Welcome to SCRM!</p>
                <p className='font-normal text-gray-700 text-sm'>Get up and running in 3 minutes</p>
              </div>
            </Link>
          </div>
          <div className='mt-[200px] flex items-center'>
            <div className='flex space-x-2 items-center'>
              <FaArrowLeft className='text-xl' />
              <p className='font-bold text-lg'>Back to home</p>
            </div>
            <div>
              <p className='text-lg font-bold ml-20'>Sign In</p>
            </div>
          </div>
        </div>

        {/* Right Content (Main Section) */}
        <div className='bg-white md:h-screen w-full md:w-[800px] py-10 md:ml-[400px] px-6 md:px-10 flex flex-col items-center'>
          <div className='flex flex-col items-center'>
            <p className='text-3xl font-bold'>Welcome to SCRM</p>
            <p className='text-gray-700'>Get up and running in 3 minutes</p>
          </div>
          <div>
            <img src={womanImg} alt="Welcome" className='h-[300px] w-[500px] mt-5 rounded-lg object-cover' />
          </div>
          <button className='mt-4 px-32 py-2 bg-green-800 hover:bg-green-700 text-white font-bold rounded-md'>
            Finish Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
