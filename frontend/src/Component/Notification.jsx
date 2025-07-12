import React, { useState } from 'react';
import Sidebar from './Sidebar';          
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faEnvelope,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* tiny bell shake */}
      <style>{`
        @keyframes shake {0%,100%{transform:rotate(0)}25%{transform:rotate(-15deg)}75%{transform:rotate(15deg)}}
        .animate-shake{animation:shake .6s infinite;transform-origin:top center}
      `}</style>

      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          close={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4
                          px-4 py-2 bg-white rounded-xl border shadow-lg
                          mx-2 md:mx-auto mt-5
                          max-w-7xl w-full md:w-[99%]">
            {/* hamburger */}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2">
              <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>

            <input
              placeholder="Search..."
              className="flex-1 md:w-1/3 px-3 py-1 border rounded-full outline-none"
            />

            <div className="flex items-center space-x-4">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <FontAwesomeIcon icon={faEnvelope} className="text-xl" />

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">Gold Academy</span>
                  <span className="text-xs text-gray-500">Welcome back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification section */}
          <div className="flex flex-1 items-center justify-center p-4">
            <div className="text-center">
              <div className="bg-orange-500 p-10 rounded-full inline-block">
                <FontAwesomeIcon icon={faBell} className="text-white text-5xl animate-shake" />
              </div>
              <p className="mt-6 text-gray-600 text-lg">
                Your notifications will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
