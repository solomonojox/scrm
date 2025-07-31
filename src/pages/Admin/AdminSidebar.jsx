import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaThLarge,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaBook,
  FaNewspaper,
  FaCalendarAlt,
  FaChalkboard,
  FaFileInvoiceDollar
} from 'react-icons/fa';

const SidebarButton = ({ icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center space-x-2 text-sm py-2 px-3 rounded-md w-full text-left transition
      ${isActive
        ? 'bg-orange-100 text-orange-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'}
    `}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

const AdminSidebar = () => (
  <div
    className="
      fixed
      top-[70px]
      left-0
      w-64
      h-[calc(100vh-70px)]
      bg-white
      border-r border-gray-200
      flex flex-col justify-between
      px-4 py-6
      z-10
    "
  >
    {/* Menu items */}
    <div className="space-y-2 text-sm">
      <SidebarButton icon={<FaThLarge />} label="Dashboard" to="/dashboard" />
      <SidebarButton icon={<FaUserGraduate />} label="Students" to="/students" />
      <SidebarButton icon={<FaChalkboardTeacher />} label="Teachers" to="/teachers" />
      <SidebarButton icon={<FaUserFriends />} label="Guardian" to="/admin/all-guardian" />
      <SidebarButton icon={<FaBook />} label="Classroom" to="/classroom" />
      <SidebarButton icon={<FaNewspaper />} label="News" to="/news" />
      <SidebarButton icon={<FaCalendarAlt />} label="Events" to="/events" />
      <SidebarButton icon={<FaChalkboard />} label="Session" to="/session" />
      <SidebarButton icon={<FaFileInvoiceDollar />} label="School Fee" to="/school-fee" />
    </div>

    {/* Logout */}
    <button className="w-full text-left bg-red-100 text-red-600 text-xs font-semibold py-2 px-3 rounded hover:bg-red-200 transition">
      Log Out
    </button>
  </div>
);

export default AdminSidebar;
