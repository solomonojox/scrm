import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth";

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
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    localStorage.removeItem("scrmToken");
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-[100vh] bg-orange-500 fixed z-30 rounded-r-[30px]">
        
    </div>
  );
};

export default GuardianSidebar;
