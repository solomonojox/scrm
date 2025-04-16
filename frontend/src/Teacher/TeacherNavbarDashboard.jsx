import React from 'react';
import { Search, MessageSquare, Bell, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const TeacherNavbarDashboard = () => {
  const location = useLocation();
  const navItems = [
    { name: 'Dashboard', href: '/teacher/dashboard', active: true },
    { name: 'Students', href: '/teacher/students', active: false },
    { name: 'Result', href: '/teacher/result', active: false },
    { name: 'Assignment', href: '/assignmentss', active: false },
      ];

  const handleActive = (href) => {
    navItems.forEach((item) => {
      if (item.href === location.pathname) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  };

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
                onClick={handleActive(item)}
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
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbarDashboard;