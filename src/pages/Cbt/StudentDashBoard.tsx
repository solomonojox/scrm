import React, { useState } from "react";
import { FaClock, FaCheckCircle, FaFileAlt, FaChartLine } from "react-icons/fa";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("available");

  const availableExams = [
    {
      id: 1,
      title: "Mathematics Final Exam",
      subject: "Mathematics • Dr. Sarah Johnson",
      questions: 50,
      duration: "90 Minutes",
      date: "2025-11-15",
      due: "2025-11-15 23:59",
      status: "Upcoming",
      instructions: "Calculators are allowed. Show all working.",
      startable: false,
    },
    {
      id: 2,
      title: "Physics Mid-term Test",
      subject: "Physics • Prof. Michael Chen",
      questions: 30,
      duration: "60 Minutes",
      date: "2025-10-28",
      due: "2025-10-28 16:00",
      status: "Active",
      instructions: "Answer all questions. Time limit strictly enforced.",
      startable: true,
    },
  ];

  const completedExams = [
    {
      id: 1,
      title: "Chemistry Quiz",
      subject: "Chemistry • Submitted 2025-10-20 10:45 AM",
      score: "90%",
      points: "18/20",
      color: "text-green-600",
      progress: "90%",
      feedback: "Excellent work! Keep it up.",
    },
    {
      id: 2,
      title: "Biology Test",
      subject: "Biology • Submitted 2025-10-18 14:30 PM",
      score: "80%",
      points: "32/40",
      color: "text-orange-500",
      progress: "80%",
      feedback: "Good understanding of concepts.",
    },
    {
      id: 3,
      title: "English Grammar Quiz",
      subject: "English • Submitted 2025-10-15 11:20 AM",
      score: "56%",
      points: "14/25",
      color: "text-red-500",
      progress: "56%",
      feedback: "Please review grammar rules.",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">Student Dashboard</h1>
          <p className="text-gray-600 text-sm">Educat CBT • Grade 12A</p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4">
          <FaFileAlt className="text-orange-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Total Exams</p>
            <p className="text-lg font-semibold">5</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-lg font-semibold">3</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4">
          <FaClock className="text-yellow-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-lg font-semibold">1</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-xl p-4 flex items-center space-x-4">
          <FaChartLine className="text-purple-500 text-2xl" />
          <div>
            <p className="text-gray-500 text-sm">Average Score</p>
            <p className="text-lg font-semibold">75%</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "available"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:text-orange-500"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Exams (2)
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold ${
            activeTab === "completed"
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:text-orange-500"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed (3)
        </button>
      </div>

      {/* Available Exams */}
      {activeTab === "available" && (
        <div className="space-y-4">
          {availableExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white shadow-sm border border-orange-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-orange-600">{exam.title}</h2>
                  <p className="text-sm text-gray-600">{exam.subject}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    exam.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center text-sm text-gray-600 mt-2 space-x-6">
                <p>📘 {exam.questions} Questions</p>
                <p>⏱ {exam.duration}</p>
                <p>📅 {exam.date}</p>
                <p>🕓 Due: {exam.due}</p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-md p-2 mt-3 text-sm">
                <strong className="text-orange-600">Instructions: </strong>
                {exam.instructions}
              </div>

              <div className="mt-3">
                {exam.startable ? (
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    Start Exam
                  </button>
                ) : (
                  <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
                    Available on {exam.date}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Exams */}
      {activeTab === "completed" && (
        <div className="space-y-4">
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white shadow-sm border border-orange-100 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-orange-600">{exam.title}</h2>
                  <p className="text-sm text-gray-600">{exam.subject}</p>
                </div>
                <p className={`text-lg font-bold ${exam.color}`}>{exam.score}</p>
              </div>

              <div className="mt-2 bg-gray-100 h-3 rounded-full">
                <div
                  className="bg-orange-500 h-3 rounded-full"
                  style={{ width: exam.progress }}
                ></div>
              </div>

              <p className="text-sm text-gray-600 mt-1">{exam.points} points</p>

              <div className="mt-2 bg-orange-50 border border-orange-100 rounded-md p-2 text-sm">
                <strong className="text-orange-600">Teacher Feedback: </strong>
                {exam.feedback}
              </div>

              <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                View Detailed Results
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
