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

<<<<<<< Updated upstream
=======
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
        <div className="my-24 w-full overflow-x-auto">
          <Outlet />
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
};
