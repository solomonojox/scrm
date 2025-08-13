// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import GuardianSidebar from "../pages/Guardian/GuardianSidebar";
import GuardianHeader from "../pages/Guardian/GuardianHeader";

export const GuardianLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-gray-200 flex gap-4">
      <div className="hidden lg:block">
        <GuardianSidebar />
      </div>
      <div className="flex-1 ">
        <div>
          <GuardianHeader />
        </div>

        <div className="lg:ml-64 mt-20 lg:px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
