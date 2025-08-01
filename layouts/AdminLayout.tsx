// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "../src/pages/Admin/AdminSidebar";
import Adminheader from "../src/pages/Admin/Adminheader";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <Adminheader />
        {/* 64 matches sidebar width */}
        <Outlet/>
      </div>
    </div>
  );
};