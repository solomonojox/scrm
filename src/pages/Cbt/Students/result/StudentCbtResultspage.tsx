import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExamResult } from "../../../../Types/Cbt/student";
import { StatCard } from "../../../../components/Cbt/student/UI/StatCard";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { Modal } from "../../../../components/Cbt/student/UI/Modal";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchStudentExamResultsFailure,
  fetchStudentExamResultsStart,
  fetchStudentExamResultsSuccess,
} from "../../../../Store/cbt/student/studentExamResultSlice";

// Use the type from your Redux store
type StudentExamResult = {
  id: string | number;
  subject: string;
  date: string;
  score: number;
  grade: string;
  status: string;
  time?: string;
};

const StudentCbtResultsPage: React.FC = () => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [detail, setDetail] = useState<StudentExamResult | null>(null);

  // Get exam results from Redux store
  const examResults = useSelector((state: RootState) => state.getStudentExamResult.listRecords);
  const loading = useSelector((state: RootState) => state.getStudentExamResult.loading);
  const error = useSelector((state: RootState) => state.getStudentExamResult.error);

  // Fetch exam results when component mounts
  useEffect(() => {
    if (!cbtUser?.id) return;

    const fetchResults = async () => {
      dispatch(fetchStudentExamResultsStart());
      try {
        const response = await cbtStudentService.getStudentExamResults(cbtUser.id);
        dispatch(fetchStudentExamResultsSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        dispatch(fetchStudentExamResultsFailure(err?.message ?? "Unable to load results."));
      }
    };

    fetchResults();
  }, [cbtUser?.id, dispatch]);

  // Calculate statistics from exam results
  const totalExams = examResults?.length || 0;
  const passedExams = examResults?.filter((r: StudentExamResult) => 
    r.status?.toLowerCase() === "passed" || r.status?.toLowerCase() === "pass"
  )?.length || 0;
  const failedExams = examResults?.filter((r: StudentExamResult) => 
    r.status?.toLowerCase() === "failed" || r.status?.toLowerCase() === "fail"
  )?.length || 0;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading your exam results...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">⚠️ {error}</div>
          <Btn variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Btn>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!examResults || examResults.length === 0) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Exam Results Yet</h3>
          <p className="text-gray-500 text-sm">You haven't taken any exams. Start practicing to see your results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Exams" value={totalExams.toString()} icon="exam" color="orange" />
        <StatCard label="Passed" value={passedExams.toString()} sub={`${passRate}% pass rate`} icon="check" color="green" />
        <StatCard label="Failed" value={failedExams.toString()} sub="Needs improvement" icon="x" color="orange" />
      </div>

      {/* Results Table */}
      <Card cls="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Exam History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">ID</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Time</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {examResults.map((r: StudentExamResult, index: number) => (
                <tr key={r.id || index} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.subject}</td>
                  <td className="py-3 pr-4 text-gray-400 hidden sm:table-cell">{r.id}</td>
                  <td className="py-3 pr-4 text-gray-500">{r.date}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{r.score}%</span>
                      <div className="w-12 hidden lg:block">
                        <ProgressBar value={r.score} height="h-1.5" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      text={r.grade}
                      variant={r.grade?.startsWith("A") ? "green" : r.grade === "F" ? "red" : "orange"}
                    />
                  </td>
                  <td className="py-3 pr-4 text-gray-500 hidden md:table-cell">{r.time || "N/A"}</td>
                  <td className="py-3 pr-4">
                    <Badge 
                      text={r.status} 
                      variant={r.status?.toLowerCase() === "passed" || r.status?.toLowerCase() === "pass" ? "green" : "red"} 
                    />
                  </td>
                  <td className="py-3">
                    <Btn
                      variant="ghost"
                      size="sm"
                      cls="!text-orange-500"
                      onClick={() => setDetail(r)}
                    >
                      👁 View
                    </Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal show={!!detail} onClose={() => setDetail(null)} title="Exam Detail">
        {detail && (
          <div className="space-y-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-orange-600 mb-1">{detail.score}%</p>
              <p className="text-sm text-gray-600">{detail.subject}</p>
            </div>
            {(
              [
                ["ID", detail.id],
                ["Date", detail.date],
                ["Time Taken", detail.time || "N/A"],
                ["Grade", detail.grade],
                ["Status", detail.status],
              ] as [string, string | number][]
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-900 capitalize">{String(v)}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCbtResultsPage;