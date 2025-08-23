import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";
import imageAssets from "../../assets/imageAssets.js";

interface NavItem {
  id: string;
  iconClass: string;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", iconClass: "fas fa-th-large", path: "/guardian/dashboard", label: "Dashboard" },
  { id: "profile", iconClass: "fas fa-user", path: "/guardian/profile", label: "Profile" },
  { id: "mypupils", iconClass: "fas fa-users", path: "/guardian/pupils", label: "My Pupils" },
  { id: "assignments", iconClass: "fas fa-book", path: "/guardian/assignments", label: "Assignments" },
  { id: "news", iconClass: "fas fa-newspaper", path: "/guardian/news", label: "News" },
  { id: "events", iconClass: "fas fa-calendar-alt", path: "/guardian/events", label: "Events" },
  { id: "loans", iconClass: "fas fa-coins", path: "/guardian/loans", label: "Loans" },
  { id: "results", iconClass: "fas fa-chart-bar", path: "/guardian/result", label: "Results" },
];

type GuardianSidebarProps = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
};

const GuardianSidebar: React.FC<GuardianSidebarProps> = ({isExpanded, setIsExpanded}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  // const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("scrmToken");
      logout();
      navigate("/login");
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 bg-[#EE7306] rounded-r-[30px] transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Icon Column */}
      <div className="absolute left-0 top-0 h-full w-16 bg-[#FFA50080] rounded-r-3xl flex flex-col items-center pt-24 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            aria-label={item.label}
            className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
              isActivePath(item.path) ? "bg-white/20" : "hover:bg-white/10"
            }`}
            title={item.label}
          >
            <i className={`${item.iconClass} text-white text-sm`} />
          </Link>
        ))}
      </div>

      {/* Content Column */}
      <div className="flex flex-col h-full py-6 pl-16">
        {/* Logo */}
        <div className="px-4 mb-6">
          <img src={imageAssets.logo} alt="Logo" className="w-24" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-full transition-colors text-sm font-medium ${
                  isActivePath(item.path)
                    ? "bg-[#EDEDED] text-[#F07A00]"
                    : "text-white hover:bg-white/10"
                } ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-colors text-sm font-medium text-white hover:bg-white/10 ${
                isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <i className="fas fa-sign-out-alt text-sm" />
              Log Out
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default GuardianSidebar;