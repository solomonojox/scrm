// src/components/Dashboard.tsx
import React, { useRef } from "react";
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
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import Sidebar from "./Sidebar";

/* Register chart.js elements + plugins */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

/* center text plugin for doughnut (cast to any to avoid strict typing friction) */
const centerTextPlugin = {
  id: "centerText",
  afterDraw: (chart: any) => {
    if (chart.config.type !== "doughnut" && chart.config.type !== "pie") return;
    const { ctx, chartArea, data } = chart;
    const datasets = data.datasets || [];
    if (!datasets.length) return;

    const d = datasets[0].data;
    if (!d || d.length < 2) return;
    const total = d[0] + d[1];
    const percent = Math.round((d[0] / total) * 100);

    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.font = "700 16px Inter, system-ui, -apple-system, 'Segoe UI', Roboto";
    ctx.fillStyle = "#374151";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${percent}%`, centerX, centerY - 6);

    ctx.font = "400 11px Inter, system-ui";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("Present", centerX, centerY + 12);
    ctx.restore();
  },
} as any;

/* subtle glow plugin */
const glowPlugin = {
  id: "glow",
  beforeDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx;
    (chart.data.datasets || []).forEach((ds: any, i: number) => {
      const meta = chart.getDatasetMeta(i);
      if (!meta?.hidden) {
        ctx.save();
        ctx.shadowColor = ds.borderColor || ds.backgroundColor || "rgba(0,0,0,0.12)";
        ctx.shadowBlur = ds.shadowBlur ?? 12;
        ctx.restore();
      }
    });
  },
} as any;

ChartJS.register(centerTextPlugin, glowPlugin);

/* ---------- Data & options ---------- */

const subjects = [
  "English",
  "Mathematics",
  "Basic Science",
  "Social Studies",
  "Civic Education",
  "Computer Studies / ICT",
  "Literature in English",
  "Yoruba",
  "Agricultural Science",
  "Home Economics",
  "Cultural & Creative Arts",
  "PE",
];

function gradientForBar(ctx: CanvasRenderingContext2D, chartArea: any, colorStart: string, colorEnd: string) {
  const { top, bottom } = chartArea;
  const grad = ctx.createLinearGradient(0, top + (bottom - top) * 0.05, 0, bottom);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(1, colorEnd);
  return grad;
}

const barData: ChartData<"bar"> = {
  labels: subjects,
  datasets: [
    {
      label: "Jason",
      data: [95, 60, 85, 40, 80, 90, 70, 55, 80, 30, 85, 40],
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart as any;
        const area = chart.chartArea;
        if (!area) return "rgba(99,102,241,0.9)";
        return gradientForBar(chart.ctx, area, "rgba(99,102,241,0.95)", "rgba(99,102,241,0.35)");
      },
      borderRadius: 8,
      maxBarThickness: 28,
      borderSkipped: false,
      hoverBorderWidth: 0,
      shadowBlur: 14,
    },
    {
      label: "Joy",
      data: [20, 82, 65, 50, 55, 80, 95, 85, 75, 95, 58, 28],
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart as any;
        const area = chart.chartArea;
        if (!area) return "rgba(244,114,182,0.9)";
        return gradientForBar(chart.ctx, area, "rgba(244,114,182,0.95)", "rgba(244,114,182,0.28)");
      },
      borderRadius: 8,
      maxBarThickness: 28,
      borderSkipped: false,
      hoverBorderWidth: 0,
      shadowBlur: 12,
    },
  ],
};

const barOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: {
      position: "top",
      labels: { boxWidth: 12, boxHeight: 8, padding: 12, font: { size: 11 } },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#111827",
      titleFont: { size: 12, weight: "600" },
      bodyFont: { size: 11 },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      ticks: { maxRotation: 45, minRotation: 30, font: { size: 10 }, color: "#374151" },
      grid: { display: false },
    } as any,
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, font: { size: 10 }, color: "#374151" },
      grid: { color: "rgba(15,23,42,0.06)" },
    } as any,
  },
  animation: {
    duration: 1100,
    easing: "easeOutQuart",
  },
  datasets: {
    bar: {
      borderRadius: 8,
    },
  } as any,
};

const lineData: ChartData<"line"> = {
  labels: subjects,
  datasets: [
    {
      label: "Jason",
      data: [80, 60, 90, 70, 85, 65, 75, 60, 70, 50, 40, 30],
      borderColor: "rgba(99,102,241,1)",
      pointBackgroundColor: "#fff",
      pointBorderColor: "rgba(99,102,241,1)",
      tension: 0.36,
      fill: "start",
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart as any;
        const area = chart.chartArea;
        if (!area) return "rgba(99,102,241,0.12)";
        const grad = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
        grad.addColorStop(0, "rgba(99,102,241,0.28)");
        grad.addColorStop(1, "rgba(99,102,241,0.02)");
        return grad;
      },
      borderWidth: 2.6,
      pointRadius: 4,
      shadowBlur: 14,
    },
    {
      label: "Joy",
      data: [30, 85, 55, 90, 60, 95, 50, 85, 95, 80, 95, 60],
      borderColor: "rgba(244,114,182,1)",
      pointBackgroundColor: "#fff",
      pointBorderColor: "rgba(244,114,182,1)",
      tension: 0.36,
      fill: "start",
      backgroundColor: (ctx: any) => {
        const chart = ctx.chart as any;
        const area = chart.chartArea;
        if (!area) return "rgba(244,114,182,0.08)";
        const grad = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
        grad.addColorStop(0, "rgba(244,114,182,0.26)");
        grad.addColorStop(1, "rgba(244,114,182,0.02)");
        return grad;
      },
      borderWidth: 2.6,
      pointRadius: 4,
      shadowBlur: 12,
    },
  ],
};

const lineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: { font: { size: 11 } },
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#0f172a",
      titleFont: { size: 12, weight: "600" },
      bodyFont: { size: 11 },
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: { ticks: { display: false }, grid: { display: false } } as any,
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 20, font: { size: 10 }, color: "#374151" },
      grid: { color: "rgba(15,23,42,0.06)" },
    } as any,
  },
  animation: {
    duration: 1200,
    easing: "easeOutQuart",
  },
};

const attendanceDataJason: ChartData<"doughnut"> = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#6366F1", "#FBBF24"],
      hoverOffset: 8,
      borderWidth: 4,
      borderColor: "#fff",
    },
  ],
};

const attendanceDataJoy: ChartData<"doughnut"> = {
  labels: ["Present", "Absent"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#FB7185", "#16A34A"],
      hoverOffset: 8,
      borderWidth: 4,
      borderColor: "#fff",
    },
  ],
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: "#111827",
      bodyFont: { size: 11 },
      padding: 8,
      cornerRadius: 8,
    },
  },
  animation: {
    duration: 900,
    easing: "easeOutBack",
  },
};

export default function Dashboard(): JSX.Element {
  const barRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Top-level flex to place Sidebar and Main content side-by-side */}
      <div className="flex min-h-screen">
        
          <Sidebar />
        

        {/* Main content */}
        <main className="mr-10  md:p-8">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white border rounded-lg px-3 py-2 mb-6 shadow-sm">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-[320px]">
                <input
                  className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-300 text-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  placeholder="Search"
                  type="search"
                />
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-3 sm:mt-0 sm:ml-4 text-gray-700 text-sm">
              <button aria-label="Notifications" className="text-gray-600 hover:text-gray-900 text-lg">
                <i className="far fa-bell" />
              </button>
              <button aria-label="Messages" className="text-gray-600 hover:text-gray-900 text-lg">
                <i className="far fa-comment-alt" />
              </button>
              <div className="flex items-center space-x-2">
                <img alt="Avatar" className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/40x40/8aacc8/ffffff/png?text=Avatar" />
                <div className="text-right leading-tight">
                  <p className="font-semibold text-gray-900 text-xs">David Ethan</p>
                  <p className="text-gray-500 text-[10px]">Guardian</p>
                </div>
              </div>
            </div>
          </div>

          {/* Welcome & button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="font-semibold text-gray-900 text-lg mb-3 sm:mb-0">Welcome To EduCat(SCRM)</h2>
            <button className="bg-orange-600 text-white text-xs font-semibold rounded px-3 py-1 whitespace-nowrap hover:bg-orange-700 transition">
              View Bank Account Details
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#e6c9b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-gray-600 mb-1">Total Number of Pupils</p>
                <p className="font-semibold text-2xl text-gray-900 leading-none">2</p>
              </div>
              <i className="fas fa-user-graduate text-orange-500 text-3xl" />
            </div>
            <div className="bg-[#c3cbd4] rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-gray-600 mb-1">Savings Account Balance</p>
                <p className="font-semibold text-lg text-gray-900 leading-none">N200,000</p>
              </div>
              <i className="fas fa-wallet text-gray-700 text-3xl" />
            </div>
            <div className="bg-[#e6b7b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-gray-600 mb-1">Loan Account Balance</p>
                <p className="font-semibold text-lg text-gray-900 leading-none">N300,000</p>
              </div>
              <i className="fas fa-coins text-red-500 text-3xl" />
            </div>
            <div className="bg-[#c9e6b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] text-gray-600 mb-1">First Term School Fees</p>
                <p className="font-semibold text-lg text-gray-900 leading-none">N700,000</p>
              </div>
              <i className="fas fa-hand-holding-usd text-green-600 text-3xl" />
            </div>
          </div>

          {/* Weekly dropdown */}
          <div className="flex justify-end mb-6">
            <div className="relative inline-block text-left">
              <button className="inline-flex justify-center rounded-md border border-orange-600 bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-700">
                Weekly
                <svg className="-mr-1 ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Academic performance (bar) */}
              <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto" style={{ minWidth: 320 }}>
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Academic Performance</h3>
                <div style={{ height: 320 }}>
                  <Bar ref={barRef} data={barData} options={barOptions} />
                </div>
              </div>

              {/* Assignment completion (line) */}
              <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto" style={{ minWidth: 320 }}>
                <h3 className="font-semibold text-xs text-gray-900 mb-3">Assignment Completion</h3>
                <div style={{ height: 300 }}>
                  <Line ref={lineRef} data={lineData} options={lineOptions} />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Attendance summary */}
              <div className="bg-white rounded-lg p-4 shadow-md flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1 min-w-[150px]">
                  <h3 className="font-semibold text-xs text-gray-900 mb-3">Attendance Summary</h3>

                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <div className="relative w-28 h-28 mx-auto">
                        <Doughnut data={attendanceDataJason} options={doughnutOptions} />
                      </div>
                      <div className="flex justify-center space-x-4 mt-2 text-[10px] text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                          <span>Present</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                          <span>Absent</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="relative w-28 h-28 mx-auto">
                        <Doughnut data={attendanceDataJoy} options={doughnutOptions} />
                      </div>
                      <div className="flex justify-center space-x-4 mt-2 text-[10px] text-gray-600">
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                          <span>Present</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                          <span>Absent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee payment history */}
              <div className="bg-white rounded-lg p-4 shadow-md" style={{ minWidth: 320 }}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-xs text-gray-900">Fee Payment History</h3>
                  <button className="bg-orange-600 text-white text-xs font-semibold rounded px-3 py-1 whitespace-nowrap hover:bg-orange-700 transition">See All</button>
                </div>

                <div className="space-y-3">
                  {[
                    "Loan Settlement",
                    "School Fees Payment",
                    "End Of Session Party",
                    "School Fees Payment",
                    "Loan Settlement",
                  ].map((title, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 shadow-sm">
                      <img alt="Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" src="https://placehold.co/40x40/8aacc8/ffffff/png?text=Avatar" />
                      <div className="flex-1 text-xs text-gray-700">
                        <p className="font-semibold text-gray-900 leading-tight">{title}</p>
                        <p className="leading-tight">Amount paid: N200,000</p>
                      </div>
                      <div className="text-[10px] text-gray-500 text-right flex flex-col items-end space-y-1">
                        <p>12th August, 2025</p>
                        <p><i className="far fa-clock" /> 12:30pm</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
