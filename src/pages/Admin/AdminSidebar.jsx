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
import { Link, useLocation } from 'react-router-dom';

const SidebarButton = ({ icon, label, to, active }) => (
  <Link to={to} className="block">
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
  </Link>
);

const AdminSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
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
        <SidebarButton icon={<FaThLarge />} to="/admin/admindashboard" label="Dashboard" active={currentPath === '/admin/admindashboard'} />
        <SidebarButton icon={<FaUserGraduate />} to="/admin/students" label="Students" active={currentPath === '/admin/students'} />
        <SidebarButton icon={<FaChalkboardTeacher />} to="/admin/teachers" label="Teachers" active={currentPath === '/admin/teachers'} />
        <SidebarButton icon={<FaUserFriends />} to="/admin/guardians" label="Guardian" active={currentPath === '/admin/guardians'} />
        <SidebarButton icon={<FaBook />} to="/admin/classroom" label="Classroom" active={currentPath === '/admin/classroom'} />
        <SidebarButton icon={<FaNewspaper />} to="/admin/news" label="News" active={currentPath === '/admin/news'} />
        <SidebarButton icon={<FaCalendarAlt />} to="/admin/events" label="Events" active={currentPath === '/admin/events'} />
        <SidebarButton icon={<FaChalkboard />} to="/admin/session" label="Session" active={currentPath === '/admin/session'} />
        <SidebarButton icon={<FaFileInvoiceDollar />} to="/admin/schoolfee" label="School Fee" active={currentPath === '/admin/schoolfee'} />
      </div>

      {/* Logout */}
      <button className="w-full text-left bg-red-100 text-red-600 text-xs font-semibold py-2 px-3 rounded hover:bg-red-200 transition">
        Log Out
      </button>
    </div>
  );
};

export default AdminSidebar;
