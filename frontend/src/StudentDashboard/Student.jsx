import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h bg-slate-900 text-white p-6">
      {/* Navigation */}
      <nav className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold">ofsp_ce</h1>
          <div className="flex space-x-6">
            <span>Dashboard</span>
            <span>My Classes</span>
            <span className="border-b-2 border-white pb-1">Analytics</span>
            <span>Community</span>
            <span>Events</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-sm">R</span>
          </div>
        </div>
      </nav>

      {/* Welcome Section */}
      <div className="mb-16 mt-8">
        <h2 className="text-3xl font-medium mb-2">Welcome back, Royal</h2>
        <p className="text-slate-400">Track, manage and forecast your platform's performance</p>
      </div>

      {/* Overview Section */}
      <div className="flex justify-between">
        <div className="mb-8 flex-[1.4] mr-6 mt-10">
          <h3 className="text-lg font-medium mb-4">Overview</h3>
          <div className="grid grid-cols-3 gap-6">
            {/* Overview Cards */}
            {[
              { label: "Hours Spent", value: "12h" },
              { label: "Test Results", value: "80%" },
              { label: "Course Completed", value: "24" },
            ].map((item, index) => (
              <div key={index} className="bg-slate-800 rounded-lg p-6 flex items-center space-x-2">
                <div className="bg-slate-700 p-3 rounded-lg"></div>
                <div>
                  <p className="text-3xl font-bold">{item.value}</p>
                  <p className="text-slate-400">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Productivity Section */}
        <div className="flex-[0.6]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Productivity</h3>
            <div className="text-right">
              <p className="text-xl font-bold">5 hr 24m</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-slate-400 text-sm">{day}</div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-yellow-500 w-3/4 rounded" />
              <div className="h-4 bg-blue-500 w-full rounded" />
              <div className="h-4 bg-orange-500 w-1/2 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Section with White Background */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 text-black">
        <div className="grid grid-cols-3 gap-6">
          {/* Task Progress */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Task Progress</h2>
            <canvas id="taskProgressChart"></canvas>
          </div>

          {/* Assignments */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Assignments (20)</h2>
            <ul>
              {["User Research for Ofspace", "User Persona for Ollyan"].map((task, index) => (
                <li key={index} className="flex justify-between items-center p-2 border-b">
                  <span>{task}</span>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">September</h2>
            <ul>
              <li className="p-2 border-b">7 - Atomic Design System (6:00 - 7:20)</li>
              <li className="p-2 border-b">9 - UX Design Basics (8:30 - 9:30)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
