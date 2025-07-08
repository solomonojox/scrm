import React, { useState, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Bell,
  // Settings,
  GraduationCap,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavbarDashboard = () => {
  const [logoutModal, setLogoutModal] = useState(false);

  const location = useLocation();
  const [navItems, setNavItems] = useState([
    { name: "Dashboard", href: "/admin/dashboard", active: false },
    { name: "Students", href: "/admin/students", active: false },
    { name: "Teachers", href: "/admin/teachers", active: false },
    { name: "Guardian", href: "/admin/guardians", active: false },
    { name: "Classroom", href: "/admin/classrooms", active: false },
    { name: "News", href: "/admin/newss", active: false },
    { name: "Events", href: "/admin/events", active: false },
    { name: "Session", href: "/admin/session", active: false }, // 👈 Add this line
  ]);

  useEffect(() => {
    // Update active state based on current location
    setNavItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: location.pathname.startsWith(item.href) || localStorage.getItem("activeNav") === item.href,
      }))
    );
  }, [location.pathname]);

  return (
    <nav className="bg-gray-900 px-6 py-4">y
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link to="#" className="flex items-center gap-2 text-white font-bold text-xl">
            <GraduationCap className="w-10 h-10 text-indigo-400" />
            SCRM
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => localStorage.setItem("activeNav", item.href)}
                className={`text-sm ${item.active
                  ? "text-white font-medium underline"
                  : "text-gray-400 hover:text-gray-200"
                  } transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors" onClick={() => setLogoutModal(true)}>
            <LogOut className="w-5 h-5" />
          </button>

          {/* Logout Modal */}
          {logoutModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Logout</h2>
                <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md mr-2"
                    onClick={() => setLogoutModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={() => {
                      localStorage.removeItem("activeNav");
                      localStorage.removeItem("userData");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
