/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Search, MessageSquare, Bell, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const TeacherNavbarDashboard = () => {
  const location = useLocation();
  const [logoutModal, setLogoutModal] = useState(false);
  const [navItems, setNavItems] = useState([
    { name: 'Dashboard', href: '/teacher/dashboard', active: true },
    { name: 'Students', href: '/teacher/students', active: false },
    { name: 'Result', href: '/teacher/result', active: false },
    { name: 'Assignment', href: '/assignmentss', active: false },
  ]);

  // const handleActive = (href) => {
  //   navItems.forEach((item) => {
  //     if (item.href === location.pathname) {
  //       item.active = true;
  //     } else {
  //       item.active = false;
  //     }
  //   });
  // };

  useEffect(() => {
    // Update active state based on current location
    setNavItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: location.pathname.startsWith(item.href) || localStorage.getItem("activeTeacherNav") === item.href,
      }))
    );
  }, [location.pathname]);

  return (
    <nav className="bg-gray-900 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-12">
          <Link to="#" className="text-white font-bold text-xl">
            SCRM
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                onClick={() => localStorage.setItem("activeTeacherNav", item.href)}
                key={item.name}
                to={item.href}
                className={`text-sm ${item.active
                  ? 'text-white font-medium'
                  : 'text-gray-400 hover:text-gray-200'
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
                      localStorage.removeItem("activeTeacherNav");
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

export default TeacherNavbarDashboard;