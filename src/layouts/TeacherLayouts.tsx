// layouts/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import TeacherSidebar from "../pages/Teachers/TeacherSidebar";
import Teacherheader from "../pages/Teachers/Teacherheader";

export const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <TeacherSidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className={`fixed inset-0 z-40 flex lg:hidden`}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white h-full shadow-lg">
            <TeacherSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <Teacherheader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="mt-20 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
