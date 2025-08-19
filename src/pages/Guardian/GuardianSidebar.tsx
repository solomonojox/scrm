import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";
import imageAssets from "../../assets/imageAssets.js";

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

// const SidebarButton = ({ icon, label, to }) => {
//   const location = useLocation();
//   const isActive = location.pathname === to;

//   return (
//     <Link
//       to={to}
//       className={`
//         flex items-center justify-between
//         py-3 px-4 rounded-lg w-full
//         transition-all duration-200
//         group
//         ${isActive
//           ? 'bg-orange-50 text-orange-600 font-medium shadow-sm'
//           : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
//           `}
//     >
//       <div className="flex items-center space-x-3">
//         <span className={`
//           text-lg
//           ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}
//         `}>
//           {icon}
//         </span>
//         <span className="text-sm">{label}</span>
//       </div>
//       <FiChevronRight className={`
//         text-xs opacity-0 transform -translate-x-1
//         ${isActive ? 'opacity-100 translate-x-0 text-orange-500' : 'group-hover:opacity-70 group-hover:translate-x-0'}
//         transition-all duration-200
//         `} />
//     </Link>
//   );
// };

const GuardianSidebar = () => {
  const [active, setActive] = useState<string>("dashboard");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    window.alert("Did you want to Logout?")
    localStorage.removeItem("scrmToken");
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-[100vh] bg-[#EE7306] fixed z-30 rounded-r-[30px]">
      <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFA50080] rounded-r-3xl z-20">
        <div className="flex flex-col items-center mt-[85px] space-y-5.5 ">
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
      <div className="z-10">
        {/* <div className="absolute top-0 right-0 -translate-y-1/6 " style={{ zIndex: 11 }} /> */}
        <div className="relative z-20 flex flex-col ml-5  rounded-full justify-between h-full py-6">
          <div>
            <div className="px-2 sm:px-4 mb-6">
              <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
                <img src={imageAssets.logo} alt="logo" className="w-full" />
              </div>
            </div>
          </div>

          <div className="h-[80vh] pt-4 overflow-y-scroll overflow-x-hidden z-0 [&::-webkit-scrollbar]:hidden">
            <nav className="flex flex-col space-y-3 sm:gap-3 px-1 sm:px-2 ">
              {items.map((it) => {
                const isActive = active === it.id;
                return (
                  <div key={it.id} className="flex items-center ml-[4px] w-[218px] ">
                    <button
                      onClick={() => setActive(it.id)}
                      className={`  w-full text-left px-4 py-2 transition-colors focus:outline-none  ${
                        isActive
                          ? "bg-[#EDEDED] rounded-full text-[#F07A00]"
                          : "bg-transparent text-white "
                      }`}
                      style={{ marginLeft: "0.5rem" }}
                    >
                      <span className="text-sm sm:text-base font-medium">{it.label}</span>
                    </button>
                  </div>
                );
              })}

              <div className="px-2 sm:px-4 py-6">
                <button
                  onClick={handleLogout}
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
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default GuardianSidebar;
