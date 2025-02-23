import React, { useState, useEffect } from "react";
import { Search, MessageSquare, Bell, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NavbarDashboard = () => {
  const location = useLocation();
  const [navItems, setNavItems] = useState([
    { name: "Dashboard", href: "/admin/dashboard", active: false },
    { name: "Students", href: "/admin/students", active: false },
    { name: "Teachers", href: "/admin/teachers", active: false },
    { name: "Guardian", href: "/admin/guardians", active: false },
    { name: "Classroom", href: "/admin/classrooms", active: false },
    { name: "School fees", href: "/admin/schoolfees", active: false },
    { name: "News", href: "/admin/news", active: false },
    { name: "Events", href: "/admin/events", active: false },
  ]);

  useEffect(() => {
    // Update active state based on current location
    setNavItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: location.pathname.startsWith(item.href),
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
                key={item.name}
                to={item.href}
                className={`text-sm ${
                  item.active
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
          <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
