import React, { useState } from "react";

type ExamStatus = "active" | "inactive";

interface Exam {
  subjectName: string;
  teacher: string;
  question: number;
  status: ExamStatus;
  duration: number;
  date: string;
  time: string;
  dueTime: string;
  instruction: string;
}

type TabKey = "available" | "completed";

const StudentCbtExam = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("available");

  const tabs: { id: TabKey; label: string }[] = [
    { id: "available", label: "Available" },
    { id: "completed", label: "Completed" },
  ];

  const exams: Exam[] = [
    {
      subjectName: "Mathematics",
      teacher: "Prof. Michael Brown",
      question: 30,
      status: "active",
      duration: 30,
      date: "2025-10-30",
      time: "12:00:00",
      dueTime: "12:00:00",
      instruction: "Please read all instructions before beginning.",
    },
  ];

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Exams</h1>
        <p className="text-gray-600 mb-6">Manage and take your exams</p>

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-4 px-1 text-lg font-medium transition-all relative ${
                activeTab === tab.id ? "text-orange-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* AVAILABLE EXAMS AS CARDS */}
        {activeTab === "available" && (
          <div className="grid grid-cols-span-1 md:grid-cols-span-2 lg:grid-cols-span-3 gap-6">
            {exams.map((exam, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{exam.subjectName}</h2>
                      <p className="text-sm text-gray-600 mt-1">{exam.teacher}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        exam.status === "active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>

                  {/* Exam Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">{exam.question} Questions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">{exam.duration} mins</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Date & Time */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Date</span>
                      <span className="text-sm text-gray-900">{exam.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Time</span>
                      <span className="text-sm text-gray-900">{exam.time}</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h3>
                    <p className="text-sm text-gray-600 bg-orange-50 border border-orange-100 rounded-lg p-3">
                      {exam.instruction}
                    </p>
                  </div>

                  {/* Action Button */}
                  {exam.status === "active" ? (
                    <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-sm hover:shadow-md">
                      Start Exam Now
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed border border-gray-200"
                    >
                      Exam Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPLETED EXAMS */}
        {activeTab === "completed" && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Completed Exams</h3>
              <p className="text-gray-500">
                Your completed exams will appear here once you finish taking them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCbtExam;
