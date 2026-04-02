import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { student } from "../../../constants/StudentCbtConstant";
import Icon from "../../../components/Cbt/student/UI/Icon";

interface StudentCbtTopNavProps {
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const pageNames: Record<string, string> = {
  "/student/dashboard": "Dashboard",
  "/student/exams": "Available Exams",
  "/student/results": "My Results",
  "/student/performance": "Performance Analytics",
  "/student/practice": "Practice Tests",
  "/student/notifications": "Notifications",
  "/student/settings": "Profile Settings",
};

const StudentCbtTopNav: React.FC<StudentCbtTopNavProps> = ({
  setCollapsed,
  setMobileOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  const title =
    pageNames[location.pathname] ?? "Student Portal";

    const handleOpenProfileMenu = () => {
     // Implement profile menu logic here (e.g., open a dropdown with options like logouts and settings)
        setProfileMenuOpen((open) => !open);
    }

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between shrink-0 z-10">
      <div className="flex items-center gap-3">

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-orange-500"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <Icon name="menu" size={20} />
        </button>

        {/* Desktop collapse */}
        <button
          className="hidden md:block p-2 rounded-lg hover:bg-gray-100 text-orange-500"
          onClick={() => setCollapsed((c) => !c)}
        >
          <Icon name="menu" size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {title}
          </h1>

          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">

        {/* Notifications */}
        {/* <button
          className="relative p-2 rounded-xl hover:bg-orange-50 text-orange-500 hover:text-orange-500 transition-colors"
          onClick={() => navigate("/student/notifications")}
        >
          <Icon name="bell" size={20} />

          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button> */}

        {/* Profile */}
        <button
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-orange-50 transition-colors"
          onClick={handleOpenProfileMenu}
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
            {student.avatar}
          </div>

          <span className="text-sm font-semibold text-gray-800 hidden sm:block">
            {student.name.split(" ")[0]}
          </span>
        </button>

        {/* Profile Dropdown */}
        {profileMenuOpen && (
          <div className="absolute right-4 top-16 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-20">
            <button
              onClick={() => navigate("/cbt/student/settings")}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-orange-50 transition-colors"
            >
              <Icon name="settings" size={18} />
              <span className="text-sm font-semibold text-gray-800">
                Profile Settings
              </span>
            </button>
            <button
              onClick={() => navigate("/cbt/login")}
              className="flex items-center gap-2 px-4 py-2 w-full hover:bg-orange-50 transition-colors"
            >
              <Icon name="logout" size={18} />
              <span className="text-sm font-semibold text-gray-800">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default StudentCbtTopNav;