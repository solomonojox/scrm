import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { student } from "../../../constants/StudentCbtConstant";
import Icon from "../../../components/Cbt/student/UI/Icon";
import { useAuth } from "../../../Context/Auth/useAuth";
import { Bell, ChevronDown, LogOut } from "lucide-react";

interface StudentCbtTopNavProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface StudentNotification {
  id: string | number;
  title: string;
  time: string;
  read: boolean;
}

const pageNames: Record<string, string> = {
  "/student/dashboard": "Dashboard",
  "/student/exams": "Available Exams",
  "/student/results": "My Results",
  "/student/performance": "Performance Analytics",
  "/student/practice": "Practice Tests",
  "/student/notifications": "Notifications",
  "/student/settings": "Profile Settings",
};

const StudentCbtTopNav: React.FC<StudentCbtTopNavProps> = ({ setCollapsed, setMobileOpen }) => {
  const { cbtUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<StudentNotification[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const title = pageNames[location.pathname] ?? "Student Portal";

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cbtToken");
    logout();
    navigate("/cbt/login");
  };

  const handleProfileClick = () => {
    setShowProfileDropdown((prev) => !prev);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    setShowProfileDropdown(false);
  };

  const getUserInitials = () => {
    return (
      cbtUser?.role
        ?.split(" ")
        .map((r: string) => r[0])
        .join("") || "U"
    );
  };

  const getRoleBadgeColor = () => {
    switch (cbtUser?.role) {
      case "SchoolAdmin":
        return "bg-purple-100 text-purple-700";
      case "Teacher":
        return "bg-blue-100 text-blue-700";
      case "Student":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const hasUnreadNotifications = notifications.some((n) => !n.read);

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-orange-500"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Desktop collapse */}
        <button
          className="hidden md:block p-2 rounded-lg hover:bg-gray-100 text-orange-500"
          onClick={() => setCollapsed((c) => !c)}
        >
          <Icon name="menu" size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString()}
          </p>
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
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slideDown">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button className="text-xs text-orange-600 hover:text-orange-700">
                    Mark all read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notif.read ? "bg-orange-50/30" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 mt-2 rounded-full ${
                            !notif.read ? "bg-orange-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
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
              <p className="text-sm font-semibold text-gray-900">{cbtUser?.email || ""}</p>
              <div className="flex items-center space-x-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor()}`}>
                  {cbtUser?.role === "SchoolAdmin" ? "School Admin" : cbtUser?.role}
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
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
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
    </header>
  );
};

export default StudentCbtTopNav;