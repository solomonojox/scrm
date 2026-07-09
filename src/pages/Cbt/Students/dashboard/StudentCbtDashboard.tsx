import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { StatCard } from "../../../../components/Cbt/student/UI/StatCard";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchStudentDashboardFailure,
  fetchStudentDashboardStart,
  fetchStudentDashboardSuccess,
} from "../../../../Store/cbt/student/studentDashboardSlice";
import {
  fetchStudentCatalogFailure,
  fetchStudentCatalogStart,
  fetchStudentCatalogSuccess,
} from "../../../../Store/cbt/student/studentCatalogSlice";
import {
  fetchStudentPerformanceFailure,
  fetchStudentPerformanceStart,
  fetchStudentPerformanceSuccess,
} from "../../../../Store/cbt/student/studentPerformanceSlice";
import {
  fetchStudentExamResultsFailure,
  fetchStudentExamResultsStart,
  fetchStudentExamResultsSuccess,
} from "../../../../Store/cbt/student/studentExamResultSlice";

interface SubjectPerformance {
  subject: string;
  score: number;
}

interface NormalizedResult {
  id: string | number;
  subject: string;
  date: string;
  score: number;
  grade: string;
  status: string;
}

const StudentCbtDashboard = () => {
  const { cbtUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // --- Dashboard summary (name, school, totals, recentResults) ---
  const dashboardData = useSelector((state: RootState) => state.getStudentDashboard.listRecords);
  const dashboardError = useSelector((state: RootState) => state.getStudentDashboard.error);

  // --- Exam catalog (for Upcoming Exams) ---
  const catalogExams = useSelector((state: RootState) => state.getStudentCatalog.listRecords);

  // --- Performance by subject ---
  const performanceData = useSelector(
    (state: RootState) => state.getStudentPerformance.listRecords,
  );

  // --- Dedicated exam results endpoint ---
  const examResults = useSelector((state: RootState) => state.getStudentExamResult.listRecords);

  useEffect(() => {
    if (!cbtUser?.id) return;

    const fetchDashboard = async () => {
      dispatch(fetchStudentDashboardStart());
      try {
        const response = await cbtStudentService.getStudentDashboard(cbtUser.id);
        dispatch(fetchStudentDashboardSuccess(response?.data ?? response));
      } catch (err: any) {
        dispatch(
          fetchStudentDashboardFailure(
            err?.message ?? "Unable to load your dashboard right now. Please try again shortly.",
          ),
        );
      }
    };

    const fetchCatalog = async () => {
      dispatch(fetchStudentCatalogStart());
      try {
        const response = await cbtStudentService.getStudentCatalog(cbtUser.id);
        dispatch(fetchStudentCatalogSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        dispatch(fetchStudentCatalogFailure(err?.message ?? "Unable to load exams."));
      }
    };

    const fetchPerformance = async () => {
      dispatch(fetchStudentPerformanceStart());
      try {
        const response = await cbtStudentService.getStudentPerformance(cbtUser.id);
        dispatch(fetchStudentPerformanceSuccess(response?.data ?? response));
      } catch (err: any) {
        dispatch(fetchStudentPerformanceFailure(err?.message ?? "Unable to load performance."));
      }
    };

    const fetchResults = async () => {
      dispatch(fetchStudentExamResultsStart());
      try {
        const response = await cbtStudentService.getStudentExamResults(cbtUser.id);
        dispatch(fetchStudentExamResultsSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        dispatch(fetchStudentExamResultsFailure(err?.message ?? "Unable to load results."));
      }
    };

    fetchDashboard();
    fetchCatalog();
    fetchPerformance();
    fetchResults();
  }, [cbtUser?.id, dispatch]);

  const upcomingCount = dashboardData
    ? Math.max(dashboardData.totalExamsAvailable - dashboardData.totalExamsTaken, 0)
    : 0;

  // Exams the student hasn't taken yet, capped to the top 4 for the dashboard preview
  const availableExams = catalogExams.filter((e: any) => !e.alreadyTaken).slice(0, 4);

  const formatSchedule = (scheduledAt: string | null) => {
    if (!scheduledAt) return "Available now · not yet scheduled";
    const d = new Date(scheduledAt);
    return `${d.toLocaleDateString()} · ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const subjectPerformance: SubjectPerformance[] = (performanceData?.bySubject ?? []).map(
    (s: any) => ({
      subject: s.subjectName ?? s.subject ?? "Unknown",
      score: s.averageScore ?? s.score ?? 0,
    }),
  );

  // examResults already comes out of the slice in the normalized StudentExamResult
  // shape (subject/date/score/grade/status), so no further mapping needed here —
  // just fall back to the dashboard's recentResults if the dedicated endpoint is empty.
  const normalizedResults: NormalizedResult[] =
    examResults.length > 0
      ? examResults.map((r: any, idx: number) => ({ id: r.id ?? idx, ...r }))
      : (dashboardData?.recentResults ?? []).map((r: any, idx: number) => ({
          id: r.id ?? idx,
          ...r,
        }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Banner */}
      <Card cls="p-6 bg-linear-to-r from-orange-400 to-orange-500 border-0 text-white overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-orange-200 text-sm font-medium">Welcome back 👋</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">
            {dashboardData?.studentName ?? "Student"}
          </h2>
          <p className="text-orange-200 text-sm mt-1">{dashboardData?.schoolName}</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Btn
              variant="secondary"
              cls="!bg-white/20 !text-white hover:!bg-white/30 border border-white/30"
              onClick={() => navigate("/cbt/student/exams")}
            >
              <Icon name="play" size={16} /> Start Exam
            </Btn>

            <Btn
              variant="secondary"
              cls="!bg-white/20 !text-white hover:!bg-white/30 border border-white/30"
              onClick={() => navigate("/cbt/student/results")}
            >
              <Icon name="results" size={16} /> View Results
            </Btn>
          </div>
        </div>
      </Card>

      {dashboardError && (
        <Card cls="p-4 border border-red-100 bg-red-50 text-sm text-red-600">{dashboardError}</Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Exams Taken"
          value={String(dashboardData?.totalExamsTaken ?? 0)}
          sub="This semester"
          icon="exam"
          color="orange"
        />
        <StatCard
          label="Avg. Score"
          value={`${dashboardData?.averageScore ?? 0}%`}
          sub="Across all exams"
          icon="performance"
          color="blue"
        />
        <StatCard
          label="Upcoming"
          value={String(upcomingCount)}
          sub={`${dashboardData?.totalExamsAvailable ?? 0} available total`}
          icon="clock"
          color="purple"
        />
      </div>

      {/* Upcoming Exams + Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card cls="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Upcoming Exams</h3>
            <Btn
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cbt/student/exams")}
              cls="!text-orange-500"
            >
              View all <Icon name="chevronRight" size={14} />
            </Btn>
          </div>
          <div className="space-y-3">
            {availableExams.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No exams available right now.
              </p>
            ) : (
              availableExams.map((exam: any, i: number) => (
                <div
                  key={exam.examId}
                  onClick={() => navigate(`/cbt/student/exam/${exam.examId}`)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer ${
                    i === 0 ? "bg-orange-50 border border-orange-100" : "hover:bg-gray-50"
                  } transition-colors`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      i === 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon name="exam" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                      {exam.subjectName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {exam.description} · {formatSchedule(exam.scheduledAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-700">{exam.durationMinutes}min</p>
                    <p className="text-xs text-gray-400">{exam.totalQuestions}Q</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card cls="lg:col-span-2 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Performance by Subject</h3>
          <div className="space-y-4">
            {subjectPerformance.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No subject performance yet — take an exam to see your breakdown here.
              </p>
            ) : (
              subjectPerformance.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{s.subject}</span>
                    <span className="font-bold text-gray-900">{s.score}%</span>
                  </div>
                  <ProgressBar
                    value={s.score}
                    color={
                      s.score >= 80
                        ? "bg-green-500"
                        : s.score >= 60
                          ? "bg-orange-500"
                          : "bg-red-400"
                    }
                  />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Recent Results */}
      <Card cls="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Recent Results</h3>
          <Btn
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cbt/student/results")}
            cls="!text-orange-500"
          >
            View all <Icon name="chevronRight" size={14} />
          </Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide">
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {normalizedResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-400">
                    No exam results yet.
                  </td>
                </tr>
              ) : (
                normalizedResults.slice(0, 3).map((r, idx) => (
                  <tr key={r.id ?? idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-gray-900">{r.subject}</td>
                    <td className="py-3 pr-4 text-gray-500">{r.date}</td>
                    <td className="py-3 pr-4 font-bold text-gray-900">{r.score}%</td>
                    <td className="py-3 pr-4">
                      <Badge
                        text={r.grade}
                        variant={
                          r.grade?.startsWith("A") ? "green" : r.grade === "F" ? "red" : "orange"
                        }
                      />
                    </td>
                    <td className="py-3">
                      <Badge text={r.status} variant={r.status === "passed" ? "green" : "red"} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentCbtDashboard;
