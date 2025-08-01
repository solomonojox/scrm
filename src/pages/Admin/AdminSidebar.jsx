import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaThLarge,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaBook,
  FaNewspaper,
  FaCalendarAlt,
  FaChalkboard,
  FaFileInvoiceDollar,
  FaSignOutAlt
} from 'react-icons/fa';
import { FiChevronRight } from 'react-icons/fi';

const SidebarButton = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`
        flex items-center justify-between
        py-3 px-4 rounded-lg w-full
        transition-all duration-200
        group
        ${isActive
          ? 'bg-orange-50 text-orange-600 font-medium shadow-sm'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={`
          text-lg
          ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}
        `}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <FiChevronRight className={`
        text-xs opacity-0 transform -translate-x-1
        ${isActive ? 'opacity-100 translate-x-0 text-orange-500' : 'group-hover:opacity-70 group-hover:translate-x-0'}
        transition-all duration-200
      `} />
    </Link>
  );
};

const AdminSidebar = () => {
  return (
    <div
      className="
        fixed
        top-[70px]
        left-0
        w-64
        h-[calc(100vh-70px)]
        bg-white
        border-r border-gray-100
        flex flex-col
        px-3 py-5
        z-10
        overflow-y-auto
      "
    >
      <div className="flex-1 space-y-1">
        <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </h3>
        
        <SidebarButton icon={<FaThLarge />} label="Dashboard" to="/admin/admindashboard" />
        
        <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          User Management
        </h3>
        <SidebarButton icon={<FaUserGraduate />} label="Students" to="/admin/students" />
        <SidebarButton icon={<FaChalkboardTeacher />} label="Teachers" to="/teachers" />
        <SidebarButton icon={<FaUserFriends />} label="Guardians" to="/admin/all-guardian" />
        
        <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Academics
        </h3>
        <SidebarButton icon={<FaBook />} label="Classroom" to="/teacher/class" />
        <SidebarButton icon={<FaChalkboard />} label="Session" to="/admin/session" />
        
        <h3 className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Operations
        </h3>
        <SidebarButton icon={<FaNewspaper />} label="News" to="/admin/news" />
        <SidebarButton icon={<FaCalendarAlt />} label="Events" to="/admin/events" />
        <SidebarButton icon={<FaFileInvoiceDollar />} label="School Fee" to="/admin/schoolfee" />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="
          flex items-center space-x-2
          w-full text-left
          py-2.5 px-4 rounded-lg
          text-sm font-medium
          text-red-600 hover:bg-red-50
          transition-colors duration-150
        ">
          <FaSignOutAlt className="text-base" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;