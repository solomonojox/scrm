import React, { useState } from "react";
import { Search, Menu, ChevronDown, LogOut, User } from "lucide-react";
import imageAssets from "../../../assets/imageAssets";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const AdminCbtNavbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { cbtUser, logout } = useAuth()
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem("scrmToken");
      logout();
      navigate("/cbt");
    };
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const handleProfileClick = () => {
    setShowProfileDropdown((prev) => !prev);
  };
  

  

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-orange-600">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <img
                src={imageAssets.logo}
                alt="EduCat logo"
                width={96}
                height={44}
                className="block"
              />
              <p className="hidden md:block text-xs text-gray-500">Computer Based Testing System</p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-orange-100 rounded-lg pl-10 pr-4 py-2 outline-none bg-orange-50/50 focus:ring-1 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-3">
          {/* profile and logout */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-600"
            >
              <div className="flex flex-col items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  {cbtUser?.role
                    .split(" ")
                    .map((role) => role.charAt(0))
                    .join("")}
                </div>
                <span className="hidden md:block text-sm">{ cbtUser?.role === 'SchoolAdmin' ? "School Admin" : cbtUser?.role}</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
            {/* {showProfileDropdown && <ProfileDropdown />} */}
            <div
              className={`absolute right-0 z-50 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg ${
                showProfileDropdown ? "block" : "hidden"
              }`}
            >
              <div className="py-2">
                {/* <a
                  href="#"
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  <cbtUser className="w-4 h-4 mr-2" />
                  <span>Profile</span>
                </a> */}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminCbtNavbar;
