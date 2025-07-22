// components/SidebarButton.jsx
import React from 'react';

const SidebarButton = ({ icon, label, active }) => {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
        active ? 'bg-[#d87f0a] text-white' : 'text-gray-700 hover:bg-gray-100'
      } transition-colors`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
};

export default SidebarButton;
