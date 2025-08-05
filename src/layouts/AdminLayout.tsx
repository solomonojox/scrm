// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../pages/Admin/AdminSidebar";
import Adminheader from "../pages/Admin/Adminheader";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 lg:ml-64 mt-14">
        <Adminheader />
        {/* 64 matches sidebar width */}
        <Outlet />
      </div>
    </div>
  );
};