// AdminCbtNavbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { Search, Menu, ChevronDown, LogOut, User, Settings, Bell, Moon, Sun, UserCircle, Shield, Clock } from "lucide-react";
import imageAssets from "../../../assets/imageAssets";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const AdminCbtNavbar: React.FC<NavbarProps> = ({ onMenuClick, isSidebarOpen }) => {
  const { cbtUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cbtToken");
    logout();
    navigate("/cbt/login");
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Implement theme switching logic here
  };

  console.log("CBT User in Navbar:", cbtUser); // Debugging line

  // Get user initials
  const getUserInitials = () => {
    return cbtUser?.role?.split(' ').map((r: string) => r[0]).join('') || 'U';
  };

  const getRoleBadgeColor = () => {
    switch (cbtUser?.role) {
      case 'SchoolAdmin':
        return 'bg-purple-100 text-purple-700';
      case 'Teacher':
        return 'bg-blue-100 text-blue-700';
      case 'Student':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const notifications = [
    { id: 1, title: "New exam scheduled", time: "5 min ago", read: false },
    { id: 2, title: "Student submitted exam", time: "1 hour ago", read: false },
    { id: 3, title: "System update completed", time: "3 hours ago", read: true },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-2">
        {/* LEFT SECTION */}
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center ">
            <div className="relative">
              <img
                src={imageAssets.logo}
                alt="EduCat logo"
                width={60}
                height={60}
                className="block lg:hidden"
              />
              <img
                src={imageAssets.logo}
                alt="EduCat logo"
                width={56}
                height={44}
                className="hidden lg:block"
              />
            </div>
            <div className="hidden lg:block">
              <p className="text-xs text-gray-500 font-medium">Computer Based Testing System</p>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search exams, students, teachers..."
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 outline-none bg-gray-50 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all text-sm"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center space-x-2 lg:space-x-3">
        
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {/* {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slideDown">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button className="text-xs text-orange-600 hover:text-orange-700">Mark all read</button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-orange-50/30' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${!notif.read ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )} */}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-lg hover:bg-orange-50 transition-colors group"
            >
              <div className="relative">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {getUserInitials()}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {cbtUser?.email || ''}
                </p>
                <div className="flex items-center space-x-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                    {cbtUser?.role === 'SchoolAdmin' ? 'School Admin' : cbtUser?.role}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </div>
              
              <ChevronDown className="w-4 h-4 text-gray-400 lg:hidden group-hover:text-orange-500 transition-colors" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slideDown">
                {/* User Info Header */}
                <div className="p-4 bg-linear-to-r from-orange-50 to-orange-100/50 border-b border-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900">{cbtUser?.schoolName}</h4>
                      <p className="text-xs text-gray-600">{cbtUser?.email}</p>
                      {/* <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRoleBadgeColor()}`}>
                        {cbtUser?.role === 'SchoolAdmin' ? 'School Admin' : cbtUser?.role}
                      </span> */}
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {/* <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                    <UserCircle className="w-4 h-4 group-hover:text-orange-500" />
                    <span className="text-sm flex-1 text-left">Profile</span>
                  </button> */}
                  {/* <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                    <Settings className="w-4 h-4 group-hover:text-orange-500" />
                    <span className="text-sm flex-1 text-left">Account Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                    <Shield className="w-4 h-4 group-hover:text-orange-500" />
                    <span className="text-sm flex-1 text-left">Privacy & Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group">
                    <Clock className="w-4 h-4 group-hover:text-orange-500" />
                    <span className="text-sm flex-1 text-left">Activity Log</span>
                  </button> */}
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:text-red-600" />
                    <span className="text-sm flex-1 text-left font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none bg-gray-50 focus:bg-white focus:border-orange-300 text-sm"
          />
        </div>
      </div>
    </nav>
  );
};

export default AdminCbtNavbar;