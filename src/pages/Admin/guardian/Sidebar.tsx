// Sidebar.tsx
import React, { useState } from "react";
import imageAssets from "../../../assets/imageAssets.js";

type NavItem = { id: string; iconClass: string; label: string };

const items: NavItem[] = [
  { id: "dashboard", iconClass: "fas fa-th-large", label: "Dashboard" },
  { id: "profile", iconClass: "fas fa-user", label: "Profile" },
  { id: "mypupils", iconClass: "fas fa-users", label: "My Pupils" },
  { id: "assignments", iconClass: "fas fa-book", label: "Assignments" },
  { id: "news", iconClass: "fas fa-newspaper", label: "News" },
  { id: "events", iconClass: "fas fa-calendar-alt", label: "Events" },
  { id: "loans", iconClass: "fas fa-coins", label: "Loans" },
  { id: "results", iconClass: "fas fa-chart-bar", label: "Results" },
];

const Sidebar = () => {
  const [active, setActive] = useState<string>("dashboard");

  return (
    <aside className="relative min-h-screen w-20 sm:w-72 rounded-r-3xl overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFB347] rounded-r-3xl z-20">
        <div className="flex flex-col items-center mt-[88px] space-y-5.5  ">
          {items.map((it) => (
            <button
              key={it.id}
              aria-label={it.label}
              onClick={() => setActive(it.id)}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md focus:outline-none"
              title={it.label}
            >
              <i className={`${it.iconClass} text-white text-[11px] sm:text-sm`} />
            </button>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-[#F07A00] w-[250px] rounded-xl z-10">
        <div
          className="absolute top-0 right-0 -translate-y-1/6 h-36  w-40 sm:w-60 rounded-br-[56px]"
          style={{ background: "#F07A00", zIndex: 11 }}
        />
        <div className="relative z-20 flex flex-col ml-5 justify-between h-full py-6">
          <div>
            <div className="px-2 sm:px-4 mb-6">
              <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
                <img src={imageAssets.logo} alt="logo" className="w-full" />
              </div>
            </div>
            <nav className="flex flex-col gap-2 sm:gap-3 px-1 sm:px-2">
              {items.map((it) => {
                const isActive = active === it.id;
                return (
                  <div key={it.id} className="flex items-center">
                    <button
                      onClick={() => setActive(it.id)}
                      className={`w-full text-left rounded-r-2xl transition-colors focus:outline-none  ${
                        isActive ? "bg-[#EDEDED] text-[#F07A00]" : "bg-transparent text-white"
                      }`}
                      style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
                    >
                      <span className="text-sm sm:text-base font-medium">{it.label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="px-2 sm:px-4 pb-6">
            <button
              onClick={() => alert("Logging out...")}
              className="w-full flex items-center gap-3 rounded-xl focus:outline-none"
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
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
