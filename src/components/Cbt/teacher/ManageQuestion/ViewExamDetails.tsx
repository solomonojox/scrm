import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  BarChart2,
  Tag,
  Layers,
  CheckCircle,
  FileText,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { AllExamQuestionType, ExamQuestion } from "../../../../Types/Cbt/cbtTypes";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/cbtTeacherExamService";


interface Props {
  exam: AllExamQuestionType;
}

const ViewExamDetails: React.FC<Props> = ({ exam }) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const data = await cbtTeacherExamService.getExamQuestions(exam.id);
        setQuestions(data);
      } catch {
        // silently fail — questions section will show empty state
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [exam.id]);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":    return "bg-green-100 text-green-800 border border-green-200";
      case "COMPLETED": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "SCHEDULED": return "bg-orange-100 text-orange-800 border border-orange-200";
      default:          return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":    return <PlayCircle className="w-4 h-4 text-green-500" />;
      case "COMPLETED": return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:          return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getExamTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      JAMB:     "bg-purple-100 text-purple-700",
      WAEC:     "bg-teal-100 text-teal-700",
      GCE:      "bg-indigo-100 text-indigo-700",
      NECO:     "bg-pink-100 text-pink-700",
      INTERNAL: "bg-yellow-100 text-yellow-700",
    };
    return colors[type] ?? "bg-gray-100 text-gray-700";
  };

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="font-sans space-y-6">

      {/* ── Title + Badges ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{exam.title}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {exam.academicSession} · {capitalize(exam.term)} Term
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getExamTypeColor(exam.examType)}`}>
            {exam.examType}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exam.status)}`}>
            {getStatusIcon(exam.status)}
            {capitalize(exam.status)}
          </span>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <FileText className="w-5 h-5 text-orange-500" />,  label: "Total Questions", value: exam.totalQuestions,  bg: "bg-orange-50 border-orange-100" },
          { icon: <Users    className="w-5 h-5 text-blue-500"   />,  label: "Total Students",  value: exam.totalStudents,   bg: "bg-blue-50 border-blue-100"   },
          { icon: <BarChart2 className="w-5 h-5 text-green-500" />,  label: "Average Score",   value: exam.averageScore > 0 ? `${exam.averageScore.toFixed(1)}%` : "—", bg: "bg-green-50 border-green-100" },
          { icon: <Layers   className="w-5 h-5 text-purple-500" />,  label: "Progress",        value: `${exam.progress}%`,  bg: "bg-purple-50 border-purple-100" },
        ].map(({ icon, label, value, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-4 flex items-center gap-3`}>
            <div className="shrink-0">{icon}</div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress Bar ── */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Completion Progress</span>
          <span className="font-medium text-orange-600">{exam.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${exam.progress}%` }}
          />
        </div>
      </div>

      {/* ── Details Grid ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Exam Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <BookOpen className="w-4 h-4 text-orange-400" />,  label: "Subject",          value: exam.subjectName },
            { icon: <Tag      className="w-4 h-4 text-orange-400" />,  label: "Exam Type",        value: exam.examType },
            { icon: <Layers   className="w-4 h-4 text-orange-400" />,  label: "Term",             value: capitalize(exam.term) },
            { icon: <Calendar className="w-4 h-4 text-orange-400" />,  label: "Academic Session", value: exam.academicSession },
            { icon: <Clock    className="w-4 h-4 text-orange-400" />,  label: "Duration",         value: `${exam.durationMinutes} minutes` },
            { icon: <Calendar className="w-4 h-4 text-orange-400" />,  label: "Exam Date",        value: exam.examDate ?? "Not scheduled" },
            { icon: <Layers   className="w-4 h-4 text-orange-400" />,  label: "Class Level",      value: exam.classLevel ?? "Not assigned" },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-4 border border-orange-100 rounded-xl bg-white"
            >
              <div className="shrink-0 w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                {icon}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Questions List ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Questions
          {questions.length > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {questions.length}
            </span>
          )}
        </h3>

        {loadingQuestions ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading questions…
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-orange-200 rounded-xl text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">No questions added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => {
              const isExpanded = expandedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  className="border border-orange-100 rounded-xl overflow-hidden"
                >
                  {/* Question header — click to expand */}
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-800 leading-snug">
                        {q.questionText}
                      </p>
                    </div>
                    {isExpanded
                      ? <ChevronUp   className="w-4 h-4 text-gray-400 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    }
                  </button>

                  {/* Options — shown when expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-orange-50 bg-orange-50/40">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Options
                      </p>
                      <ul className="space-y-2">
                        {q.options.map((opt) => (
                          <li
                            key={opt.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                              opt.isCorrect
                                ? "bg-green-50 border-green-200 text-green-800 font-semibold"
                                : "bg-white border-gray-100 text-gray-700"
                            }`}
                          >
                            {opt.isCorrect && (
                              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                            )}
                            {opt.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewExamDetails;