import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Exam, Page } from "../../../../Types/Cbt/student";
import { sampleQuestions } from "../../../../constants/StudentCbtConstant";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Modal } from "../../../../components/Cbt/student/UI/Modal";

interface StudentCbtExamInterfacePageProps {
  exam: Exam | null;
  // setPage: (page: Page) => void;
}

const StudentCbtExamInterfacePage: React.FC<StudentCbtExamInterfacePageProps> = ({ exam,  }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 90) * 60);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = () => {
    let s = 0;
    sampleQuestions.forEach((q, i) => {
      if (answers[i] === q.answer) s++;
    });
    setScore(s);
    setSubmitted(true);
    setShowSubmit(false);
  };

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const danger = timeLeft < 300;

  /* ── Result screen ── */
  if (submitted) {
    const pct = Math.round((score / sampleQuestions.length) * 100);
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <Card cls="p-8 text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              pct >= 60 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Icon
              name={pct >= 60 ? "trophy" : "warning"}
              size={40}
              cls={pct >= 60 ? "text-green-500" : "text-red-500"}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Exam Submitted!</h2>
          <p className="text-gray-500 mb-6">{exam?.subject}</p>
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: pct >= 60 ? "#22c55e" : "#ef4444" }}
          >
            {pct}%
          </div>
          <p className="text-gray-500 mb-6">
            {score} / {sampleQuestions.length} correct
          </p>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              pct >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {pct >= 80 ? "Excellent" : pct >= 60 ? "Passed" : "Failed"}
          </span>
          <div className="flex gap-3 mt-8 justify-center">
            <Btn variant="secondary" onClick={() => navigate("/cbt/student/results")}>
              View Results
            </Btn>
            <Btn variant="primary" onClick={() => navigate("/cbt/student/exams")}>
              Back to Exams
            </Btn>
          </div>
        </Card>
      </div>
    );
  }

  const q = sampleQuestions[current];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      {/* Header / Timer */}
      <Card cls="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-900">{exam?.subject}</h2>
            <p className="text-xs text-gray-400">
              {exam?.code} · {sampleQuestions.length} Questions
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg ${
              danger ? "bg-red-50 text-red-600 animate-pulse" : "bg-orange-50 text-orange-600"
            }`}
          >
            <Icon name="clock" size={18} />
            {mins}:{secs}
          </div>
        </div>
        <div className="mt-3">
          <ProgressBar value={Object.keys(answers).length} max={sampleQuestions.length} />
          <p className="text-xs text-gray-400 mt-1">
            {Object.keys(answers).length} of {sampleQuestions.length} answered
          </p>
        </div>
      </Card>

      {/* Question */}
      <Card cls="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Q{current + 1}
          </span>
          <span className="text-xs text-gray-400">of {sampleQuestions.length}</span>
        </div>
        <p className="text-base font-semibold text-gray-900 mb-6">{q.text}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${
                  answers[current] === i
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-700"
                }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  answers[current] === i ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Btn variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
          <Icon name="chevronLeft" size={16} /> Previous
        </Btn>

        <div className="flex gap-1 flex-wrap justify-center">
          {sampleQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                ${
                  i === current
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : answers[i] !== undefined
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500 hover:bg-orange-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < sampleQuestions.length - 1 ? (
          <Btn variant="primary" onClick={() => setCurrent((c) => c + 1)}>
            Next <Icon name="chevronRight" size={16} />
          </Btn>
        ) : (
          <Btn variant="primary" onClick={() => setShowSubmit(true)}>
            Submit Exam
          </Btn>
        )}
      </div>

      {/* Submit Modal */}
      <Modal show={showSubmit} onClose={() => setShowSubmit(false)} title="Submit Exam?">
        <p className="text-gray-600 mb-2">
          You have answered <strong>{Object.keys(answers).length}</strong> of{" "}
          <strong>{sampleQuestions.length}</strong> questions.
        </p>
        {Object.keys(answers).length < sampleQuestions.length && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2 text-yellow-700 text-sm">
            <Icon name="warning" size={16} />
            <span>{sampleQuestions.length - Object.keys(answers).length} questions unanswered.</span>
          </div>
        )}
        <p className="text-gray-500 text-sm mb-6">
          Once submitted, you cannot return to the exam.
        </p>
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={() => setShowSubmit(false)}>
            Continue Exam
          </Btn>
          <Btn variant="danger" onClick={handleSubmit}>
            Yes, Submit
          </Btn>
        </div>
      </Modal>
    </div>
  );
};

export default StudentCbtExamInterfacePage;