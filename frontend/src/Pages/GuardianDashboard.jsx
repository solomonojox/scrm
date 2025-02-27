import React from 'react';
import Sidebar from '../Pages/Sidebar'
import { FaAngleRight, FaAngleLeft, FaBookOpen } from "react-icons/fa";
import { MdIncompleteCircle, MdEventNote } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ChevronRight } from "lucide-react";
import studentId from "../Assets/images.jpeg"

const data = [
  { week: "Monday", time: 5 },
  { week: "Tuesday", time: 6 },
  { week: "Wednesday", time: 4 },
  { week: "Thursday", time: 7 },
  { week: "Friday", time: 3 },
  { week: "Saturday", time: 8 },
  { week: "Sunday", time: 6 },
];

const pieData = [
  { name: "Incompleted", value: 40, color: "#FF0000" },
  { name: "Completed", value: 30, color: "#800080" },
  { name: "In Progress", value: 20, color: "#FFA500" },
];

const CenteredText = ({ viewBox }) => {
  const { cx, cy } = viewBox;
  return (
    <>
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
        22
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize="12" fontWeight="normal" fill="#555">
        Total Courses
      </text>
    </>
  );
};

const WeeklyBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="time" fill="#ff7300" barSize={50} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ProgressCard = ({ color, title, tasks, percentage }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-lg rounded-lg w-full mt-5">
      <div className="w-12 h-12">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textSize: "24px",
            pathColor: color,
            textColor: "#333",
            trailColor: "#E5E7EB",
          })}
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-gray-500">{tasks} Tasks</p>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

const StudentDashboard = () => {
  const guardianData = JSON.parse(localStorage.getItem('guardian'));
  
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sidebar for larger screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Mobile menu button for small screens (you'll need to implement toggle functionality) */}
      <div className="md:hidden p-4 bg-white flex justify-between items-center">
        <p className="font-bold text-xl">Student Dashboard</p>
        <button className="text-gray-700">
          {/* Menu Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white px-4 py-6 md:py-12 md:ml-0 lg:ml-[230px]">
        <p className="font-bold text-2xl md:text-3xl">Welcome Back, {guardianData !== null && guardianData.data.firstname !== null ? guardianData.data.firstname : null}</p>
        <p className="text-gray-700">04, October, 2022</p>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-5">
          <p className="font-bold capitalize text-xl mb-2 sm:mb-0">Time Spendings</p>
          <select className="rounded-md h-10 font-semibold border-2">
            <option>Weekly</option>
          </select>
        </div>

        <div className="mt-4">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-2/3">
              <WeeklyBarChart />
            </div>
            <div className="flex flex-row lg:flex-col justify-between lg:justify-start gap-4 mt-6 lg:mt-10 w-full lg:w-1/3">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 flex items-center justify-center rounded-full w-12 h-12">
                  <MdEventNote className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-sm">Hours spent</p>
                  <p className="font-bold text-lg">42</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 flex items-center justify-center rounded-full w-12 h-12">
                  <FaBookOpen className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-sm">Overall Result</p>
                  <p className="font-bold text-lg">220</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 flex items-center justify-center rounded-full w-12 h-12">
                  <MdIncompleteCircle className="text-white text-2xl" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold text-sm">Completed</p>
                  <p className="font-bold text-lg">20</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row mt-10 gap-6">
            <div className="flex flex-col space-y-5 w-full lg:w-1/2">
              <ProgressCard color="#6366F1" title="User Experience Design" tasks={12} percentage={92} />
              <ProgressCard color="#00BFFF" title="Web Development" tasks={15} percentage={85} />
            </div>

            <div className="flex flex-col items-center w-full lg:w-1/2 mt-6 lg:mt-0">
              <h2 className="text-xl font-bold mb-4">Course Statistics</h2>

              <div className="flex flex-col items-center">
                <div className="w-64 h-64">
                  <PieChart width={250} height={250}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <CenteredText viewBox={{ cx: 125, cy: 125 }} />
                  </PieChart>
                </div>

                <div className="flex flex-col space-y-2 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-semibold">{item.value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Sidebar - Only shown on larger screens or as a modal on mobile */}
      <div className="w-full lg:w-[360px] border-t-2 lg:border-t-0 lg:border-l-2 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <p className="text-xl capitalize">My Profile</p>
          <FiEdit3 className="text-xl" />
        </div>
        
        <div className="flex flex-col items-center mt-6">
          <div className="bg-blue-600 h-32 w-32 md:h-40 md:w-40 shadow-md overflow-hidden">
            <img src={studentId} alt="Student" className="h-full w-full object-cover" />
          </div>
          <p className="text-xl font-semibold capitalize mt-3">Royal Parvej</p>
          <p className="text-gray-700">@royalparvej</p>
        </div>
        
        <div className="flex w-full bg-white p-4 rounded-md shadow-md gap-2 mt-6">
          <div className="bg-gray-100 px-2 py-3 rounded-l-md flex flex-col items-center flex-1">
            <p className="font-bold">10</p>
            <p className="text-sm">Rank</p>
          </div>
          <div className="bg-gray-100 px-2 py-3 flex flex-col items-center flex-1">
            <p className="font-bold">2h</p>
            <div className="flex space-x-1 text-sm">
              <p>Act</p>
              <p>hour</p>
            </div>
          </div>
          <div className="bg-gray-100 px-2 py-3 rounded-r-md flex flex-col items-center flex-1">
            <p className="font-bold">12</p>
            <p className="text-sm">Enclaim</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-6 space-x-4">
          <button><FaAngleLeft /></button>
          <p className="font-bold text-lg">October 2022</p>
          <button><FaAngleRight /></button>
        </div>
        
        <div className="mt-4 flex justify-between bg-white p-4 rounded-md shadow-md">
          {['Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((day, index) => (
            <div key={index} className="text-center">
              <p className="font-bold">12</p>
              <p className="text-gray-700 text-sm">{day}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white p-4 rounded-md shadow-md">
          <p className="text-lg capitalize font-bold">Upcoming Class</p>
          
          <div className="flex space-x-3 mt-4 items-center">
            <div className="h-14 min-w-[60px] border-2 px-2 py-4 rounded-md flex items-center justify-center">
              <p className="font-bold text-lg">8:30</p>
            </div>
            <div>
              <p className="font-bold text-lg capitalize">User Experience Design</p>
              <p className="text-gray-700 text-sm">Online • Zoom Meeting</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4 items-center">
            <div className="h-14 min-w-[60px] border-2 px-2 py-4 rounded-md flex items-center justify-center">
              <p className="font-bold text-lg">9:30</p>
            </div>
            <div>
              <p className="font-bold text-lg capitalize">User Interface Design</p>
              <p className="text-gray-700 text-sm">Online • Zoom Meeting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;