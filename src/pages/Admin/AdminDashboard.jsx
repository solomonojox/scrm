import React, { useEffect, useState } from 'react';


import Adminheader from './Adminheader';
import AdminSidebar from './AdminSidebar';
import NotificationModal from './Notification';
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
  FaPencilRuler,
  FaRegBell
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
import { BiMessageAlt } from 'react-icons/bi';
import { useAuth } from '../../Context/Auth/useAuth';

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
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    document.title = 'EduCat Dashboard';
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-inter p-4 sm:py-6 md:py-8">
      {/* MAIN CONTENT */}
      <div >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-1 mb-4">
          <div className="w-full sm:w-auto mb-4 sm:mb-0">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
              <FaSearch className="text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <div className="flex items-center rounded-full px-3 py-1 space-x-2">
              <img
                src="https://storage.googleapis.com/a1aa/image/05c98d25-08e9-4bce-610b-3688b9c7b241.jpg"
                className="w-14 h-14 rounded-full"
                alt="Admin"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">Gold Academy</div>
                <div className="text-gray-400">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <main className="space-y-4">

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

          {/* FIRST ROW OF CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnalyticsChart />
            <ProgressCircle />
          </div>

          {/* SECOND ROW: TimeSpendingChart (3 cols) + UpcomingClasses (1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TimeSpendingChart />
            </div>
            <div>
              <UpcomingClasses />
            </div>
          </div>


        </main>
        <NotificationModal show={showModal} onClose={() => setShowModal(false)} />
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
    <div className="bg-white rounded-md p-6 shadow-sm col-span-2 relative h-full">
      <h3 className="text-sm font-medium text-gray-800 mb-4">Study Statistics</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={analyticsData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
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
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Legend
            iconType="circle"
            verticalAlign="top"
            align="right"
            height={24}
            formatter={text =>
              text === 'ux'
                ? 'UX Design'
                : text === 'ui'
                  ? 'UI Design'
                  : 'Development'
            }
          />
          <Line
            type="monotone"
            dataKey="ux"
            stroke="#9F88FF"
            strokeWidth={2}
            dot={{ r: 3 }}
            fill="url(#colorUx)"
          />
          <Line
            type="monotone"
            dataKey="ui"
            stroke="#FF9EA9"
            strokeWidth={2}
            dot={{ r: 3 }}
            fill="url(#colorUi)"
          />
          <Line
            type="monotone"
            dataKey="dev"
            stroke="#72DBF4"
            strokeWidth={2}
            dot={{ r: 3 }}
            fill="url(#colorDev)"
          />
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
    <div className="bg-white rounded-md p-6 shadow-sm relative h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-800">My Progress</h3>
        <button className="bg-orange-600 text-white text-xs font-semibold rounded-full px-3 py-1 flex items-center">
          Weekly <FaChevronDown className="ml-1 text-[8px]" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={220}>
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
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-gray-500">Total Hours</span>
        <span className="text-sm font-bold text-gray-800">7h20m</span>
      </div>
      <div className="flex justify-center items-center space-x-6 mt-4">
        <div className="flex items-center space-x-1">
          <span className="block w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-xs text-gray-600">Visited Lessons</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Completed Lessons</span>
        </div>
      </div>
    </div>
  );
}

// ─── TimeSpendingChart ────────────────────────────────────────────────────────
function TimeSpendingChart() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg h-full w-full">

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Spending</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={timeData}
          margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#4A5568" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#4A5568" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            contentStyle={{
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          />
          <Legend verticalAlign="top" align="right" iconSize={14} />
          <Bar dataKey="Active" fill="#9F88FF" barSize={20} />
          <Bar dataKey="Inactive" fill="#FF9EA9" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}



// ─── UpcomingClasses ──────────────────────────────────────────────────────────
function UpcomingClasses() {
  const classes = [
    {
      title: 'UX Writing for Beginners',
      instructor: 'Manny Lawson',
      time: '12:30pm',
      icon: <FaPencilAlt className="text-lg" />,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'How to Do Multitasking Easily',
      instructor: 'Toby McGuire',
      time: '12:30pm',
      icon: <FaCheckSquare className="text-lg" />,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'UI Design Advance Course',
      instructor: 'Esther Olive',
      time: '12:30pm',
      icon: <FaPencilRuler className="text-lg" />,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg h-full w-full">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">Upcoming Classes</h3>
        <button className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-full px-3 py-1 transition">
          See All
        </button>
      </div>
      <ul className="space-y-3 flex-1">
        {classes.map((cls, i) => (
          <li
            key={i}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 flex items-center justify-center rounded-md ${cls.color}`}>
                {cls.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">{cls.title}</div>
                <div className="text-[11px] text-gray-500">{cls.instructor}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500 text-[11px]">
              <div className="flex items-center space-x-1">
                <FaClock className="text-[14px]" />
                <span>{cls.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaUserFriends className="text-[14px]" />
                <span>12 Students</span>
              </div>
            </div>
          </li>
        ))}
      </ul>


    </div>
  );
}
