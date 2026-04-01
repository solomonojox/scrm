// layouts/StudentCbtLayout.tsx

import { Outlet } from "react-router-dom";
import { useState } from "react";
import StudentCbtSidebar from "../../pages/Cbt/Students/StudentCbtSidebar";
import StudentCbtTopNav from "../../pages/Cbt/Students/StudentCbtTopNav";



export default function StudentCbtLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">

      <StudentCbtSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StudentCbtTopNav
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}