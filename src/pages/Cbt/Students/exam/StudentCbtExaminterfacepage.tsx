import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Exam, Page } from "../../../../Types/Cbt/student";
import { sampleQuestions } from "../../../../constants/StudentCbtConstant";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { ProgressBar } from "../../../../components/Cbt/student/UI/ProgressBar";
import { Modal } from "../../../../components/Cbt/student/UI/Modal";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { useAuth } from "../../../../Context/Auth/useAuth";

// Type for question from API
interface Question {
  id: string;
  examinationId: string;
  questionType: string;
  questionText: string;
  answerOptions: AnswerOption[];
}

interface AnswerOption {
  id: string;
  questionId: string | null;
  examinationQuestionId: string;
  text: string;
  isCorrect: boolean;
}

// Type for answer submission
interface AnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

interface SubmitPayload {
  sessionId: string;
  studentId: string | undefined;
  answers: AnswerSubmission[];
}

interface StudentCbtExamInterfacePageProps {
  exam: Exam | null;
}

const StudentCbtExamInterfacePage: React.FC<StudentCbtExamInterfacePageProps> = ({ exam }) => {
  const { cbtUser } = useAuth()
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // Store questionId -> selectedOptionId
  const [timeLeft, setTimeLeft] = useState((exam?.duration ?? 90) * 60);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [questionsFromDb, setQuestionsFromDb] = useState<Question[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const formattedAnswers: AnswerSubmission[] = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId
    }));

    console.log(formattedAnswers)
    
    try {
      // Format answers for submission
      
      const payload: SubmitPayload = {
        sessionId: sessionId || "temp-session-id", // Replace with actual session ID from your API
        studentId: cbtUser?.id, // Replace with actual student ID from your context/auth
        answers: formattedAnswers
      };
      
      // Call your submit API endpoint
      // await cbtStudentService.submitExam(params.id, payload);
      
      // Calculate score based on isCorrect from the data
      let correctCount = 0;
      questionsFromDb.forEach((question) => {
        const selectedOptionId = answers[question.id];
        if (selectedOptionId) {
          const selectedOption = question.answerOptions.find(opt => opt.id === selectedOptionId);
          if (selectedOption?.isCorrect) {
            correctCount++;
          }
        }
      });
      
      setScore(correctCount);
      setSubmitted(true);
      setShowSubmit(false);
    } catch (error) {
      console.error("Error submitting exam:", error);
      // Handle error - show error message to user
      alert("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  const getExamQuestions = async () => {
    try {
      const res = await cbtStudentService.getExamByExamId(params.id);
      console.log(res);
      setQuestionsFromDb(res);
      
      // Initialize session if needed
      // if (res && res.length > 0) {
      //   // You might want to create a session here or get from somewhere
      //   const sessionResponse = await cbtStudentService.createExamSession(params.id);
      //   setSessionId(sessionResponse.sessionId);
      //   // Get student ID from your auth context/storage
      //   const userData = JSON.parse(localStorage.getItem('user') || '{}');
      //   setStudentId(userData.id);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExamQuestions();
  }, []);

  // Result screen
  if (submitted) {
    const pct = Math.round((score / questionsFromDb.length) * 100);
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
            {score} / {questionsFromDb.length} correct
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

  if (questionsFromDb.length === 0) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <Card cls="p-8 text-center">
          <p>Loading questions...</p>
        </Card>
      </div>
    );
  }

  const currentQuestion = questionsFromDb[current];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      {/* Header / Timer */}
      <Card cls="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-bold text-gray-900">{exam?.subject}</h2>
            <p className="text-xs text-gray-400">
              {exam?.code} · {questionsFromDb.length} Questions
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
          <ProgressBar value={Object.keys(answers).length} max={questionsFromDb.length} />
          <p className="text-xs text-gray-400 mt-1">
            {Object.keys(answers).length} of {questionsFromDb.length} answered
          </p>
        </div>
      </Card>

      {/* Question */}
      <Card cls="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Q{current + 1}
          </span>
          <span className="text-xs text-gray-400">of {questionsFromDb.length}</span>
        </div>
        <p className="text-base font-semibold text-gray-900 mb-6">{currentQuestion?.questionText}</p>
        <div className="space-y-3">
          {currentQuestion?.answerOptions?.map((opt, i) => (
            <button
              key={opt.id}
              onClick={() => setAnswers((prev) => ({ 
                ...prev, 
                [currentQuestion.id]: opt.id 
              }))}
              className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium
                ${answers[currentQuestion.id] === opt.id
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 text-gray-700"
                }`}
            >
              <span
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  answers[currentQuestion.id] === opt.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt?.text}
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
          {questionsFromDb.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                ${i === current
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : answers[questionsFromDb[i].id] !== undefined
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500 hover:bg-orange-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {current < questionsFromDb.length - 1 ? (
          <Btn variant="primary" onClick={() => setCurrent((c) => c + 1)}>
            Next <Icon name="chevronRight" size={16} />
          </Btn>
        ) : (
          <Btn variant="primary" onClick={() => setShowSubmit(true)} disabled={isSubmitting}>
            Submit Exam
          </Btn>
        )}
      </div>

      {/* Submit Modal */}
      <Modal show={showSubmit} onClose={() => setShowSubmit(false)} title="Submit Exam?">
        <p className="text-gray-600 mb-2">
          You have answered <strong>{Object.keys(answers).length}</strong> of{" "}
          <strong>{questionsFromDb.length}</strong> questions.
        </p>
        {Object.keys(answers).length < questionsFromDb.length && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 flex gap-2 text-yellow-700 text-sm">
            <Icon name="warning" size={16} />
            <span>{questionsFromDb.length - Object.keys(answers).length} questions unanswered.</span>
          </div>
        )}
        <p className="text-gray-500 text-sm mb-6">
          Once submitted, you cannot return to the exam.
        </p>
        <div className="flex gap-3 justify-end">
          <Btn variant="ghost" onClick={() => setShowSubmit(false)}>
            Continue Exam
          </Btn>
          <Btn variant="danger" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Yes, Submit"}
          </Btn>
        </div>
      </Modal>
    </div>
  );
};

export default StudentCbtExamInterfacePage;