import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

const CreateExam = () => {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => (window.location.href = "/teacherDashBoard")}
            className="flex items-center text-orange-500 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Create New Exam</h1>
        </div>
        <button className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
          <Save className="w-4 h-4 mr-2" /> Save Exam
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 mb-6 bg-orange-100 rounded-full p-1 w-fit">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-5 py-1 rounded-full font-medium ${
            activeTab === "details"
              ? "bg-orange-500 text-white"
              : "text-gray-700 hover:text-orange-600"
          }`}
        >
          Exam Details
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-5 py-1 rounded-full font-medium ${
            activeTab === "questions"
              ? "bg-orange-500 text-white"
              : "text-gray-700 hover:text-orange-600"
          }`}
        >
          Questions (0)
        </button>
      </div>

      {/* Form */}
      {activeTab === "details" ? (
        <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-800">Basic Information</h3>
          <p className="text-sm text-gray-500 mb-4">
            Set up the basic details for your exam
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Exam Title *</label>
              <input
                type="text"
                placeholder="e.g., Mathematics Final Exam"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none">
                <option>Select subject</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Class *</label>
              <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none">
                <option>Select class</option>
                <option>Grade 10A</option>
                <option>Grade 11B</option>
                <option>Grade 12A</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
              <input
                type="number"
                placeholder="60"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Scheduled Date *</label>
              <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Passing Score (%)</label>
              <input
                type="number"
                placeholder="50"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">Exam Instructions</label>
            <textarea
              placeholder="Enter instructions for students taking this exam..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none h-28"
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm text-center text-gray-500">
          <p>No questions added yet. You can add questions here soon.</p>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
