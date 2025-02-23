import React from "react";
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
import assets from "../Assets/assets";

const Sidebar = () => {
  // const guardianData = JSON.parse(localStorage.getItem('guardian'));
  // console.log("Guardian Data",guardianData);

  return (
    <div className="bg-gray-100 w-[230px] fixed h-screen p-5">
      {/* <p className="font-bold text-2xl">SCRM</p> */}
      <div className="flex flex-col mt-1 space-y-5">
        <div className="flex flex-col  space-x-3 mt-5">
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
            <Link
              to={"/guardian/dashboard"}
              className="flex items-center space-x-3 hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <MdDashboard className="text-xl " />
              <div>
                <p>Dashboard</p>
              </div>
            </Link>
            <Link
              to={"/studentdata"}
              className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <FaBookReader className="text-xl " />
              <Link to="/studentdata">
                <p>My Pupils</p>
              </Link>
            </Link>
            <Link
              to={"/assignment"}
              className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <SiGoogleanalytics className="text-xl " />
              <div>
                <p>Assignment</p>
              </div>
            </Link>
            <Link
              to="/news"
              className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <RiCommunityFill className="text-xl " />
              <div>
                <p>News</p>
              </div>
            </Link>
            <Link
              to={"/event"}
              className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <MdOutlineEventSeat className="text-xl " />
              <div>
                <p>Event</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer">
              <FaMessage className="text-xl " />
              <p>Message</p>
            </div>
            <div className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer">
              <BiSolidReport className="text-xl " />
              <p>Result</p>
            </div>
            <Link
              to={"/fee"}
              className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer"
            >
              <MdOutlinePayments className="text-xl " />
              <div>
                <p>Fees</p>
              </div>
            </Link>
            <div className="flex items-center space-x-3  hover:bg-gray-200 p-2 rounded-md cursor-pointer">
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
