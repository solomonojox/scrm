import React from 'react'
// import { FaSearch } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { RiCommunityFill } from "react-icons/ri";
import { MdOutlineEventSeat } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { MdOutlinePayments } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { Link } from "react-router-dom"
const Sidebar = () => {
  return (
    <div>
      <div className="bg-gray-100 w-[200px] fixed h-screen px-5 py-5">
        <p className="font-bold text-2xl">SCRM</p>
        <div className="flex flex-col mt-1 space-y-5">
          <div className='flex items-center space-x-3 mt-5'>
            <MdDashboard className='' />
            <Link to='/student/dashboard' > <p className=''> Dashboard</p> </Link>
          </div>
          <div className='flex space-x-3 mt-5'>
            <FaBookReader className='text-xl' />
            <Link to='/studentdata' > <p className=''>My Pupils</p> </Link>
          </div>
          <div className='flex space-x-3 mt-5'>
            <SiGoogleanalytics className='' />
            <Link to='/assignment' > <p className=''>Assignment</p> </Link>
          </div>
          <div className='flex space-x-3 mt-5'>
            <RiCommunityFill className='text-xl' />
            <Link to='/news' > <p className=''>News</p> </Link>
          </div>
          <div className='flex space-x-3 mt-5'>
            <MdOutlineEventSeat className='text-xl' />
            <p className=''>Events</p>
          </div>
          <div className='flex items-center space-x-3 mt-5'>
            <FaMessage className='' />
            <p className=''>Message</p>
          </div>
          <div className='flex space-x-3 mt-5'>
            <BiSolidReport className='text-xl' />
            <p className=''>Result</p>
          </div>
          <div className='flex space-x-3 mt-5'>
            <MdOutlinePayments className='text-xl' />
            <p className=''>Fees</p>
          </div>
          <div className='flex space-x-3 mt-5'>
            <IoSettingsSharp className='text-xl' />
            <p className=''>Settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar