import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Modal } from "../../../../components/Cbt/student/UI/Modal";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";

// NOTE: Swagger only documents the request shape for POST
// /api/ExamStudent/start/{studentId}/{examId} — the response body itself is
// unconfirmed. This normalizes a couple of likely field-name conventions
// (matching how the rest of this API names things: subjectName, durationMinutes,
// totalQuestions elsewhere). Tighten once a real response is seen.
interface RawOption {
  id?: string;
  optionId?: string;
  text?: string;
  optionText?: string;
}

interface RawQuestion {
  id?: string;
  questionId?: string;
  text?: string;
  questionText?: string;
  options?: RawOption[];
}

interface RawStartExamResponse {
  sessionId: string;
  examId?: string;
  subjectName?: string;
  durationMinutes?: number;
  questions?: RawQuestion[];
}

interface ExamOption {
  id: string;
  text: string;
}

interface ExamQuestion {
  id: string;
  text: string;
  options: ExamOption[];
}

// NOTE: submit response shape is also unconfirmed — normalized defensively below.
interface RawSubmitResponse {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  percentage?: number;
  percentageScore?: number;
  status?: string;
  passStatus?: string;
}

const StudentCbtExamInterfacePage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { cbtUser } = useAuth();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState<string>("");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOptionId
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<RawSubmitResponse | null>(null);

  // Start the exam session on mount
  useEffect(() => {
    if (!cbtUser?.id || !examId) return;

    const startSession = async () => {
      setLoadingSession(true);
      setSessionError(null);
      try {
        const response = await cbtStudentService.startExam(cbtUser?.id, examId);
        console.log("StartExam response:", response);
        const data: RawStartExamResponse = response?.data ?? response;

        const normalizedQuestions: ExamQuestion[] = (data.questions ?? []).map((q) => ({
          id: q.id ?? q.questionId ?? "",
          text: q.text ?? q.questionText ?? "",
          options: (q.options ?? []).map((o) => ({
            id: o.id ?? o.optionId ?? "",
            text: o.text ?? o.optionText ?? "",
          })),
        }));

        setSessionId(data.sessionId);
        setSubjectName(data.subjectName ?? "");
        setQuestions(normalizedQuestions);
        setTimeLeft((data.durationMinutes ?? 60) * 60);
      } catch (err: any) {
        setSessionError(
          err?.response?.data?.responseMessage ??
            err?.message ??
            "Unable to start this exam. Please try again.",
        );
      } finally {
        setLoadingSession(false);
      }
    };

    startSession();
  }, [cbtUser?.id, examId]);

  const handleSubmit = async () => {
    if (!sessionId || !cbtUser?.id) return;

    setSubmitting(true);
    setSubmitError(null);
    setShowSubmit(false);

    const payload = {
      sessionId,
      studentId: cbtUser.id,
      answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })),
    };

    try {
      const response = await cbtStudentService.submitExam(payload);
      setResult(response?.data ?? response ?? {});
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.responseMessage ??
          err?.message ??
          "Unable to submit your exam. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Countdown timer — auto-submits when it hits zero
  useEffect(() => {
    if (result || loadingSession || !sessionId) return;
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
  }, [result, loadingSession, sessionId]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const danger = timeLeft < 300;

  /* ── Loading / error states while starting the session ── */
  if (loadingSession) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto text-center text-gray-400 py-16">
        Starting your exam...
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <Card cls="p-8 text-center">
          <Icon name="warning" size={40} cls="text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 mb-6">{sessionError}</p>
          <Btn variant="primary" onClick={() => navigate("/cbt/student/exams")}>
            Back to Exams
          </Btn>
        </Card>
      </div>
    );
  }

  /* ── Result screen ── */
  if (result) {
    const percentage = result.percentage ?? result.percentageScore ?? 0;
    const status = result.status ?? result.passStatus ?? (percentage >= 60 ? "Passed" : "Failed");
    const passed = percentage >= 60;

    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto">
        <Card cls="p-8 text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <Icon
              name={passed ? "trophy" : "warning"}
              size={40}
              cls={passed ? "text-green-500" : "text-red-500"}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Exam Submitted!</h2>
          <p className="text-gray-500 mb-6">{subjectName}</p>
          <div
            className="text-5xl font-bold mb-2"
            style={{ color: passed ? "#22c55e" : "#ef4444" }}
          >
            {percentage}%
          </div>
          {result.correctAnswers !== undefined && result.totalQuestions !== undefined && (
            <p className="text-gray-500 mb-6">
              {result.correctAnswers} / {result.totalQuestions} correct
            </p>
          )}
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {status}
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

  if (questions.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-xl mx-auto text-center text-gray-400 py-16">
        No questions were returned for this exam.
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      {submitError && (
        <Card cls="p-4 border border-red-100 bg-red-50 text-sm text-red-600">{submitError}</Card>
      )}

      {/* Header / Timer */}
      <Card cls="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-900">{subjectName}</h2>
            <p className="text-xs text-gray-400">{questions.length} Questions</p>
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
          <ProgressBar value={Object.keys(answers).length} max={questions.length} />
          <p className="text-xs text-gray-400 mt-1">
            {Object.keys(answers).length} of {questions.length} answered
          </p>
        </div>
      </Card>

      {/* Question */}
      <Card cls="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Q{current + 1}
          </span>
          <span className="text-xs text-gray-400">of {questions.length}</span>
        </div>
        <p className="text-base font-semibold text-gray-900 mb-6">{q.text}</p>
        <div className="space-y-3">
          {q.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${
                  answers[q.id] === opt.id
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-700"
                }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  answers[q.id] === opt.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {String.fromCharCode(65 + q.options.indexOf(opt))}
              </span>
              {opt.text}
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
          {questions.map((question, i) => (
            <button
              key={question.id}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                ${
                  i === current
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : answers[question.id] !== undefined
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500 hover:bg-orange-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questions.length - 1 ? (
          <Btn variant="primary" onClick={() => setCurrent((c) => c + 1)}>
            Next <Icon name="chevronRight" size={16} />
          </Btn>
        ) : (
          <Btn variant="primary" disabled={submitting} onClick={() => setShowSubmit(true)}>
            {submitting ? "Submitting..." : "Submit Exam"}
          </Btn>
        )}
      </div>

      {/* Submit Modal */}
      <Modal show={showSubmit} onClose={() => setShowSubmit(false)} title="Submit Exam?">
        <p className="text-gray-600 mb-2">
          You have answered <strong>{Object.keys(answers).length}</strong> of{" "}
          <strong>{questions.length}</strong> questions.
        </p>
        {Object.keys(answers).length < questions.length && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2 text-yellow-700 text-sm">
            <Icon name="warning" size={16} />
            <span>{questions.length - Object.keys(answers).length} questions unanswered.</span>
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