/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
// import NotificationModal from './Notification';
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSearch,
  FaBookReader,
  FaCertificate,
  FaRegBell,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BiMessageAlt } from "react-icons/bi";
import { useAuth } from "../../../Context/Auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Store/store";
import {fetchTeacherFailure,fetchTeacherStart,fetchTeacherSuccess} from "../../../Store/Teachers/teacherSlice";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import Calendar from "../../../components/Teachers/chart/Calendar";
import GradeChart from "../../../components/Teachers/chart/GradeChart";
import AttendanceChart from "../../../components/Teachers/chart/AttendanceChart";


// ─── AdminDashboard COMPONENT ─────────────────────────────────────────────────
export default function TeacherDashboard() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const fetchedTeacherRecord = useSelector((state: RootState) => state.getTeacher.selectedTeacher);
  // console.log("fetchedTeacherRecord", fetchedTeacherRecord);
  const fetchedLoading = useSelector((state: RootState) => state.getTeacher.loading);
  const error = useSelector((state: RootState) => state.getTeacher.error);

  // local time greeting
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  useEffect(() => {
    document.title = "EduCat Dashboard";
  }, []);

  // Fetch students
  useEffect(() => {
    if (!fetchedLoading) {
      fetchdashboardCardDetails();
    }
  }, [dispatch]);

  const fetchdashboardCardDetails = async () => {
    dispatch(fetchTeacherStart());

    try {
      const teacherData = await teacherService.getById(user?.id);

      dispatch(fetchTeacherSuccess(teacherData));
    } catch (err: any) {
      dispatch(fetchTeacherFailure(err.message));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-inter p-4 sm:py-6 md:py-8">
      {/* MAIN CONTENT */}
      <div>
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
          <div className="flex items-center space-x-2">
            <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
            <div className="flex items-center rounded-full pr-3 py-1">
              <img
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${fetchedTeacherRecord?.email}`}
                className="w-14 h-14 rounded-full"
                alt="teacher"
              />
              <div className="text-xs">
                <div className="font-semibold text-gray-700">
                  <span>{fetchedTeacherRecord?.firstname || ""}</span> {""}
                  <span>{fetchedTeacherRecord?.lastname || ""}</span>
                </div>
                <div className="text-gray-400">{"class teacher"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <main className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">{getGreeting()}, {fetchedTeacherRecord?.firstname || ""}</h2>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Pupils"
              value={"0"}
              icon={<FaUserGraduate />}
              bgColor="bg-[#E6C9B0]"
              iconColor="text-orange-600"
            />
            <StatCard
              label="Pending Assignments"
              value={"0"}
              icon={<FaBookReader />}
              bgColor="bg-[#BFC6D0]"
              iconColor="text-blue-700"
            />
            <StatCard
              label="Attendace taken this week"
              value={"0"}
              icon={<FaChalkboardTeacher />}
              bgColor="bg-[#E9B6B6]"
              iconColor="text-red-600"
            />
            <StatCard
              label="Unread messages"
              value={"0"}
              icon={<FaCertificate />}
              bgColor="bg-[#C9E3C3]"
              iconColor="text-green-600"
            />
          </div>

          {/* FIRST ROW OF CHARTS */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[60%]">
              <GradeChart />
            </div>
            <div className="w-full lg:w-[40%]">
              <ProgressCircle />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[60%]">
              <AttendanceChart />
            </div>
            <div className="w-full lg:w-[40%]">
              <Calendar />
            </div>
          </div>
        </main>
        {/* <NotificationModal show={showModal} onClose={() => setShowModal(false)} /> */}
      </div>
    </div>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, bgColor, iconColor }: any) {
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

// ─── ProgressCircle ───────────────────────────────────────────────────────────
function ProgressCircle() {
  const ringData = [
    { name: "Active", value: 70 },
    { name: "Visited Lessons", value: 50 },
    { name: "Empty", value: 100 },
  ];
  const COLORS = ["#9647FF", "#E0E011", "#E0E01166"];

  return (
    <div className="bg-white rounded-md p-6 shadow-sm relative h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Time Spending (Daily)</h3>
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
        <span className="text-sm font-bold text-gray-800">5h 10m</span>
      </div>
      <div className="flex justify-center items-center space-x-6 mt-4">
        <div className="flex items-center space-x-1">
          <span className="block w-2 h-2 rounded-full bg-[#9647FF]" />
          <span className="text-xs text-gray-600 font-semibold">Active</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="block w-2 h-2 rounded-full bg-[#E0E011]" />
          <span className="text-xs text-gray-600 font-semibold">Inactive</span>
        </div>
      </div>
    </div>
  );
}
