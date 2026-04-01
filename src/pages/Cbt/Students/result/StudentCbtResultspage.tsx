import React, { useState } from "react";
import { ExamResult } from "../../../../Types/Cbt/student";
import { StatCard } from "../../../../components/Cbt/student/UI/StatCard";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import { examHistory } from "../../../../constants/StudentCbtConstant";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { Modal } from "../../../../components/Cbt/student/UI/Modal";


const StudentCbtResultsPage: React.FC = () => {
  const [detail, setDetail] = useState<ExamResult | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Exams" value="12" icon="exam" color="orange" />
        <StatCard label="Passed" value="10" sub="83% pass rate" icon="check" color="green" />
        <StatCard label="Failed" value="2" sub="Needs improvement" icon="x" color="orange" />
      </div>

      {/* Results Table */}
      <Card cls="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Exam History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide border-b border-gray-100">
                <th className="pb-3 pr-4">Subject</th>
                <th className="pb-3 pr-4 hidden sm:table-cell">Code</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Score</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Time</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {examHistory.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.subject}</td>
                  <td className="py-3 pr-4 text-gray-400 hidden sm:table-cell">{r.code}</td>
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
                      variant={r.grade.startsWith("A") ? "green" : r.grade === "F" ? "red" : "orange"}
                    />
                  </td>
                  <td className="py-3 pr-4 text-gray-500 hidden md:table-cell">{r.time}</td>
                  <td className="py-3 pr-4">
                    <Badge text={r.status} variant={r.status === "passed" ? "green" : "red"} />
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
                ["Code", detail.code],
                ["Date", detail.date],
                ["Time Taken", detail.time],
                ["Grade", detail.grade],
                ["Status", detail.status],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-900 capitalize">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentCbtResultsPage;