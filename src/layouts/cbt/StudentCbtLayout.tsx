// layouts/Cbt.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminCbtSidebar from "../../pages/Cbt/Admin/AdminCbtSidebar";
import AdminCbtNavbar from "../../pages/Cbt/Admin/AdminCbtNavbar";

export const StudentCbtLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="">
      <AdminCbtNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="">
        <AdminCbtSidebar isSidebarOpen={isSidebarOpen} />

        <div className="lg:ml-64 py-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
