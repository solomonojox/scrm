// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/Admin/AdminSidebar";
import Adminheader from "../pages/Admin/Adminheader";
import { useState } from "react";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev: any) => !prev);

  return (
    <div className="">
      {/* <div className="hidden lg:block">
      </div> */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
      <div className="flex-1 lg:ml-64 mt-14">
        <Adminheader onToggleSidebar={toggleSidebar} />
        {/* 64 matches sidebar width */}
        <Outlet />
      </div>
    </div>
  );
};