import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchStudentExamResultsFailure,
  fetchStudentExamResultsStart,
  fetchStudentExamResultsSuccess,
} from "../../../../Store/cbt/student/studentExamResultSlice";

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
  const passed = status?.toLowerCase() === "passed";
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        passed
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </span>
  );
};

const CompletedExam = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cbtUser } = useAuth();

  const examResults = useSelector((state: RootState) => state.getStudentExamResult.listRecords);
  const resultsError = useSelector((state: RootState) => state.getStudentExamResult.error);

  useEffect(() => {
    if (!cbtUser?.id) return;

    const fetchResults = async () => {
      dispatch(fetchStudentExamResultsStart());
      try {
        const response = await cbtStudentService.getStudentExamResults(cbtUser.id);
        dispatch(fetchStudentExamResultsSuccess(response?.data ?? response ?? []));
      } catch (err: any) {
        dispatch(fetchStudentExamResultsFailure(err?.message ?? "Unable to load results."));
      }
    };

    fetchResults();
  }, [cbtUser?.id, dispatch]);

  const averageScore =
    examResults.length > 0
      ? Math.round(examResults.reduce((acc: number, r: any) => acc + (r.score ?? 0), 0) / examResults.length)
      : 0;

  const passedCount = examResults.filter((r: any) => r.status?.toLowerCase() === "passed").length;

  return (
    <div className="py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Completed Exams</h1>
        <p className="text-gray-600">Review your exam results and performance</p>
      </div>

      {resultsError && (
        <div className="mb-6 p-4 rounded-lg border border-red-100 bg-red-50 text-sm text-red-600">
          {resultsError}
        </div>
      )}

      {examResults.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          You haven't completed any exams yet.
        </p>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{examResults.length}</div>
              <div className="text-gray-600">Exams Completed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
              <div className="text-gray-600">Average Score</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">
                {passedCount}/{examResults.length}
              </div>
              <div className="text-gray-600">Exams Passed</div>
            </div>
          </div>

          {/* Completed Exams List */}
          <div className="space-y-6">
            {examResults.map((exam: any, idx: number) => (
              <div
                key={exam.id ?? idx}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Left Section - Exam Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                          {exam.subject}
                        </h2>
                        {getStatusBadge(exam.status)}
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <span>Submitted {exam.date}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <ProgressBar percentage={exam.score} />
                      </div>
                    </div>

                    {/* Right Section - Action Button */}
                    <div className="lg:w-48 flex flex-col gap-3">
                      <button
                        onClick={() => navigate(`/cbt/student/exams/result/${exam.id}`)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View Detailed Results
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CompletedExam;