import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";
import imageAssets from "../../assets/imageAssets.js";

type NavItem = { id: string; iconClass: string; label: string; path: string };

const items: NavItem[] = [
  {
    id: "dashboard",
    iconClass: "fas fa-th-large",
    path: "/guardian/dashboard",
    label: "Dashboard",
  },
  { id: "profile", iconClass: "fas fa-user", path: "/guardian/profile", label: "Profile" },
  { id: "mypupils", iconClass: "fas fa-users", path: "/guardian/pupils", label: "My Pupils" },
  {
    id: "assignments",
    iconClass: "fas fa-book",
    path: "/guardian/assignments",
    label: "Assignments",
  },
  { id: "news", iconClass: "fas fa-newspaper", path: "/guardian/news", label: "News" },
  { id: "events", iconClass: "fas fa-calendar-alt", path: "/guardian/events", label: "Events" },
  { id: "loans", iconClass: "fas fa-coins", path: "/guardian/loans", label: "Loans" },
  { id: "results", iconClass: "fas fa-chart-bar", path: "/guardian/result", label: "Results" },
];

const GuardianSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    window.alert("Did you want to Logout?");
    localStorage.removeItem("scrmToken");
    logout();
    navigate("/login");
  };

  // Helper function to check if path is active
  const isActivePath = (itemPath: string) => {
    return currentPath === itemPath;
  };

  return (
    <aside className="w-56 h-[100vh] bg-[#EE7306] fixed z-30 rounded-r-[30px]">
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFA50080] rounded-r-3xl z-20">
        <div className="flex flex-col items-center mt-[85px] space-y-5.5">
          {items.map((it) => {
            const isActive = isActivePath(it.path);
            return (
              <Link
                key={it.id}
                to={it.path}
                aria-label={it.label}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md focus:outline-none ${
                  isActive ? "bg-white/20" : ""
                }`}
                title={it.label}
              >
                <i className={`${it.iconClass} text-white text-[11px] sm:text-sm`} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="z-10">
        <div className="relative z-20 flex flex-col ml-5 rounded-full justify-between h-full py-6">
          <div>
            <div className="px-2 sm:px-4 mb-6">
              <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
                <img src={imageAssets.logo} alt="logo" className="w-full" />
              </div>
            </div>
          </div>

          <div className="h-[80vh] pt-4 overflow-y-scroll overflow-x-hidden z-0 [&::-webkit-scrollbar]:hidden">
            <nav className="flex flex-col space-y-3 sm:gap-3 px-1 sm:px-2">
              {items.map((it) => {
                const isActive = isActivePath(it.path);
                return (
                  <div key={it.id} className="flex items-center ml-[4px] w-[218px]">
                    <Link
                      to={it.path}
                      className={`w-full text-left px-4 py-2 transition-colors focus:outline-none rounded-full ${
                        isActive
                          ? "bg-[#EDEDED] text-[#F07A00]"
                          : "bg-transparent text-white hover:bg-white/10"
                      }`}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <span className="text-sm sm:text-base font-medium">{it.label}</span>
                    </Link>
                  </div>
                );
              })}

              <div className="px-2 sm:px-4 py-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 rounded-xl focus:outline-none hover:bg-white/10 transition-colors"
                >
                  <div
                    className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md"
                    aria-hidden
                  >
                    <i className="fas fa-sign-out-alt text-white text-[11px] sm:text-sm" />
                  </div>
                  <div
                    className="hidden sm:block w-full text-left rounded-r-2xl"
                    style={{ padding: "0.5rem 1rem", background: "transparent", color: "white" }}
                  >
                    <span className="text-sm sm:text-base font-medium">Log Out</span>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default GuardianSidebar;
