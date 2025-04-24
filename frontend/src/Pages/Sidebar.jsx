import React from "react";
import { NavLink } from "react-router-dom";
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

const navItems = [
  { to: "/guardian/dashboard", icon: <MdDashboard />, label: "Dashboard" },
  { to: "/studentdata",       icon: <FaBookReader />, label: "My Pupils" },
  { to: "/assignment",        icon: <SiGoogleanalytics />, label: "Assignment" },
  { to: "/news",              icon: <RiCommunityFill />, label: "News" },
  { to: "/event",             icon: <MdOutlineEventSeat />, label: "Event" },
  { to: "/message",           icon: <FaMessage />, label: "Message" },
  { to: "/result",            icon: <BiSolidReport />, label: "Result" },
  { to: "/fee",               icon: <MdOutlinePayments />, label: "Fees" },
  { to: "/settings",          icon: <IoSettingsSharp />, label: "Settings" },
];

const Sidebar = () => {
  return (
    <aside className="bg-gray-100 w-60 fixed h-screen p-5">
      <div className="flex items-center pb-4 border-b border-gray-300">
        <Link to="/guardian/dashboard">
          <img src={assets.scrm} alt="Logo" width={100} />
        </Link>
      </div>

      <nav className="mt-6 flex flex-col space-y-2">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors duration-150
               ${isActive ? 'bg-gray-200 text-gray-700' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <span className="text-xl">{icon}</span>
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
