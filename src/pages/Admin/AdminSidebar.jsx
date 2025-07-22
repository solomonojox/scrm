import React from 'react';
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

const SidebarButton = ({ icon, label, active }) => (
  <button
    className={`
      flex items-center space-x-2 text-sm py-2 px-3 rounded-md w-full text-left transition
      ${active
        ? 'bg-orange-100 text-orange-700 font-semibold'
        : 'text-gray-600 hover:bg-gray-100'}
    `}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
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
    <div className="space-y-3">
      <SidebarButton icon={<FaThLarge />} active label="Dashboard" />
      <SidebarButton icon={<FaUserGraduate />} label="Students" />
      <SidebarButton icon={<FaChalkboardTeacher />} label="Teachers" />
      <SidebarButton icon={<FaUserFriends />} label="Guardian" />
      <SidebarButton icon={<FaBook />} label="Classroom" />
      <SidebarButton icon={<FaNewspaper />} label="News" />
      <SidebarButton icon={<FaCalendarAlt />} label="Events" />
      <SidebarButton icon={<FaChalkboard />} label="Session" />
      <SidebarButton icon={<FaFileInvoiceDollar />} label="School Fee" />
    </div>

    {/* Logout */}
    <button className="w-full text-left bg-red-100 text-red-600 text-xs font-semibold py-2 px-3 rounded hover:bg-red-200 transition">
      Log Out
    </button>
  </div>
);

export default AdminSidebar;
