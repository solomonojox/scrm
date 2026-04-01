import React from "react";
import { StatCard } from "../../../../components/Cbt/student/UI/StatCard";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import { progressData, subjectPerformance } from "../../../../constants/StudentCbtConstant";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import Icon from "../../../../components/Cbt/student/UI/Icon";


const StudentCbtPerformancePage: React.FC = () => (
  <div className="p-4 md:p-6 space-y-6">
    {/* KPI stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Overall Avg" value="74%" sub="+3% this month" icon="performance" color="orange" />
      <StatCard label="Best Subject" value="94%" sub="Intro to Prog" icon="star" color="green" />
      <StatCard label="Weak Subject" value="45%" sub="Technical Writing" icon="warning" color="orange" />
      <StatCard label="Consistency" value="82%" sub="Score variation" icon="check" color="blue" />
    </div>

    {/* Progress Over Time */}
    <Card cls="p-5">
      <h3 className="font-bold text-gray-900 mb-6">Progress Over Time</h3>
      <div className="flex items-end gap-3 h-40">
        {progressData.map((d, i) => (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-700">{d.score}%</span>
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: `${(d.score / 100) * 120}px`,
                background: i === progressData.length - 1 ? "#f97316" : "#fed7aa",
              }}
            />
            <span className="text-xs text-gray-400">{d.month}</span>
          </div>
        ))}
      </div>
    </Card>

    {/* Subject Breakdown + Weak Areas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card cls="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Subject Breakdown</h3>
        <div className="space-y-4">
          {subjectPerformance.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-700 font-medium">{s.subject}</span>
                <span
                  className="font-bold"
                  style={{ color: s.score >= 80 ? "#22c55e" : s.score >= 60 ? "#f97316" : "#ef4444" }}
                >
                  {s.score}%
                </span>
              </div>
              <ProgressBar
                value={s.score}
                height="h-3"
                color={s.score >= 80 ? "bg-green-500" : s.score >= 60 ? "bg-orange-500" : "bg-red-400"}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card cls="p-5">
        <h3 className="font-bold text-gray-900 mb-4">Areas Needing Attention</h3>
        <div className="space-y-3">
          {subjectPerformance
            .filter((s) => s.score < 75)
            .map((s) => (
              <div
                key={s.subject}
                className={`p-4 rounded-xl border ${
                  s.score < 60
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 text-sm">{s.subject}</span>
                  <Badge text={`${s.score}%`} variant={s.score < 60 ? "red" : "yellow"} />
                </div>
                <p className="text-xs text-gray-500">
                  {s.score < 60
                    ? "Critical: Requires immediate attention and dedicated study time."
                    : "Below average: Focus more practice on this subject."}
                </p>
              </div>
            ))}

          {subjectPerformance
            .filter((s) => s.score >= 75)
            .map((s) => (
              <div
                key={s.subject}
                className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
              >
                <Icon name="check" size={18} cls="text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{s.subject}</p>
                  <p className="text-xs text-green-600">Great performance — keep it up!</p>
                </div>
                <Badge text={`${s.score}%`} variant="green" />
              </div>
            ))}
        </div>
      </Card>
    </div>
  </div>
);

export default StudentCbtPerformancePage;