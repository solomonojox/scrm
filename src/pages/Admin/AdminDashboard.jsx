import React, { useEffect } from 'react';
import Adminheader from './Adminheader';
import AdminSidebar from './AdminSidebar';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserFriends,
  FaBell,
  FaComment,
  FaSearch,
  FaChevronDown,
  FaClock,
  FaBookReader,
  FaCertificate,
  FaPencilAlt,
  FaCheckSquare,
  FaPencilRuler
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

// ─── Sample DATA ───────────────────────────────────────────────────────────────
const analyticsData = [
  { month: 'Jan', ux: 15, ui: 10, dev: 20 },
  { month: 'Feb', ux: 25, ui: 5, dev: 15 },
  { month: 'Mar', ux: 10, ui: 20, dev: 25 },
  { month: 'Apr', ux: 20, ui: 15, dev: 5 },
  { month: 'May', ux: 22, ui: 18, dev: 10 },
  { month: 'Jun', ux: 8, ui: 12, dev: 5 },
  { month: 'Jul', ux: 12, ui: 8, dev: 15 },
  { month: 'Aug', ux: 5, ui: 10, dev: 8 },
  { month: 'Sep', ux: 15, ui: 5, dev: 12 },
  { month: 'Oct', ux: 25, ui: 22, dev: 20 },
  { month: 'Nov', ux: 10, ui: 15, dev: 8 },
  { month: 'Dec', ux: 18, ui: 25, dev: 15 }
];

const timeData = [
  { month: 'Jan', Active: 80, Inactive: 40 },
  { month: 'Feb', Active: 70, Inactive: 30 },
  { month: 'Mar', Active: 75, Inactive: 35 },
  { month: 'Apr', Active: 80, Inactive: 40 },
  { month: 'May', Active: 60, Inactive: 20 },
  { month: 'Jun', Active: 30, Inactive: 90 },
  { month: 'Jul', Active: 20, Inactive: 100 },
  { month: 'Aug', Active: 10, Inactive: 75 },
  { month: 'Sep', Active: 55, Inactive: 65 },
  { month: 'Oct', Active: 85, Inactive: 80 },
  { month: 'Nov', Active: 65, Inactive: 60 },
  { month: 'Dec', Active: 90, Inactive: 85 }
];

// ─── AdminDashboard COMPONENT ─────────────────────────────────────────────────
export default function AdminDashboard() {
  useEffect(() => {
    document.title = 'EduCat Dashboard';
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-inter">
      {/* 1) HEADER */}
      <Adminheader className="shadow-md" />

      <div className="flex">
        {/* 2) SIDEBAR */}
        <AdminSidebar className="mt-10 relative top-11" />

        {/* 3) MAIN CONTENT */}
        <div className="flex-1 ml-64">
          {/* 3a) TOPBAR */}
          <div className="flex flex-col sm:flex-row  rounded-md  justify-between items-center px-6 py-3 mt-4 bg-white shadow-md">
            <div className="w-full max-w-sm">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="ml-2 bg-transparent outline-none w-full text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <FaBell className="text-gray-500 hover:text-orange-500 cursor-pointer" />
              <FaComment className="text-gray-500 hover:text-orange-500 cursor-pointer" />
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 space-x-2">
                <img
                  src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                  className="w-8 h-8 rounded-full"
                  alt="Admin"
                />
                <div className="text-xs">
                  <div className="font-semibold text-gray-700">Gold Academy</div>
                  <div className="text-gray-400">Admin</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3b) DASHBOARD CONTENT */}
          <main className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome To EduCat (SCRM)
            </h2>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Students"
                value="120k"
                icon={<FaUserGraduate />}
                bgColor="bg-[#E6C9B0]"
                iconColor="text-orange-600"
              />
              <StatCard
                label="Pending Courses"
                value="03"
                icon={<FaBookReader />}
                bgColor="bg-[#BFC6D0]"
                iconColor="text-blue-700"
              />
              <StatCard
                label="Total Teachers"
                value="37"
                icon={<FaChalkboardTeacher />}
                bgColor="bg-[#E9B6B6]"
                iconColor="text-red-600"
              />
              <StatCard
                label="Certificates"
                value="08"
                icon={<FaCertificate />}
                bgColor="bg-[#C9E3C3]"
                iconColor="text-green-600"
              />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AnalyticsChart />
              <ProgressCircle />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TimeSpendingChart />
              <UpcomingClasses />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bgColor, iconColor }) {
  return (
    <div className={`${bgColor} rounded-lg p-4 flex items-center justify-between shadow-sm`}>
      <div>
        <p className="text-xs text-gray-600 uppercase">{label}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`text-3xl ${iconColor}`}>{icon}</div>
    </div>
  );
}

// ─── AnalyticsChart ───────────────────────────────────────────────────────────
function AnalyticsChart() {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm col-span-2 relative">
      <h3 className="text-xs font-semibold text-gray-800 mb-2">Study Statistics</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={analyticsData}>
          <defs>
            <linearGradient id="colorUx" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9F88FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#9F88FF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF9EA9" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#FF9EA9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#72DBF4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#72DBF4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ux" stroke="#9F88FF" strokeWidth={2} dot={{ r: 3 }} fill="url(#colorUx)" />
          <Line type="monotone" dataKey="ui" stroke="#FF9EA9" strokeWidth={2} dot={{ r: 3 }} fill="url(#colorUi)" />
          <Line type="monotone" dataKey="dev" stroke="#72DBF4" strokeWidth={2} dot={{ r: 3 }} fill="url(#colorDev)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── ProgressCircle ───────────────────────────────────────────────────────────
function ProgressCircle() {
  const ringData = [
    { name: 'Completed Lessons', value: 70 },
    { name: 'Visited Lessons', value: 30 },
    { name: 'Empty', value: 100 }
  ];
  const COLORS = ['#3CCA7E', '#FF8C00', '#D6CCFF'];

  return (
    <div className="bg-white rounded-md shadow-sm relative" style={{ minHeight: '280px' }}>
      <div className="flex justify-between items-center mb-3 px-4 pt-4">
        <h3 className="text-xs font-semibold text-gray-800">My Progress</h3>
        <button className="bg-orange-600 text-white text-xs font-semibold rounded-full px-3 py-1 flex items-center">
          Weekly <FaChevronDown className="ml-1 text-[8px]" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={[ringData[2]]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={COLORS[2]} />
          </Pie>
          <Pie
            data={[ringData[1]]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            startAngle={90}
            endAngle={90 - (ringData[1].value / 100) * 360}
          >
            <Cell fill={COLORS[1]} />
          </Pie>
          <Pie
            data={[ringData[0]]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={110}
            startAngle={90}
            endAngle={90 - (ringData[0].value / 100) * 360}
          >
            <Cell fill={COLORS[0]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-xs text-gray-500">Total Hours</div>
        <div className="text-sm font-bold text-gray-800">7h 20m</div>
      </div>
    </div>
  );
}

// ─── TimeSpendingChart ────────────────────────────────────────────────────────
function TimeSpendingChart() {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm" style={{ minHeight: '160px' }}>
      <h3 className="text-xs font-semibold text-gray-800 mb-2">Time Spending</h3>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={timeData}>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill="#8884d8" barSize={12} />
          <Bar dataKey="Inactive" fill="#FF8C00" barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── UpcomingClasses ──────────────────────────────────────────────────────────
function UpcomingClasses() {
  const classes = [
    { title: 'UX Writing for Beginners', instructor: 'Manny Lawson', time: '12:30pm', icon: <FaPencilAlt />, color: 'bg-blue-100 text-blue-600' },
    { title: 'How to Do Multitasking Easily', instructor: 'Toby McGuire', time: '12:30pm', icon: <FaCheckSquare />, color: 'bg-green-100 text-green-600' },
    { title: 'UI Design Advance Course', instructor: 'Esther Olive', time: '12:30pm', icon: <FaPencilRuler />, color: 'bg-orange-100 text-orange-600' }
  ];

  return (
    <div className="bg-white rounded-md p-4 shadow-sm" style={{ minHeight: '160px' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-gray-800">Upcoming Classes</h3>
        <button className="bg-orange-600 text-white text-xs font-semibold rounded-full px-3 py-1">
          See All
        </button>
      </div>
      <ul className="space-y-3">
        {classes.map((cls, i) => (
          <li key={i} className="flex items-center space-x-3 bg-gray-100 rounded-md p-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-md ${cls.color}`}>
              {cls.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-800">{cls.title}</div>
              <div className="text-[10px] text-gray-500">{cls.instructor}</div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 text-[10px]">
              <FaClock /> <span>{cls.time}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500 text-[10px]">
              <FaUserFriends /> <span>12 Students</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
