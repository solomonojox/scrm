import React from "react";
import Sidebar from "./Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const subjects = [
  "English",
  "Mathematics",
  "Basic Science",
  "Basic Technology",
  "Civic Education",
  "Computer/ICT",
  "Literature in Eng",
  "Physical & Health",
  "Agricultural Science",
  "Social Studies",
];

const barData = {
  labels: subjects,
  datasets: [
    {
      label: "Jason",
      data: [95, 80, 75, 65, 70, 85, 78, 92, 60, 88],
      backgroundColor: "#7c7ce0",
      borderRadius: 6,
      barThickness: 14,
    },
    {
      label: "Joy",
      data: [88, 70, 65, 55, 60, 78, 70, 85, 50, 70],
      backgroundColor: "#fca5a5",
      borderRadius: 6,
      barThickness: 14,
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      ticks: { maxRotation: 40, minRotation: 0, font: { size: 11 } },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      max: 100,
      grid: { color: "#f1f5f9" },
      ticks: { stepSize: 20 },
    },
  },
};

const lineData = {
  labels: subjects,
  datasets: [
    {
      label: "Jason",
      data: [80, 90, 70, 60, 55, 95, 82, 65, 72, 90],
      borderColor: "#7c7ce0",
      backgroundColor: "rgba(124,124,224,0.05)",
      tension: 0.3,
      pointRadius: 4,
    },
    {
      label: "Joy",
      data: [70, 60, 85, 50, 45, 60, 72, 80, 60, 75],
      borderColor: "#fb7185", // pink
      backgroundColor: "rgba(251,113,133,0.05)",
      tension: 0.3,
      pointRadius: 4,
    },
  ],
};

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      beginAtZero: true,
      grid: { color: "#f1f5f9" },
      ticks: { stepSize: 20 },
    },
  },
};

const doughnutData1 = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#7c7ce0", "#f59e0b"], // blue + orange
      hoverOffset: 6,
    },
  ],
};
const doughnutData2 = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#34d399", "#9ca3af"], // green + gray
      hoverOffset: 6,
    },
  ],
};

const doughnutOptions = {
  cutout: "70%",
  plugins: { legend: { display: false } },
  responsive: true,
  maintainAspectRatio: false,
};

const FeeItem: React.FC<{
  title: string;
  amount: string;
  date: string;
  time?: string;
}> = ({ title, amount, date, time = "12:30pm" }) => (
  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 shadow-sm">
    <img
      alt="avatar"
      src="https://placehold.co/40x40/png?text=Avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
    <div className="flex-1">
      <p className="font-semibold text-xs sm:text-sm leading-tight">{title}</p>
      <p className="text-gray-500 text-xs sm:text-xs">Amount paid: {amount}</p>
      <p className="text-gray-400 text-xs sm:text-xs">{date}</p>
    </div>
    <div className="text-gray-400 text-xs sm:text-sm">
      <i className="far fa-clock" /> {time}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#EDEDED] text-gray-900">
        <Sidebar/>
      {/* Main */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 space-y-4">
        {/* Topbar */}
        <div className="flex flex-col sm:flex-row  bg-white shadow-md justify-between items-center border  rounded-md p-2 sm:p-3 space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center flex-1 max-w-full">
            <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 w-full max-w-md">
              <i className="fas fa-search text-gray-400 text-sm" />
              <input className="bg-transparent focus:outline-none text-sm sm:text-base ml-2 w-full" placeholder="Search" type="search" />
            </div>
          </div>

          <div className="flex items-center   space-x-6 sm:space-x-8 text-gray-600 text-sm sm:text-base">
            <button aria-label="Notifications" className="relative focus:outline-none hover:text-gray-800">
              <i className="far fa-bell text-lg sm:text-xl" />
              <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center space-x-3">
              <img alt="avatar" className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/40x40/png?text=Avatar" />
              <div className="hidden sm:flex flex-col text-xs sm:text-sm">
                <span className="font-semibold text-gray-700">David Ethan</span>
                <span className="text-gray-500">Guardian</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-base sm:text-lg leading-tight">Welcome To EduCat(SCRM)</h2>
          <button className="bg-[#F07A00] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-1 flex items-center space-x-1">
            <span>Weekly</span>
            <i className="fas fa-chevron-down text-xs" />
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#E6D9C9] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-700 font-semibold">Total Number of Pupils</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="text-[#F07A00] text-3xl">
              <i className="fas fa-graduation-cap" />
            </div>
          </div>

          <div className="bg-[#C7CBD5] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-900 font-semibold">Loans Taken This Term</p>
              <p className="text-xl font-bold text-gray-900 mt-1">N200,000</p>
            </div>
            <div className="text-[#3B4A7A] text-3xl">
              <i className="fas fa-coins" />
            </div>
          </div>

          <div className="bg-[#E9C9C9] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-900 font-semibold">First Term School Fees</p>
              <p className="text-xl font-bold text-gray-900 mt-1">N700,000</p>
            </div>
            <div className="text-[#D94A4A] text-3xl">
              <i className="fas fa-wallet" />
            </div>
          </div>

          <div className="bg-[#C9E3C9] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xs sm:text-sm text-gray-900 font-semibold">Today's Assignments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
            </div>
            <div className="text-[#3B7A3B] text-3xl">
              <i className="fas fa-clipboard-list" />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left big column (two charts) */}
          <div className="lg:col-span-2 flex flex-col space-y-4">
            {/* Academic Performance */}
            <div className="bg-white rounded-lg shadow p-4 overflow-x-auto" style={{ minWidth: 600 }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-xs sm:text-sm">Academic Performance</h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#7c7ce0" }} />
                    <span>Jason</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#fca5a5" }} />
                    <span>Joy</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 220 }}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Assignment Completion */}
            <div className="bg-white rounded-lg shadow p-4 overflow-x-auto" style={{ minWidth: 600 }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-xs sm:text-sm">Assignment Completion</h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Jason</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Joy</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 220 }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col space-y-4">
            {/* Attendance Summary */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-xs sm:text-sm">Attendance Summary</h3>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#7c7ce0" }} />
                    <span>Jason</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#fca5a5" }} />
                    <span>Joy</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex flex-col items-center w-1/2">
                  <div style={{ width: 140, height: 140 }}>
                    <Doughnut data={doughnutData1} options={doughnutOptions} />
                  </div>
                  <div className="flex justify-between w-full text-xs mt-2 px-2">
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-400">
                      <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                      <span>Absent</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center w-1/2">
                  <div style={{ width: 140, height: 140 }}>
                    <Doughnut data={doughnutData2} options={doughnutOptions} />
                  </div>
                  <div className="flex justify-between w-full text-xs mt-2 px-2">
                    <div className="flex items-center space-x-1 text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                      <span>Present</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                      <span>Absent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Payment History */}
            <div className="bg-white rounded-lg shadow p-4 flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xs sm:text-sm">Fee Payment History</h3>
                <button className="bg-[#F07A00] text-white text-xs sm:text-sm font-semibold rounded-full px-4 py-1">See All</button>
              </div>

              <div className="space-y-3">
                <FeeItem title="Loan Settlement" amount="N200,000" date="12th August, 2025" />
                <FeeItem title="School Fees Payment" amount="N200,000" date="12th August, 2025" />
                <FeeItem title="End Of Session Party" amount="N200,000" date="12th August, 2025" />
                <FeeItem title="School Fees Payment" amount="N200,000" date="12th August, 2025" />
                <FeeItem title="Loan Settlement" amount="N200,000" date="12th August, 2025" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
