import React, { useState } from "react";
import { FileText, Clock, Users, BarChart2, Plus, LogOut } from "lucide-react";

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState("myExams");

  const exams = [
    {
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      class: "Grade 12A",
      date: "2025-11-15",
      duration: "90 min",
      progress: "0/35",
      status: "Scheduled",
    },
    {
      title: "Physics Mid-term Test",
      subject: "Physics",
      class: "Grade 11B",
      date: "2025-10-28",
      duration: "60 min",
      progress: "12/28",
      status: "Active",
    },
    {
      title: "Chemistry Quiz",
      subject: "Chemistry",
      class: "Grade 10A",
      date: "2025-10-20",
      duration: "30 min",
      progress: "32/32",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Educat </h1>
          <p className="text-sm text-gray-500">Teacher Dashboard</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h2 className="font-semibold">Dr. Sarah Johnson</h2>
            <p className="text-sm text-gray-500">aj@s</p>
          </div>
          <button onClick={() => (window.location.href = "/studentscbt")} className="flex items-center space-x-2 bg-orange-100 hover:bg-orange-200 text-orange-600 px-3 py-1 rounded-md">
            <LogOut className="w-4 h-4" />
            <span> Logout</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
        <div className="bg-white border border-orange-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-gray-600 font-medium">Total Exams</h3>
            <p className="text-3xl font-bold text-orange-600">24</p>
          </div>
          <FileText className="text-orange-400 w-8 h-8" />
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-gray-600 font-medium">Active Exams</h3>
            <p className="text-3xl font-bold text-orange-600">3</p>
          </div>
          <Clock className="text-green-500 w-8 h-8" />
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-gray-600 font-medium">Total Students</h3>
            <p className="text-3xl font-bold text-orange-600">156</p>
          </div>
          <Users className="text-purple-500 w-8 h-8" />
        </div>

        <div className="bg-white border border-orange-100 rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-gray-600 font-medium">Avg. Performance</h3>
            <p className="text-3xl font-bold text-orange-600">78%</p>
          </div>
          <BarChart2 className="text-orange-500 w-8 h-8" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3 bg-orange-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab("myExams")}
              className={`px-5 py-1 rounded-full font-medium ${
                activeTab === "myExams"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:text-orange-600"
              }`}
            >
              My Exams
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-5 py-1 rounded-full font-medium ${
                activeTab === "results"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:text-orange-600"
              }`}
            >
              Results
            </button>
          </div>

          <button
            onClick={() => (window.location.href = "/teachercbt")}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Create New Exam
          </button>
        </div>

        {/* Tabs */}
        {activeTab === "myExams" ? (
          <div className="bg-white p-6 rounded-xl border border-orange-100 shadow-sm">
            <h3 className="font-semibold mb-2 text-gray-800">Exam Management</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create, edit, and manage your exams
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-orange-100 text-gray-700 text-sm">
                    <th className="text-left p-3">Exam Title</th>
                    <th className="text-left p-3">Subject</th>
                    <th className="text-left p-3">Class</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Progress</th>
                    <th className="text-left p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, i) => (
                    <tr
                      key={i}
                      className="border-b border-orange-100 hover:bg-orange-50 transition"
                    >
                      <td className="p-3 font-medium text-orange-600">{exam.title}</td>
                      <td className="p-3">{exam.subject}</td>
                      <td className="p-3">{exam.class}</td>
                      <td className="p-3">{exam.date}</td>
                      <td className="p-3">{exam.duration}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {exam.progress} completed
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            exam.status === "Active"
                              ? "bg-black text-white"
                              : exam.status === "Scheduled"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-orange-200 text-orange-800"
                          }`}
                        >
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl border border-orange-100 shadow-sm text-center">
            <h3 className="font-semibold mb-2 text-gray-800">Recent Results</h3>
            <p className="text-sm text-gray-500 mb-4">
              View and analyze student performance
            </p>
            <BarChart2 className="mx-auto w-12 h-12 text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">
              Select an exam from the Exams tab to view results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
