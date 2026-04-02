import React from "react";
import { Page } from "../../../../Types/Cbt/student";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import {
  examHistory,
  student,
  subjectPerformance,
  upcomingExams,
} from "../../../../constants/StudentCbtConstant";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { StatCard } from "../../../../components/Cbt/student/UI/StatCard";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { useNavigate } from "react-router-dom";

const StudentCbtDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Banner */}
      <Card cls="p-6 bg-linear-to-r from-orange-400 to-orange-500 border-0 text-white overflow-hidden relative">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative">
          <p className="text-orange-200 text-sm font-medium">Welcome back 👋</p>
          <h2 className="text-2xl md:text-3xl font-bold mt-1">{student.name}</h2>
          <p className="text-orange-200 text-sm mt-1">
            {student.dept} · {student.level} · {student.id}
          </p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Exams Taken" value="12" sub="This semester" icon="exam" color="orange" />
        <StatCard
          label="Avg. Score"
          value="74%"
          sub="+3% from last month"
          icon="performance"
          color="blue"
        />
        <StatCard
          label="Best Grade"
          value="A+"
          sub="Intro to Programming"
          icon="trophy"
          color="green"
        />
        <StatCard label="Upcoming" value="3" sub="Next: Mar 27" icon="clock" color="purple" />
      </div>

      {/* Upcoming Exams + Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card cls="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Upcoming Exams</h3>
            <Btn variant="ghost" size="sm" onClick={() => navigate("/cbt/student/exams")} cls="!text-orange-500">
              View all <Icon name="chevronRight" size={14} />
            </Btn>
          </div>
          <div className="space-y-3">
            {upcomingExams.map((exam, i) => (
              <div
                key={exam.id}
                className={`flex items-center gap-4 p-3 rounded-xl ${
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
                  <p className="text-sm font-semibold text-gray-900 truncate">{exam.subject}</p>
                  <p className="text-xs text-gray-400">
                    {exam.date} · {exam.time}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-medium text-gray-700">{exam.duration}min</p>
                  <p className="text-xs text-gray-400">{exam.questions}Q</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card cls="lg:col-span-2 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Performance by Subject</h3>
          <div className="space-y-4">
            {subjectPerformance.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{s.subject}</span>
                  <span className="font-bold text-gray-900">{s.score}%</span>
                </div>
                <ProgressBar
                  value={s.score}
                  color={
                    s.score >= 80 ? "bg-green-500" : s.score >= 60 ? "bg-orange-500" : "bg-red-400"
                  }
                />
              </div>
            ))}
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
              {examHistory.slice(0, 3).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 pr-4 font-medium text-gray-900">{r.subject}</td>
                  <td className="py-3 pr-4 text-gray-500">{r.date}</td>
                  <td className="py-3 pr-4 font-bold text-gray-900">{r.score}%</td>
                  <td className="py-3 pr-4">
                    <Badge
                      text={r.grade}
                      variant={
                        r.grade.startsWith("A") ? "green" : r.grade === "F" ? "red" : "orange"
                      }
                    />
                  </td>
                  <td className="py-3">
                    <Badge text={r.status} variant={r.status === "passed" ? "green" : "red"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentCbtDashboard;
