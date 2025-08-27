// layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import GuardianSidebar from "../pages/Guardian/GuardianSidebar";
import GuardianHeader from "../pages/Guardian/GuardianHeader";

export const GuardianLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="w-full h-full bg-[#EDEDED] flex gap-4">
      <div className="hidden lg:block">
        <GuardianSidebar />
      </div>
      <div className="flex-1 min-w-0">
        {" "}
        {/* Added min-w-0 for flex shrinking */}
        <div className="lg:ml-44 my-24 px-4 lg:px-4">
          <div>
            <GuardianHeader />
          </div>
          {" "}
          {/* Added px-4 for mobile */}
          <div className="w-full overflow-x-auto">
            {" "}
            {/* Added table container */}
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  );
};
