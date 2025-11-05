// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import GuardianHeader from "../pages/Guardian/GuardianHeader";
import { useState } from "react";

export const SuperAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="bg-[#EDEDED]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#EDEDED]">
        <GuardianHeader onToggleSidebar={toggleSidebar} />
      </div>

      {/* Page content */}
      <div className="my-24 px-2 sm:px-4 w-full overflow-x-auto">
        <Outlet />
      </div>
    </div>
  );
};
