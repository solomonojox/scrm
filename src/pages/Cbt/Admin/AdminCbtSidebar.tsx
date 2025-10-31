import {
  BarChart3,
  BookAudio,
  FileText,
  LayoutDashboardIcon,
  Settings,
  ShieldUserIcon,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const AdminCbtSidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const userRole = "student"; // or "admin", "teacher"

  const menuByRole = {
    student: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/student/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      {
        id: "subject",
        label: "My Subjects",
        link: "/cbt/student/subject",
        icon: <BarChart3 />,
      },
      {
        id: "exams",
        label: "My Exams",
        link: "/cbt/student/exams",
        icon: <BookAudio />,
      },
    ],

    teacher: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/teacher/dashboard",
        icon: <LayoutDashboardIcon />,
      },
      {
        id: "questions",
        label: "Manage Questions",
        link: "/cbt/teacher/questions",
        icon: <FileText />,
      },
    ],

    admin: [
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
      {
        id: "settings",
        label: "Settings",
        link: "/cbt/admin/settings",
        icon: <Settings />,
      },
    ],
  };

  // Select the menu for that role
  const tabs = menuByRole[userRole] || [];

  return (
    <div className="fixed left-0 z-20 shadow-lg bg-white">
      <div
        className={` inset-y-0 left-0 w-64 lg:h-[calc(100vh-3.5rem)] bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:shadow-none`}
      >
        <div className="px-6">
          <ul className="mt-24 lg:mt-6 space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`${tab.link}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center p-2 rounded-md hover:bg-orange-100 ${
                  activeTab === tab.id ? "bg-orange-50 text-gray-600" : ""
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminCbtSidebar;
