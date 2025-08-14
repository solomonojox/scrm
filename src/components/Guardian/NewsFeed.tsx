import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBars, FaTimes, FaHome, FaCalendarAlt, FaBook, FaInfoCircle, FaMoneyBill, FaFileAlt, FaFootballBall } from "react-icons/fa";
import React, { useState } from "react";

export default function Highlights() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const article = location.state?.article;

  const navItems = [
    { label: "Home", icon: <FaHome /> },
    { label: "Events", icon: <FaCalendarAlt /> },
    { label: "Academics", icon: <FaBook /> },
    { label: "General", icon: <FaInfoCircle /> },
    { label: "Fees", icon: <FaMoneyBill /> },
    { label: "Examination", icon: <FaFileAlt /> },
    { label: "Sports", icon: <FaFootballBall /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-300 p-4 w-64 fixed md:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-50`}>
        <h2 className="font-bold text-lg mb-6">Menu</h2>
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:ml-0">
        {/* Mobile menu button */}
        <button
          className="md:hidden mb-4 text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="max-w-5xl mx-auto">
          <h1 className="font-bold text-base mb-3">Highlights</h1>

          <button
            aria-label="Back"
            className="mb-3 text-gray-700 hover:text-gray-900"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>

          {/* Article */}
          {article ? (
            <article className="bg-white mt-4 p-4 text-sm text-gray-900">
              <h2 className="text-orange-500 font-semibold text-center text-base mb-1">
                {article.title}
              </h2>
              <h3 className="text-center font-normal mb-3">
                Category: {article.category}
              </h3>

              <section className="border border-gray-300 grid grid-cols-3 text-xs text-gray-900 mb-4">
                <div className="border-r border-gray-300 px-3 py-1">
                  Date: {article.datePosted}
                </div>
                <div className="border-r border-gray-300 px-3 py-1 text-center">
                  Time: {article.time}
                </div>
                <div className="px-3 py-1 font-semibold text-right">
                  Author: Gold Academy
                </div>
              </section>

              <p>
                {/* You can replace this with actual description from API later */}
                This is a placeholder article body for "{article.title}". 
                More details will be dynamically loaded from API in the future.
              </p>
            </article>
          ) : (
            <p>No article data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
