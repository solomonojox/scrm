// src/components/Admin/AdminTeacherAttendance.tsx
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Users, XCircle } from "lucide-react";
import {
  AttendanceSummary,
  AttendanceTab,
  TeacherAttendanceRecord,
} from "../../../Types/Admin/attendance";
import { teacherAttendanceService } from "../../../Services/Admin/teacherAttendanceService";
import { AdminTeacherAttendanceTable } from "./AdminTeacherAttendanceTable";
import { AdminTeacherAttendanceHistory } from "./AdminTeacherAttendanceHistory";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "../../../Context/Auth/useAuth";
import { Skeleton } from "../../../components/Admin/Skeleton";



const TABS: { id: AttendanceTab; label: string }[] = [
  { id: "today", label: "Today's Attendance" },
  // { id: "history", label: "Attendance History" },
];

interface SummaryCardConfig {
  key: keyof AttendanceSummary;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClasses: string;
  valueClasses: string;
}

const SUMMARY_CARDS: SummaryCardConfig[] = [
  {
    key: "totalTeachers",
    label: "Total Teachers",
    icon: Users,
    iconClasses: "bg-gray-100 text-gray-600",
    valueClasses: "text-gray-900",
  },
  {
    key: "clockedInToday",
    label: "Clocked In Today",
    icon: CheckCircle2,
    iconClasses: "bg-green-100 text-green-600",
    valueClasses: "text-green-700",
  },
  {
    key: "lateToday",
    label: "Late Today",
    icon: AlertTriangle,
    iconClasses: "bg-amber-100 text-amber-600",
    valueClasses: "text-amber-700",
  },
  {
    key: "notClockedIn",
    label: "Not Clocked In",
    icon: XCircle,
    iconClasses: "bg-red-100 text-red-600",
    valueClasses: "text-red-700",
  },
];

export function AdminTeacherAttendance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AttendanceTab>("today");

  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [todayRecords, setTodayRecords] = useState<TeacherAttendanceRecord[]>([]);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState<string | null>(null);

  // Adjust field name to match your auth payload (schoolId / schoolID / id).
  const schoolId = user?.schoolId || "";

  async function loadSummary() {
    if (!schoolId) {
      setIsSummaryLoading(false);
      return;
    }
    setIsSummaryLoading(true);
    try {
      const data = await teacherAttendanceService.getAttendanceSummary(schoolId);
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setIsSummaryLoading(false);
    }
  }

  async function loadToday() {
    if (!schoolId) {
      setTodayError("School ID not available. Please log in again.");
      setIsTodayLoading(false);
      return;
    }
    setIsTodayLoading(true);
    setTodayError(null);
    try {
      const data = await teacherAttendanceService.getTodayAttendance(schoolId);
      setTodayRecords(data);
    } catch {
      setTodayError("Unable to load teacher attendance.\nPlease try again.");
    } finally {
      setIsTodayLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
    loadToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-4 mb-4">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
            <FaSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="ml-2 bg-transparent outline-none w-full text-sm"
              aria-label="Search sessions"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center rounded-full px-3 py-1 space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
              className="w-14 h-14 rounded-full"
              alt="Admin avatar"
            />
            <div className="text-xs">
              <div className="font-semibold text-gray-700">
                {user?.schoolName?.toLocaleUpperCase() || "School"}
              </div>
              <div className="text-gray-400">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
          Home <span className="text-orange-500 font-semibold">: Staff Attendance</span>
        </p>
      </div>

      {/* Attendance overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <SummaryCard
            key={card.key}
            config={card}
            value={summary?.[card.key]}
            isLoading={isSummaryLoading}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === "today" ? (
        <AdminTeacherAttendanceTable
          records={todayRecords}
          isLoading={isTodayLoading}
          error={todayError}
          onRetry={loadToday}
        />
      ) : (
        <AdminTeacherAttendanceHistory />
      )}
    </div>
  );
}

function SummaryCard({
  config,
  value,
  isLoading,
}: {
  config: SummaryCardConfig;
  value: number | undefined;
  isLoading: boolean;
}) {
  const Icon = config.icon;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{config.label}</p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${config.iconClasses}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-7 w-12" />
      ) : (
        <p className={`mt-2 text-2xl font-semibold ${config.valueClasses}`}>
          {value ?? "—"}
        </p>
      )}
    </div>
  );
}