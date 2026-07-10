import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CompletedExam from "./CompletedExam";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchStudentCatalogFailure,
  fetchStudentCatalogStart,
  fetchStudentCatalogSuccess,
} from "../../../../Store/cbt/student/studentCatalogSlice";

const StudentExamDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cbtUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"available" | "completed">("available");

  const catalogExams = useSelector((state: RootState) => state.getStudentCatalog.listRecords);
  const catalogError = useSelector((state: RootState) => state.getStudentCatalog.error);

  useEffect(() => {
    if (!cbtUser?.id) return;

    const fetchCatalog = async () => {
      dispatch(fetchStudentCatalogStart());
      try {
        const response = await cbtStudentService.getStudentCatalog(cbtUser.id);
        dispatch(fetchStudentCatalogSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        dispatch(fetchStudentCatalogFailure(err?.message ?? "Unable to load exams."));
      }
    };

    fetchCatalog();
  }, [cbtUser?.id, dispatch]);

  const availableExams = catalogExams.filter((e) => !e.alreadyTaken);
  const completedCount = catalogExams.filter((e) => e.alreadyTaken).length;

  const formatSchedule = (scheduledAt: string | null) => {
    if (!scheduledAt) {
      return {
        date: "Not Scheduled",
        time: "--",
      };
    }

    const d = new Date(scheduledAt);

    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const isExamStartable = (exam: any) => {
    // No questions
    if (exam.totalQuestions <= 0) return false;

    // Not scheduled
    if (!exam.scheduledAt) return false;

    // Scheduled in the future
    return new Date(exam.scheduledAt).getTime() <= Date.now();
  };

  const handleStartExam = (examId: string) => {
    // Navigating here is enough — StudentCbtExamInterfacePage itself calls
    // POST /api/CbtStudent/start/{studentId}/{examId} on mount to begin the session.
    navigate(`/cbt/student/exam/${examId}`);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Exams Dashboard</h1>
          <p className="text-gray-600">Manage and take your exams</p>
        </div>

        {catalogError && (
          <div className="mb-6 p-4 rounded-lg border border-red-100 bg-red-50 text-sm text-red-600">
            {catalogError}
          </div>
        )}

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
            Completed ({completedCount})
          </button>
        </div>

        {/* Exams Grid */}
        <div className="grid gap-6">
          {activeTab === "available" &&
            (availableExams.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No exams available right now.</p>
            ) : (
              availableExams.map((exam) => {
                const schedule = formatSchedule(exam.scheduledAt);
                const startable = isExamStartable(exam);

                return (
                  <div
                    key={exam.examId}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                            <h2 className="text-xl font-bold text-gray-800 capitalize">
                              {exam.subjectName}
                            </h2>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                startable
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-red-100 text-red-700 border-red-200"
                              }`}
                            >
                              {startable ? "Available" : "Unavailable"}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-4">
                            <span className="font-semibold">{exam.description}</span>
                          </div>

                          {/* Exam Details Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {exam.totalQuestions}
                              </div>
                              <div className="text-sm text-gray-600">Questions</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {exam.durationMinutes}
                              </div>
                              <div className="text-sm text-gray-600">Minutes</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-gray-800">{schedule.date}</div>
                              <div className="text-sm text-gray-600">Date</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm font-bold text-gray-800">{schedule.time}</div>
                              <div className="text-sm text-gray-600">Time</div>
                            </div>
                          </div>

                          {!startable && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 inline-block">
                              {!exam.scheduledAt
                                ? "This exam has not been scheduled yet."
                                : exam.totalQuestions <= 0
                                  ? "This exam has no questions yet."
                                  : `This exam opens on ${schedule.date} at ${schedule.time}.`}
                            </p>
                          )}
                        </div>

                        {/* Right Section - Action Button */}
                        <div className="lg:w-48 flex items-start">
                          {startable ? (
                            <button
                              onClick={() => handleStartExam(exam.examId)}
                              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                              Start Exam
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full bg-gray-200 text-gray-400 py-3 rounded-lg font-semibold cursor-not-allowed"
                            >
                              {!exam.scheduledAt
                                ? "Not Scheduled"
                                : exam.totalQuestions <= 0
                                  ? "No Questions"
                                  : "Not Yet Available"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ))}
        </div>

        {activeTab === "completed" && <CompletedExam />}
      </div>
    </div>
  );
};

export default StudentExamDashboard;
