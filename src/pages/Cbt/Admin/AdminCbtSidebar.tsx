// AdminCbtSidebar.tsx
import React, { useState } from "react";
import {
  BarChart3,
  BookAudio,
  FileText,
  LayoutDashboardIcon,
  Settings,
  ShieldUserIcon,
  ChevronRight,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  LogOut,
  X,
  Home,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/Auth/useAuth";
import { Icons } from "../../../assets/icons/Icon";

type Role = "Student" | "Teacher" | "SchoolAdmin" | "Examiner";

interface MenuItem {
  id: string;
  label: string;
  link: string;
  icon: React.ReactNode;
  subItems?: MenuItem[];
}

interface AdminCbtSidebarProps {
  isSidebarOpen: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

const AdminCbtSidebar: React.FC<AdminCbtSidebarProps> = ({ isSidebarOpen, onClose, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cbtUser, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("cbtToken");
    logout();
    navigate("/cbt/login");
    onClose?.();
  };

  const menuByRole: Record<Role, MenuItem[]> = {
    Student: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/student/dashboard",
        icon: <LayoutDashboardIcon size={20} />,
      },
      {
        id: "subjects",
        label: "My Subjects",
        link: "/cbt/student/subject",
        icon: <BookOpen size={20} />,
      },
      {
        id: "exams",
        label: "My Exams",
        link: "/cbt/student/exams",
        icon: <BookAudio size={20} />,
      },
      {
        id: "results",
        label: "Results",
        link: "/cbt/student/results",
        icon: <Award size={20} />,
      },
    ],

    Examiner: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/examiner/dashboard",
        icon: <LayoutDashboardIcon size={20} />,
      },
      // {
      //   id: "subjects",
      //   label: "My Subjects",
      //   link: "/cbt/examiner/subject",
      //   icon: <BookOpen size={20} />,
      // },
      {
        id: "examinations",
        label: "Examinations",
        link: "/cbt/examiner/examinations",
        icon: <Icons.Exam />,
      },
      // {
      //   id: "results",
      //   label: "Results",
      //   link: "/cbt/examiner/results",
      //   icon: <Award size={20} />,
      // },
    ],

    Teacher: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/teacher/dashboard",
        icon: <LayoutDashboardIcon size={20} />,
      },
      {
        id: "subjects",
        label: "My Subjects",
        link: "/cbt/teacher/subject",
        icon: <BookOpen size={20} />,
      },
      {
        id: "questions",
        label: "Manage Questions",
        link: "/cbt/teacher/exams",
        icon: <FileText size={20} />,
        subItems: [
          { id: "all-questions", label: "All Questions", link: "/cbt/teacher/questions", icon: <FileText size={18} /> },
          { id: "create-question", label: "Create Question", link: "/cbt/teacher/questions/create", icon: <FileText size={18} /> },
        ]
      },
      {
        id: "students",
        label: "My Students",
        link: "/cbt/teacher/students",
        icon: <GraduationCap size={20} />,
      },
    ],

    SchoolAdmin: [
      {
        id: "dashboard",
        label: "Dashboard",
        link: "/cbt/admin/dashboard",
        icon: <LayoutDashboardIcon size={20} />,
      },
      {
        id: "examinations",
        label: "Examinations",
        link: "/cbt/admin/examinations",
        icon: <Icons.Exam />,
      },
      {
        id: "examiners",
        label: "Examiners",
        link: "/cbt/admin/examiners",
        icon: <Icons.Examiner />,
      },
      {
        id: "teachers",
        label: "Teachers",
        link: "/cbt/admin/teachers",
        icon: <Icons.Teachers />,
      },
      {
        id: "students",
        label: "Students",
        link: "/cbt/admin/students",
        icon: <Icons.Students />,
      },
      {
        id: "settings",
        label: "Settings",
        link: "/cbt/admin/settings",
        icon: <Settings size={20} />,
        subItems: [
          { id: "general", label: "General", link: "/cbt/admin/settings/general", icon: <Settings size={18} /> },
          { id: "security", label: "Security", link: "/cbt/admin/settings/security", icon: <ShieldUserIcon size={18} /> },
        ]
      },
    ],
  };

  const tabs = menuByRole[cbtUser?.role as Role] || [];

  const isActiveLink = (link: string) => {
    return location.pathname === link || location.pathname.startsWith(link + '/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-20 flex-col transition-all duration-300 ${isSidebarOpen ? 'w-56 mt-3' : 'w-20 mt-20'}`}>

        {/* Toggle Button Header - No Logo */}
        <div className={`h-16 flex items-center ${isSidebarOpen ? 'px-4 justify-end' : 'justify-center'} border-b border-gray-200`}>
          {isSidebarOpen ? (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={20} />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
              title="Expand sidebar"
            >
              <PanelLeftOpen size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {tabs.map((tab) => {
              const isActive = isActiveLink(tab.link);
              const hasSubItems = tab.subItems && tab.subItems.length > 0;
              const isExpanded = expandedMenus.includes(tab.id);

              return (
                <div key={tab.id}>
                  <Link
                    to={hasSubItems ? '#' : tab.link}
                    onClick={(e) => {
                      if (hasSubItems) {
                        e.preventDefault();
                        toggleSubmenu(tab.id);
                      } else {
                        onClose?.();
                      }
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    } ${!isSidebarOpen && 'justify-center'}`}
                    title={!isSidebarOpen ? tab.label : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-500'}`}>
                        {tab.icon}
                      </span>
                      {isSidebarOpen && <span className="text-sm font-medium">{tab.label}</span>}
                    </div>
                    {isSidebarOpen && hasSubItems && (
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Submenu Items */}
                  {isSidebarOpen && hasSubItems && isExpanded && (
                    <div className="ml-9 mt-1 space-y-1">
                      {tab.subItems?.map((subItem) => (
                        <Link
                          key={subItem.id}
                          to={subItem.link}
                          onClick={() => onClose?.()}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            location.pathname === subItem.link
                              ? 'bg-orange-50 text-orange-600'
                              : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          <span className="text-gray-400">{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${isSidebarOpen ? 'justify-start space-x-3' : 'justify-center'} px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 group`}
            title={!isSidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={20} className="group-hover:text-red-600" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50 bg-opacity-50" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl z-50 animate-slideInRight">
            {/* Mobile Header with Close Button */}
            <div className="flex items-center justify-end p-4 border-b border-gray-200">
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {tabs.map((tab) => {
                  const isActive = isActiveLink(tab.link);
                  const hasSubItems = tab.subItems && tab.subItems.length > 0;
                  const isExpanded = expandedMenus.includes(tab.id);

                  return (
                    <div key={tab.id}>
                      <Link
                        to={hasSubItems ? '#' : tab.link}
                        onClick={(e) => {
                          if (hasSubItems) {
                            e.preventDefault();
                            toggleSubmenu(tab.id);
                          } else {
                            onClose?.();
                          }
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-orange-50 text-orange-600'
                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span>{tab.icon}</span>
                          <span className="text-sm font-medium">{tab.label}</span>
                        </div>
                        {hasSubItems && (
                          <ChevronRight
                            size={16}
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        )}
                      </Link>

                      {hasSubItems && isExpanded && (
                        <div className="ml-9 mt-1 space-y-1">
                          {tab.subItems?.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.link}
                              onClick={() => onClose?.()}
                              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm ${
                                location.pathname === subItem.link
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                            >
                              <span>{subItem.icon}</span>
                              <span>{subItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-gray-200 p-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-start space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default AdminCbtSidebar;
