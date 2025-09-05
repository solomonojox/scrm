// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import GuardianSidebar from "../pages/Guardian/GuardianSidebar";
import GuardianHeader from "../pages/Guardian/GuardianHeader";
import { useState } from "react";

export const GuardianLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="w-full h-full bg-[#EDEDED] flex">
      {/* Sidebar */}
      <GuardianSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div
        className={`
          flex-1 min-w-0
          transition-all duration-300
          lg:ml-60   /* Push content right on large screens */
        `}
      >
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#EDEDED]">
          <GuardianHeader onToggleSidebar={toggleSidebar} />
        </div>

        {/* Page content */}
        <div className="my-24 px-2 sm:px-4 w-full overflow-x-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
