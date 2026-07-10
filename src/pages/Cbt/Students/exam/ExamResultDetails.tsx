import React, { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import {
  fetchStudentExamResultsFailure,
  fetchStudentExamResultsStart,
  fetchStudentExamResultsSuccess,
} from "../../../../Store/cbt/student/studentExamResultSlice";

const ExamResultDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { resultId } = useParams<{ resultId: string }>();
  const { cbtUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"summary" | "review">("summary");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const examResults = useSelector((state: RootState) => state.getStudentExamResult.listRecords);
  const result = examResults.find((r) => String(r.id) === resultId);

  // Don't assume CompletedExam already populated the store — fetch directly
  // if this result isn't there yet (e.g. direct link, refresh, deep link).
  useEffect(() => {
    if (result || !cbtUser?.id) return;

    const fetchResults = async () => {
      setFetching(true);
      setFetchError(null);
      dispatch(fetchStudentExamResultsStart());
      try {
        const response = await cbtStudentService.getStudentExamResults(cbtUser.id);
        dispatch(fetchStudentExamResultsSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        const message =
          err?.response?.data?.responseMessage ?? err?.message ?? "Unable to load this result.";
        dispatch(fetchStudentExamResultsFailure(message));
        setFetchError(message);
      } finally {
        setFetching(false);
      }
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cbtUser?.id, resultId]);

  const getStatusBadge = (status?: string) => {
    const passed = status?.toLowerCase() === "passed";
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-semibold ${
          passed
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200"
        }`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  if (fetching) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div>
          <BiArrowBack className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)} />
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center text-gray-400">
          Loading your result...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div>
          <BiArrowBack className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)} />
        </div>
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10 text-center text-gray-400">
          {fetchError ?? "Couldn't find this result. It may not have loaded yet — try going back to Completed Exams and opening it from there."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div>
        <BiArrowBack className="w-8 h-8 cursor-pointer" onClick={() => navigate(-1)} />
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-700 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
              <h2 className="text-2xl font-semibold capitalize">{result.subject}</h2>
            </div>
            {getStatusBadge(result.status)}
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span>Subject: {result.subject}</span>
              <span>•</span>
              <span>Submitted: {result.date}</span>
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Score</h3>
            <div className="text-6xl font-bold text-blue-600 mb-2">{result.score}%</div>
            <div className="text-xl text-gray-600 mb-4">Grade: {result.grade}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === "summary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === "review"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Question Review
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "summary" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{result.date}</div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{result.grade}</div>
                  <div className="text-sm text-gray-600">Grade</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{result.score}%</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Score</span>
                    <span className="text-lg font-bold text-gray-800">{result.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="h-4 rounded-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Question Review</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                A per-question breakdown isn't available yet — the API doesn't currently return
                individual answers for a completed exam, only the final score. Once that endpoint
                exists, this tab will show each question, your answer, and the correct answer.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/cbt/student/dashboard")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultDetails;