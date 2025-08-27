// GuardianSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth.js";
import imageAssets from "../../assets/imageAssets.js";

const items = [
  { id: "dashboard", iconClass: "fas fa-th-large", label: "Dashboard", path: "/guardian/dashboard" },
  { id: "profile", iconClass: "fas fa-user", label: "Profile", path: "/guardian/profile" },
  { id: "mypupils", iconClass: "fas fa-users", label: "My Pupils", path: "/guardian/pupils" },
  { id: "assignments", iconClass: "fas fa-book", label: "Assignments", path: "/guardian/assignments" },
  { id: "news", iconClass: "fas fa-newspaper", label: "News", path: "/guardian/news" },
  { id: "events", iconClass: "fas fa-calendar-alt", label: "Events", path: "/guardian/events" },
  { id: "loans", iconClass: "fas fa-coins", label: "Loans", path: "/guardian/loans" },
  { id: "results", iconClass: "fas fa-chart-bar", label: "Results", path: "/guardian/result" },
];

const GuardianSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth?.();

  const isActivePath = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      if (auth && typeof auth.logout === "function") await auth.logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
    navigate("/login");
  };

  return (
    <aside className="w-48 h-[100vh] bg-[#EE7306] fixed z-30 rounded-r-[30px]">
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFA50080] rounded-r-3xl z-20">
        <div className="flex flex-col items-center mt-[110px] space-y-[16px]">
          {items.map((it) => {
            const isActive = isActivePath(it.path);
            return (
              <Link
                key={it.id}
                to={it.path}
                aria-label={it.label}
                className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md focus:outline-none ${isActive ? "bg-white/20" : ""
                  }`}
                title={it.label}
              >
                <i className={`${it.iconClass} text-white text-[11px] sm:text-sm`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* <div
          className="absolute top-0 right-0 -translate-y-1/6 h-28 w-40 sm:w-60 rounded-t-full rounded-br-full"
          style={{ background: "#F07A00", zIndex: 11 }}
        /> */}
      {/* <div className="absolute inset-0 bg-[#F07A00] w-[250px] rounded-3xl z-10">

      </div> */}
      <div className="relative z-20 flex flex-col ml-5 h-full py-6 justify-between">
        <div>

          <div className="px-2 sm:px-4 mb-6">
            <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
              <img src={imageAssets?.logo || ""} alt="logo" className="w-full" />
            </div>
          </div>


          <div className="flex-1 pt-4 overflow-y-auto overflow-x-hidden z-0 [&::-webkit-scrollbar]:hidden">
            <nav className="flex flex-col sm:gap-3 px-1 sm:px-2 space-y-1">
              {items.map((it) => {
                const isActive = isActivePath(it.path);
                return (
                  <div key={it.id} className="flex items-center ml-[4px] w-[218px]">
                    <Link
                      to={it.path}
                      className={`w-full text-left px-4 py-1 transition-colors focus:outline-none rounded-full ${isActive ? "bg-[#EDEDED] text-[#F07A00]" : "bg-transparent text-white hover:bg-white/10"
                        }`}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <span className="text-sm sm:text-base font-medium">{it.label}</span>
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>


        <div className="px-2 sm:px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl focus:outline-none hover:bg-white/10 transition-colors px-3 py-2"
          >
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md" aria-hidden>
              <i className="fas fa-sign-out-alt text-white text-[11px] sm:text-sm" />
            </div>
            <div className="hidden sm:block w-full text-left rounded-r-2xl" style={{ color: "white" }}>
              <span className="text-sm sm:text-base font-medium">Log Out</span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default GuardianSidebar;
