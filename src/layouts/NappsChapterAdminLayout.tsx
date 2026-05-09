// layouts/Cbt.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import NappsSidebar from "../pages/napps/component/NappsSidebar";

export const NappsChapterAdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="">
      {/* <AdminCbtNavbar
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      /> */}

      <div>
        <div className="fixed top-0">
          <NappsSidebar variant="chapter-admin"/>
        </div>

        <div className=" lg:ml-64 px-6 py-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
