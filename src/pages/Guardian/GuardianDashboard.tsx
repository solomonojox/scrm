// src/components/Dashboard.tsx
import React, { useEffect, useRef, useState } from "react";
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
import { useAuth } from "../../Context/Auth/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Store/store";
import {
  fetchGuardiansStudentFailure,
  fetchGuardiansStudentStart,
  fetchGuardiansStudentSuccess,
} from "../../Store/Guardian/guardianStudentSlice";
import { guardianStudentService } from "../../Services/Guardian/guardianStudent";
import { guardianAccountService } from "../../Services/Guardian/account";
import {
  fetchGuardiansAccountFailure,
  fetchGuardiansAccountStart,
  fetchGuardiansAccountSuccess,
} from "../../Store/Guardian/accountSlice";
import { Check, Copy, X } from "lucide-react";
import {
  fetchGuardiansLoanAccountFailure,
  fetchGuardiansLoanAccountStart,
  fetchGuardiansLoanAccountSuccess,
} from "../../Store/Guardian/loanAccountSlice";
import TransactionHistory from "./account/TransactionHistory";

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

function gradientForBar(
  ctx: CanvasRenderingContext2D,
  chartArea: any,
  colorStart: string,
  colorEnd: string
) {
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
      //   shadowBlur: 14,
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
      //   shadowBlur: 12,
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
      titleFont: { size: 12 },
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
      //   shadowBlur: 14,
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
      //   shadowBlur: 12,
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
      titleFont: { size: 12, weight: 600 },
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

export default function GuardianDashboard(): React.JSX.Element {
  const { user } = useAuth();
  const barRef = useRef<any>(null);
  const lineRef = useRef<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const fetchedTotalGuardianStudent = useSelector(
    (state: RootState) => state.getGuardianStudents.listRecords
  );
  const fetchedGuardianAccount = useSelector(
    (state: RootState) => state.getGuardianAccount.listRecords
  );
  const fetchedGuardianLoanAccount = useSelector(
    (state: RootState) => state.getGuardianLoanAccount.listRecords
  );
  const fetchedLoading = useSelector((state: RootState) => state.getGuardianStudents.loading);
  const error = useSelector((state: RootState) => state.getGuardianStudents.error);

  const accountInfo = {
    "Account Type": "Savings Account",
    Bank: fetchedGuardianAccount?.bankName,
    "Account Name": fetchedGuardianAccount?.accountName,
    "Account Number": fetchedGuardianAccount?.accountNumber,
  };

  const copyToClipboard = async (text: any, fieldName: any) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  useEffect(() => {
    if (user?.id && !fetchedLoading) {
      fetchDashboardDetails();
    }
  }, [user, dispatch]);

  const fetchDashboardDetails = async () => {
    dispatch(fetchGuardiansStudentStart());
    dispatch(fetchGuardiansAccountStart());
    dispatch(fetchGuardiansLoanAccountStart());
    try {
      const data = await guardianStudentService.getAll(user?.id);
      const savingsAccountData = await guardianAccountService.getGuardianAccount(user?.id);
      const loanAccountData = await guardianAccountService.getGuardianLoanAccount(user?.id);

      dispatch(fetchGuardiansStudentSuccess(data));
      dispatch(fetchGuardiansAccountSuccess(savingsAccountData));
      dispatch(fetchGuardiansLoanAccountSuccess(loanAccountData));
    } catch (err) {
      dispatch(fetchGuardiansStudentFailure((err as Error).message));
      dispatch(fetchGuardiansAccountFailure((err as Error).message));
      dispatch(fetchGuardiansLoanAccountFailure((err as Error).message));
    }
  };

  return (
    <div className="">
      <main className="mx-4 lg:mx-0">
        {/* Welcome & button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="font-semibold text-gray-900 text-[20px] mb-3 sm:mb-0">
            Welcome To EduCat(SCRM)
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white text-xs font-semibold rounded px-3 py-3 whitespace-nowrap hover:bg-orange-700 transition"
          >
            View Savings Account Details
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#e6c9b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Total Number of Pupils</p>
              <p className="font-semibold text-2xl text-gray-900 leading-none">
                {fetchedTotalGuardianStudent?.length}
              </p>
            </div>
            <i className="fas fa-user-graduate text-orange-500 text-3xl" />
          </div>
          <div className="bg-[#c3cbd4] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Savings Account Balance</p>
              <p className="font-semibold text-lg text-gray-900 leading-none">
                ₦ {fetchedGuardianAccount?.balance}
              </p>
            </div>
            <i className="fas fa-wallet text-gray-700 text-3xl" />
          </div>
          <div className="bg-[#e6b7b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Loan Account Balance</p>
              <p className="font-semibold text-lg text-gray-900 leading-none">
                ₦ {fetchedGuardianLoanAccount?.balance}
              </p>
            </div>
            <i className="fas fa-coins text-red-500 text-3xl" />
          </div>
          <div className="bg-[#c9e6b7] rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[13px] text-gray-600 mb-1">Current Term</p>
              <p className="font-semibold text-lg text-gray-900 leading-none">
                {fetchedTotalGuardianStudent[0]?.currentTerm === 1
                  ? " First Term"
                  : fetchedTotalGuardianStudent[0]?.currentTerm === 2
                  ? "Second Term"
                  : fetchedTotalGuardianStudent[0]?.currentTerm === 3
                  ? "Third Term"
                  : ""}
              </p>
            </div>
            <i className="fas fa-hand-holding-usd text-green-600 text-3xl" />
          </div>
        </div>

        {/* Weekly dropdown */}
        <div className="flex justify-end mb-6">
          <div className="relative inline-block text-left">
            <button className="inline-flex justify-center rounded-md border border-orange-600 bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-orange-700">
              Weekly
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Academic performance (bar) */}
            <div
              className="bg-white rounded-lg p-4 shadow-md overflow-x-auto"
              style={{ minWidth: 320 }}
            >
              <h3 className="font-semibold text-[18px] text-gray-900 mb-3">Academic Performance</h3>
              <div style={{ height: 320 }}>
                <Bar ref={barRef} data={barData} options={barOptions} />
              </div>
            </div>

            {/* Assignment completion (line) */}
            <div
              className="bg-white rounded-lg shadow-md overflow-x-auto"
              style={{ minWidth: 320 }}
            >
              {/* <h3 className="font-semibold text-[18px] text-gray-900 mb-3">
                Assignment Completion
              </h3>
              <div style={{ height: 300 }}>
                <Line ref={lineRef} data={lineData} options={lineOptions} />
              </div> */}

              <TransactionHistory />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Attendance summary */}
            <div className="bg-white z-0 rounded-lg px-4  shadow-md flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1 min-w-[150px] py-10">
                <h3 className="font-semibold text-[18px] text-gray-900 mb-3">Attendance Summary</h3>

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
            <div className="bg-white rounded-lg px-4 py-6 shadow-md" style={{ minWidth: 320 }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[18px] text-gray-900">Fee Payment History</h3>
                <button className="bg-orange-600 text-white text-xs font-semibold rounded px-3 py-1 whitespace-nowrap hover:bg-orange-700 transition">
                  See All
                </button>
              </div>

              <div className="space-y-3">
                {[
                  "Loan Settlement",
                  "School Fees Payment",
                  "End Of Session Party",
                  "School Fees Payment",
                  "Loan Settlement",
                ].map((title, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 shadow-sm"
                  >
                    <img
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      src="https://placehold.co/40x40/8aacc8/ffffff/png?text=Avatar"
                    />
                    <div className="flex-1 text-xs text-gray-700">
                      <p className="font-semibold text-gray-900 leading-tight">{title}</p>
                      <p className="leading-tight">Amount paid: N200,000</p>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right flex flex-col items-end space-y-1">
                      <p>12th August, 2025</p>
                      <p>
                        <i className="far fa-clock" /> 12:30pm
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Modal Content */}
          <div className="bg-white rounded-lg max-h-[550px] overflow-auto parent-scrollbar shadow-xl max-w-lg w-full mx-4 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Savings Account Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-orange-400 hover:text-orange-600 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-">
              {Object.entries(accountInfo).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 mb-1">{key}</p>
                    <p className="text-gray-900 font-semibold truncate">{value}</p>
                  </div>
                  {key === "Account Number" ? (
                    <button
                      onClick={() => copyToClipboard(value, key)}
                      className="ml-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors duration-200 flex-shrink-0"
                      title={`Copy ${key}`}
                    >
                      {copiedField === key ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
