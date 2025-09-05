// GuardianSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/Auth/useAuth.js";
import imageAssets from "../../assets/imageAssets.js";

interface GuardianSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const icons = {
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1955_2660)">
        <path
          d="M16.4999 -0.000106903C15.3106 -0.0133379 14.1346 0.250926 13.0652 0.771696C11.9959 1.29247 11.0628 2.0554 10.3399 2.99989C10.2493 3.1038 10.1812 3.22531 10.1398 3.35679C10.0985 3.48828 10.0847 3.62689 10.0995 3.76393C10.1142 3.90098 10.1572 4.03349 10.2256 4.15316C10.294 4.27283 10.3864 4.37706 10.497 4.45932C10.6076 4.54158 10.734 4.60008 10.8683 4.63116C11.0025 4.66224 11.1418 4.66523 11.2773 4.63993C11.4128 4.61463 11.5416 4.56159 11.6556 4.48415C11.7696 4.4067 11.8664 4.30652 11.9399 4.18989C12.4786 3.49678 13.1708 2.93821 13.9621 2.55817C14.7534 2.17814 15.6221 1.98703 16.4999 1.99989C17.8913 1.93735 19.2509 2.42817 20.2815 3.36509C21.3121 4.30201 21.9299 5.60882 21.9999 6.99989C21.9767 8.01923 21.6424 9.00711 21.0418 9.83108C20.4413 10.6551 19.6032 11.2757 18.6399 11.6099C18.5223 11.6526 18.4137 11.7171 18.3199 11.7999C18.1199 11.9899 16.2499 13.5799 15.9999 13.7999V12.9499C16.0023 12.7072 15.9163 12.472 15.7581 12.288C15.5999 12.104 15.3802 11.9839 15.1399 11.9499C14.8724 11.9146 14.6082 11.8578 14.3499 11.7799C14.2232 11.7438 14.0906 11.733 13.9597 11.7481C13.8288 11.7632 13.7021 11.804 13.587 11.8681C13.4718 11.9322 13.3704 12.0183 13.2886 12.1215C13.2067 12.2248 13.146 12.3432 13.1099 12.4699C13.0738 12.5966 13.063 12.7292 13.0781 12.8601C13.0932 12.991 13.134 13.1177 13.1981 13.2328C13.2621 13.3479 13.3483 13.4493 13.4515 13.5312C13.5548 13.6131 13.6732 13.6738 13.7999 13.7099L13.9999 13.7599V15.9999C14.0009 16.1973 14.0603 16.39 14.1706 16.5538C14.2809 16.7175 14.4373 16.8449 14.6199 16.9199C14.802 16.9965 15.0027 17.0174 15.1967 16.98C15.3907 16.9426 15.5693 16.8486 15.7099 16.7099C15.9699 16.4399 19.2499 13.6499 19.5299 13.3999C20.8263 12.8976 21.9438 12.0207 22.7399 10.8809C23.536 9.74104 23.9746 8.38997 23.9999 6.99989C23.9295 5.07849 23.1008 3.26321 21.6952 1.95133C20.2896 0.639438 18.4216 -0.0622243 16.4999 -0.000106903Z"
          fill="white"
        />
        <path
          d="M12.12 6.5C12.12 6.76522 12.2254 7.01957 12.4129 7.20711C12.6004 7.39464 12.8548 7.5 13.12 7.5C13.3852 7.5 13.6396 7.39464 13.8271 7.20711C14.0146 7.01957 14.12 6.76522 14.12 6.5C14.12 6.23478 14.0146 5.98043 13.8271 5.79289C13.6396 5.60536 13.3852 5.5 13.12 5.5C12.8548 5.5 12.6004 5.60536 12.4129 5.79289C12.2254 5.98043 12.12 6.23478 12.12 6.5ZM15.37 6.5C15.37 6.63132 15.3959 6.76136 15.4461 6.88268C15.4964 7.00401 15.57 7.11425 15.6629 7.20711C15.7558 7.29997 15.866 7.37362 15.9873 7.42388C16.1086 7.47413 16.2387 7.5 16.37 7.5C16.5013 7.5 16.6314 7.47413 16.7527 7.42388C16.874 7.37362 16.9842 7.29997 17.0771 7.20711C17.17 7.11425 17.2436 7.00401 17.2939 6.88268C17.3441 6.76136 17.37 6.63132 17.37 6.5C17.37 6.23478 17.2646 5.98043 17.0771 5.79289C16.8896 5.60536 16.6352 5.5 16.37 5.5C16.1048 5.5 15.8504 5.60536 15.6629 5.79289C15.4754 5.98043 15.37 6.23478 15.37 6.5ZM18.62 6.5C18.62 6.76522 18.7254 7.01957 18.9129 7.20711C19.1004 7.39464 19.3548 7.5 19.62 7.5C19.8852 7.5 20.1396 7.39464 20.3271 7.20711C20.5146 7.01957 20.62 6.76522 20.62 6.5C20.62 6.23478 20.5146 5.98043 20.3271 5.79289C20.1396 5.60536 19.8852 5.5 19.62 5.5C19.3548 5.5 19.1004 5.60536 18.9129 5.79289C18.7254 5.98043 18.62 6.23478 18.62 6.5ZM7.5 16C5.51088 16 3.60322 16.7902 2.1967 18.1967C0.790176 19.6032 0 21.5109 0 23.5C0 23.6326 0.0526784 23.7598 0.146447 23.8536C0.240215 23.9473 0.367392 24 0.5 24H14.5C14.6326 24 14.7598 23.9473 14.8536 23.8536C14.9473 23.7598 15 23.6326 15 23.5C15 21.5109 14.2098 19.6032 12.8033 18.1967C11.3968 16.7902 9.48912 16 7.5 16ZM2.75 10.75C2.75 12.0098 3.25045 13.218 4.14124 14.1088C5.03204 14.9996 6.24022 15.5 7.5 15.5C8.75978 15.5 9.96796 14.9996 10.8588 14.1088C11.7496 13.218 12.25 12.0098 12.25 10.75C12.25 9.49022 11.7496 8.28204 10.8588 7.39124C9.96796 6.50045 8.75978 6 7.5 6C6.24022 6 5.03204 6.50045 4.14124 7.39124C3.25045 8.28204 2.75 9.49022 2.75 10.75Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_1955_2660">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
};

const items = [
  {
    id: "dashboard",
    iconClass: "fas fa-th-large",
    label: "Dashboard",
    path: "/guardian/dashboard",
  },
  { id: "profile", iconClass: "fas fa-user", label: "Profile", path: "/guardian/profile" },
  { id: "mypupils", iconClass: "fas fa-users", label: "My Pupils", path: "/guardian/pupils" },
  {
    id: "assignments",
    iconClass: "fas fa-book",
    label: "Assignments",
    path: "/guardian/assignments",
  },
  { id: "news", iconClass: "fas fa-newspaper", label: "News", path: "/guardian/news" },
  { id: "events", iconClass: "fas fa-calendar-alt", label: "Events", path: "/guardian/events" },
  { id: "loans", iconClass: "fas fa-coins", label: "Loans", path: "/guardian/loans" },
  { id: "results", iconClass: "fas fa-chart-bar", label: "Results", path: "/guardian/result" },
  { id: "messaging", iconClass: icons.message, label: "Messaging", path: "/guardian/message" },
];

const GuardianSidebar: React.FC<GuardianSidebarProps> = ({ isOpen, onClose }) => {
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
    <>
      {/* Overlay for mobile/tablet */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
        w-56 h-[100vh] bg-[#EE7306] fixed top-0 left-0 z-60 rounded-r-[30px]
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-[-100%]"} 
        lg:translate-x-0
      `}
      >
        {/* Close button (mobile only) */}
        <button onClick={onClose} className="absolute top-4 right-4 lg:hidden text-white text-xl">
          <i className="fas fa-times"></i>
        </button>

        {/* left strip with icons */}
        <div className="absolute left-0 top-0 h-full w-6 sm:w-10 bg-[#FFA50080] rounded-r-3xl z-20">
          <div className="flex flex-col items-center mt-[110px] space-y-[16px]">
            {items.map((it) => {
              const isActive = isActivePath(it.path);
              return (
                <Link
                  key={it.id}
                  to={it.path}
                  aria-label={it.label}
                  onClick={onClose}
                  className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md focus:outline-none ${
                    isActive ? "bg-white/20" : ""
                  }`}
                  title={it.label}
                >
                  {it.path === "/guardian/message" ? (
                    icons.message
                  ) : (
                    <i className={`${it.iconClass} text-white text-[11px] sm:text-sm`} />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* content */}
        <div className="relative z-20 flex flex-col ml-5 h-full py-6 justify-between">
          {/* Logo */}
          <div className="px-2 sm:px-4 mb-6">
            <div className="w-[86px] sm:w-[100px] ml-0 sm:ml-4">
              <img src={imageAssets?.logo || ""} alt="logo" className="w-full" />
            </div>
          </div>

          {/* Nav */}
          <div className="flex-1 pt-4 overflow-y-auto overflow-x-hidden z-0 [&::-webkit-scrollbar]:hidden">
            <nav className="flex flex-col sm:gap-3 px-1 sm:px-2 space-y-1">
              {items.map((it) => {
                const isActive = isActivePath(it.path);
                return (
                  <div key={it.id} className="flex items-center ml-[4px] w-[218px]">
                    <Link
                      to={it.path}
                      onClick={onClose}
                      className={`w-full text-left px-4 py-1 transition-colors focus:outline-none rounded-full ${
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
            </nav>
          </div>

          {/* logout */}
          <div className="px-2 sm:px-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl focus:outline-none hover:bg-white/10 transition-colors px-3 py-2"
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-md">
                <i className="fas fa-sign-out-alt text-white text-[11px] sm:text-sm" />
              </div>
              <div className="hidden sm:block w-full text-left rounded-r-2xl text-white">
                <span className="text-sm sm:text-base font-medium">Log Out</span>
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default GuardianSidebar;
