import React, { useState } from "react";
import CompletedExam from "./CompletedExam";
import { useNavigate } from "react-router-dom";

type ExamStatus = "upcoming" | "active" | "completed";

interface Exam {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  questions: number;
  duration: number;
  date: string;
  dueDate: string;
  status: ExamStatus;
  instructions: string;
  availableDate?: string;
}

const StudentExamDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available");

  const availableExams: Exam[] = [
    {
      id: 1,
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      teacher: "Dr. Sarah Johnson",
      questions: 50,
      duration: 90,
      date: "2025-11-15",
      dueDate: "2025-11-15 23:59",
      status: "upcoming",
      instructions: "Calculators are allowed. Show all working.",
      availableDate: "2025-11-15",
    },
    {
      id: 2,
      title: "Physics Mid-term Test",
      subject: "Physics",
      teacher: "Prof. Michael Chen",
      questions: 30,
      duration: 60,
      date: "2025-10-28",
      dueDate: "2025-10-28 16:00",
      status: "active",
      instructions: "Answer all questions. Time limit strictly enforced.",
    },
  ];

  const completedExams: Exam[] = [
    {
      id: 3,
      title: "Chemistry Quiz",
      subject: "Chemistry",
      teacher: "Dr. Emily Watson",
      questions: 20,
      duration: 30,
      date: "2025-10-20",
      dueDate: "2025-10-20 14:00",
      status: "completed",
      instructions: "Basic chemistry principles.",
    },
    {
      id: 4,
      title: "Biology Mid-term",
      subject: "Biology",
      teacher: "Prof. James Wilson",
      questions: 40,
      duration: 75,
      date: "2025-10-18",
      dueDate: "2025-10-18 15:30",
      status: "completed",
      instructions: "Cell biology and genetics.",
    },
    {
      id: 5,
      title: "Computer Science Test",
      subject: "Computer Science",
      teacher: "Dr. Lisa Zhang",
      questions: 25,
      duration: 45,
      date: "2025-10-15",
      dueDate: "2025-10-15 11:00",
      status: "completed",
      instructions: "Programming fundamentals.",
    },
  ];

  const getStatusBadge = (status: ExamStatus) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700 border-blue-200",
      active: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-600 border-gray-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getActionButton = (exam: Exam) => {
    if (exam.status === "active") {
      return (
        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
          Start Exam
        </button>
      );
    } else if (exam.status === "upcoming") {
      return (
        <button
          disabled
          className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
        >
          Available on {exam.availableDate}
        </button>
      );
    } else {
      return (
        <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          View Results
        </button>
      );
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exams Dashboard</h1>
          <p className="text-gray-600">Manage and take your exams</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-3 px-4 rounded-md text-lg font-semibold transition-colors ${
              activeTab === "available"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Available Exams ({availableExams.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 px-4 rounded-md text-lg font-semibold transition-colors ${
              activeTab === "completed"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Completed ({completedExams.length})
          </button>
        </div>

        {/* Exams Grid */}
        <div className="grid gap-6">
          {activeTab === "available" &&
            availableExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
                        {getStatusBadge(exam.status)}
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <span className="font-semibold">{exam.subject}</span>
                        <span className="mx-2">•</span>
                        <span>{exam.teacher}</span>
                      </div>

                      {/* Exam Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">{exam.questions}</div>
                          <div className="text-sm text-gray-600">Questions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-800">{exam.duration}</div>
                          <div className="text-sm text-gray-600">Minutes</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-800">{exam.date}</div>
                          <div className="text-sm text-gray-600">Date</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-bold text-gray-800">
                            {exam.dueDate.split(" ")[1]}
                          </div>
                          <div className="text-sm text-gray-600">Due</div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Instructions:</h3>
                        <p className="text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          {exam.instructions}
                        </p>
                      </div>

                      {/* Available Date for Upcoming Exams */}
                      {exam.status === "upcoming" && exam.availableDate && (
                        <div className="flex items-center text-blue-600 bg-blue-50 border border-blue-100 rounded-lg p-3">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Available on {exam.availableDate}
                        </div>
                      )}
                    </div>

                    {/* Right Section - Action Button */}
                    <button onClick={()=> navigate('/cbt/student/exam/:id')} className="lg:w-48">{getActionButton(exam)}</button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {
            activeTab === 'completed' && <CompletedExam />
        }
      </div>
    </div>
  );
};

export default StudentExamDashboard;
