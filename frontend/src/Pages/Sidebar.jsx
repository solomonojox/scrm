import React from 'react'
import { MdDashboard } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { RiCommunityFill } from "react-icons/ri";
import { MdOutlineEventSeat } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";
import { BiSolidReport } from "react-icons/bi";
import { MdOutlinePayments } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { Link } from "react-router-dom";
import assets from '../Assets/assets';

const Sidebar = () => {
  return (
    <div className="bg-gray-100 w-[200px] fixed h-screen px-5 py-5">
      {/* <p className="font-bold text-2xl">SCRM</p> */}
      <div className="flex flex-col mt-1 space-y-5">
        <div className='flex flex-col items-center space-x-3 mt-5'>
          {/* <MdDashboard className='' /> */}
          {/* <Link to='/student/dashboard' > <p className=''> Dashboard</p> </Link> */}
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-300">
            <Link to={"/guardian/dashboard"}>
              <img src={assets.scrm} alt="" width={100} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col mt-5 space-y-5">
            <div className="flex items-center space-x-3">
              <MdDashboard className="text-xl " />
              <Link to="/guardian/dashboard">
                <p>Dashboard</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <FaBookReader className="text-xl " />
              <Link to="/studentdata">
                <p>My Pupils</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <SiGoogleanalytics className="text-xl " />
              <Link to="/assignment">
                <p>Assignment</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <RiCommunityFill className="text-xl " />
              <Link to="/news">
                <p>News</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <MdOutlineEventSeat className="text-xl " />
              <Link to="/event">
                <p>Event</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <FaMessage className="text-xl " />
              <p>Message</p>
            </div>
            <div className="flex items-center space-x-3">
              <BiSolidReport className="text-xl " />
              <p>Result</p>
            </div>
            <div className="flex items-center space-x-3">
              <MdOutlinePayments className="text-xl " />
              <Link to="/fee">
                <p>Fees</p>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <IoSettingsSharp className="text-xl " />
              <p>Settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
