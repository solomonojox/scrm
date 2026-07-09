// StudentCbtSidebar.tsx

import React from "react";
import Icon from "../../../components/Cbt/student/UI/Icon";
import { Page } from "../../../Types/Cbt/student";
import { NavLink } from "react-router";
import imageAssets from "../../../assets/imageAssets";
import { useAuth } from "../../../Context/Auth/useAuth";

interface StudentCbtSidebarProps {
  collapsed: boolean;
  setCollapsed: (fn: (c: boolean) => boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (fn: (o: boolean) => boolean) => void;
}

const navItems: { id: Page; label: string; path: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", path: "/cbt/student/dashboard", icon: "dashboard" },
  { id: "exams", label: "Take Exam", path: "/cbt/student/exams", icon: "exam" },
  { id: "results", label: "Results", path: "/cbt/student/results", icon: "results" },
  {
    id: "performance",
    label: "Performance",
    path: "/cbt/student/performance",
    icon: "performance",
  },
  { id: "settings", label: "Settings", path: "/cbt/student/settings", icon: "settings" },
];

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "S";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

// Helper function to get a consistent color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    "from-orange-400 to-orange-600",
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-indigo-400 to-indigo-600",
    "from-red-400 to-red-600",
    "from-teal-400 to-teal-600",
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

interface SideContentProps {
  collapsed: boolean;
  setMobileOpen: (fn: (o: boolean) => boolean) => void;
}

const SideContent: React.FC<SideContentProps> = ({ collapsed, setMobileOpen }) => {
  const { cbtUser } = useAuth();

  // Get user details with fallbacks
  const userName =  "Student";
  const userInitials = getInitials(userName);
  const avatarColor = getAvatarColor(userName);
  const userDept = "Student";
  const userEmail = cbtUser?.email || "";

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className={`flex items-center px-4 py-5 border-b border-orange-100/60 ${
          collapsed ? "justify-center" : "justify-start"
        }`}
      >
        <div className="flex flex-col items-center md:items-start">
          <img
            src={imageAssets.logo}
            alt="EduCat logo"
            width={collapsed ? 48 : 96}
            height={collapsed ? 22 : 44}
            className="block"
          />
          {!collapsed && (
            <p className="mt-1 text-xs text-gray-500">Computer Based Testing System</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={() => setMobileOpen(() => false)}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <Icon name={item.icon} size={18} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className={`p-3 border-t border-gray-100 ${collapsed ? "flex justify-center" : ""}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div
              className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}
            >
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-400 truncate">{userDept}</p>
            </div>
          </div>
        ) : (
          <div
            className={`w-9 h-9 rounded-full bg-linear-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold cursor-pointer`}
            title={userName}
          >
            {userInitials}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentCbtSidebar: React.FC<StudentCbtSidebarProps> = ({
  collapsed,
  mobileOpen,
  setMobileOpen,
}) => (
  <>
    {/* Desktop sidebar */}
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 shrink-0 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <SideContent collapsed={collapsed} setMobileOpen={setMobileOpen} />
    </aside>

    {/* Mobile drawer */}
    {mobileOpen && (
      <div className="md:hidden fixed inset-0 z-40 flex">
        <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(() => false)} />
        <aside className="relative w-64 bg-white h-full shadow-xl z-50">
          <SideContent collapsed={false} setMobileOpen={setMobileOpen} />
        </aside>
      </div>
    )}
  </>
);

export default StudentCbtSidebar;