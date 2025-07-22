import React from 'react';
import {
  FaThLarge, FaUserGraduate, FaChalkboardTeacher, FaUserFriends, FaBook,
  FaNewspaper, FaCalendarAlt, FaChalkboard, FaFileInvoiceDollar
} from 'react-icons/fa';

// Sidebar button component
const SidebarButton = ({ icon, label, active }) => {
  return (
    <button
      className={`flex items-center space-x-2 text-sm py-2 px-3 rounded-md transition ${
        active ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-600 hover:bg-gray-100'
      } w-full text-left`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const AdminSidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col px-4 py-6 space-y-4">
      {/* Logo */}
      {/* <div className="flex items-center space-x-2 mb-6 px-2">
        <img src="/your-logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg text-gray-800">EduCat</span>
      </div> */}

      <SidebarButton icon={<FaThLarge />} active label="Dashboard" />
      <SidebarButton icon={<FaUserGraduate />} label="Students" />
      <SidebarButton icon={<FaChalkboardTeacher />} label="Teachers" />
      <SidebarButton icon={<FaUserFriends />} label="Guardian" />
      <SidebarButton icon={<FaBook />} label="Classroom" />
      <SidebarButton icon={<FaNewspaper />} label="News" />
      <SidebarButton icon={<FaCalendarAlt />} label="Events" />
      <SidebarButton icon={<FaChalkboard />} label="Session" />
      <SidebarButton icon={<FaFileInvoiceDollar />} label="School Fee" />

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Logout */}
      <button className="bg-red-100 text-red-600 text-xs font-semibold py-2 rounded hover:bg-red-200 transition">
        Log Out
      </button>
    </div>
  );
};

export default AdminSidebar;
