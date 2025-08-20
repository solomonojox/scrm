import React from "react";
import { useNavigate, useLocation } from "react-router-dom";  // ✅ add useLocation
import imageAssets from "../../../assets/imageAssets.js";

type NavItem = { id: string; iconClass: string; label: string; path: string };

const items: NavItem[] = [
  { id: "dashboard", iconClass: "fas fa-th-large", label: "Dashboard", path: "/guardian/dashboard" },
  { id: "profile", iconClass: "fas fa-user", label: "Profile", path: "/guardian/profile" },
  { id: "mypupils", iconClass: "fas fa-users", label: "My Pupils", path: "/mypupils" },
  { id: "assignments", iconClass: "fas fa-book", label: "Assignments", path: "/assignments" },
  { id: "news", iconClass: "fas fa-newspaper", label: "News", path: "/guardian/news" },
  { id: "events", iconClass: "fas fa-calendar-alt", label: "Events", path: "/events" },
  { id: "loans", iconClass: "fas fa-coins", label: "Loans", path: "/loans" },
  { id: "results", iconClass: "fas fa-chart-bar", label: "Results", path: "/results" },
];


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();   // ✅ get current path

  // determine active item by matching current path
  const activeItem = items.find((it) => location.pathname.startsWith(it.path))?.id ?? "dashboard";

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="relative min-h-screen w-16 sm:w-72 rounded-r-3xl overflow-hidden">
      {/* Icons bar */}
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFB347] rounded-r-3xl z-20">
        <div className="flex flex-col items-center mt-[89px] space-y-5.5">
          {items.map((it) => (
            <button
              key={it.id}
              aria-label={it.label}
              onClick={() => handleNavigate(it.path)}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md focus:outline-none"
              title={it.label}
            >
              <i className={`${it.iconClass} text-white text-[11px] sm:text-sm`} />
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar body */}
      <div className="absolute inset-0 bg-[#F07A00] w-[250px] rounded-2xl z-10">
        <div
          className="absolute top-0 right-0 -translate-y-1/6 h-28  w-40 sm:w-60 rounded-t-full rounded-br-full"
          style={{ background: "#F07A00", zIndex: 11 }}
        />
        <div className="relative z-20 flex flex-col ml-5 h-full py-6 justify-between">
          <div>
            {/* Logo */}
            <div className="px-2 sm:px-4 mb-6">
              <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
                <img src={imageAssets.logo} alt="logo" className="w-full" />
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col space-y-3 sm:gap-3 px-1 sm:px-2">
              {items.map((it) => {
                const isActive = activeItem === it.id;
                return (
                  <div key={it.id} className="flex items-center ml-[4px] w-[218px]">
                    <button
                      onClick={() => handleNavigate(it.path)}
                      className={`w-full text-left px-4 py-[3px] transition-colors focus:outline-none ${
                        isActive ? "bg-[#EDEDED] text-[#F07A00]" : "bg-transparent text-white"
                      }`}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <span className="text-sm sm:text-base font-medium">{it.label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Logout */}
          <div className="px-2 sm:px-4 pb-6">
            <button
              onClick={() => alert("Logging out...")}
              className="w-full flex items-center gap-3 rounded-xl focus:outline-none"
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md">
                <i className="fas fa-sign-out-alt text-white text-[11px] sm:text-sm" />
              </div>
              <div
                className="hidden sm:block w-full text-left"
                style={{ padding: "0.5rem 1rem", background: "transparent", color: "white" }}
              >
                <span className="text-sm sm:text-base font-medium">Log Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
