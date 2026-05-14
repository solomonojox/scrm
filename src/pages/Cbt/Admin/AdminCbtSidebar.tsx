import {
  BarChart3,
  BookAudio,
  FileText,
  LayoutDashboardIcon,
  Settings,
  ShieldUserIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/Auth/useAuth";
import { use, useEffect } from "react";

type Role = "Student" | "Teacher" | "SchoolAdmin";

interface MenuItem {
  id: string;
  label: string;
  link: string;
  icon: React.ReactNode;
}

const AdminCbtSidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const location = useLocation();
  const { cbtUser } = useAuth();

  useEffect(() => {
    
  }, [cbtUser]);

  const menuByRole: Record<Role, MenuItem[]> = {
    Student: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/student/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      { id: "subject", label: "My Subjects", link: "/cbt/student/subject", icon: <BarChart3 /> },
      { id: "exams", label: "My Exams", link: "/cbt/student/exams", icon: <BookAudio /> },
    ],

    Teacher: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/teacher/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      { id: "subject", label: "Subject", link: "/cbt/teacher/subject", icon: <BookAudio /> },
      {
        id: "questions",
        label: "Manage Questions",
        link: "/cbt/teacher/exams",
        icon: <FileText />,
      },
    ],

    SchoolAdmin: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/admin/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      {
        id: "userManagement",
        label: "User Management",
        link: "/cbt/admin/userManagement",
        icon: <ShieldUserIcon />,
      },
      { id: "settings", label: "Settings", link: "/cbt/admin/settings", icon: <Settings /> },
    ],
  };

  const tabs = menuByRole[cbtUser?.role as Role] || [];

  return (
    <div className="hidden lg:block fixed left-0 z-20 shadow-lg bg-white">
      <div
        className={` fixed left-0 z-20 inset-y-0 w-64 lg:h-[calc(100vh-3.5rem)] bg-white shadow-lg transform  ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none`}
      >
        <div className="px-6">
          <ul className="mt-24 lg:mt-6 space-y-2">
            {tabs.map((tab: any) => {
              const isActive = location.pathname === tab.link; //

              return (
                <Link
                  key={tab.id}
                  to={tab.link}
                  className={`flex items-center p-2 rounded-md hover:bg-orange-100 ${
                    isActive ? "bg-orange-50 text-gray-600 text-md" : "text-sm"
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                </Link>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCbtSidebar;
