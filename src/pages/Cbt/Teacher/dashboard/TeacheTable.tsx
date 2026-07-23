import React, { useCallback, useEffect } from "react";
import { CheckCircle, PlayCircle, FileText, RefreshCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchAllExamQuestionFailure,
  fetchAllExamQuestionStart,
  fetchAllExamQuestionSuccess,
} from "../../../../Store/cbt/allExamQuestionSlice";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/cbtTeacherExamService";

const getStatusIcon = (status: number) => {
  switch (status) {
    case 0:
      return <PlayCircle className="w-4 h-4 text-green-500" />;
    case 1:
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return "bg-green-100 text-green-800 border border-green-200";
    case 1:
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case 2:
      return "bg-orange-100 text-orange-800 border border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Completed";
    case 2:
      return "Scheduled";
    default:
      return "Unknown";
  }
};

const TeacheTable = () => {
  const dispatch = useDispatch<AppDispatch>();

  const listRecords = useSelector((state: RootState) => state.getAllExamQuestion.listRecords);
  const loading = useSelector((state: RootState) => state.getAllExamQuestion.loading);
  const error = useSelector((state: RootState) => state.getAllExamQuestion.error);

  const fetchExams = useCallback(async () => {
    dispatch(fetchAllExamQuestionStart());
    try {
      const data = await cbtTeacherExamService.getExams({ pageNumber: 1, pageSize: 5 });
      dispatch(fetchAllExamQuestionSuccess(data));
    } catch (err) {
      dispatch(fetchAllExamQuestionFailure((err as Error).message));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  // Only ever render the first 5, regardless of what the API returns
  const exams = listRecords?.slice(0, 5);

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>;

    const onRefresh = () => {
      fetchExams();
    };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exam Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            A quick overview of your recent exams and their statuses.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-orange-50">
            {["Exam Title", "Teacher' Name", "Examiner", "Status"].map((label) => (
              <th
                key={label}
                className="text-left p-3 font-semibold text-gray-700 border-b border-orange-200 whitespace-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exams?.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-base font-medium">No exams found</p>
                <p className="text-xs mt-1">Try adjusting your search or filters</p>
              </td>
            </tr>
          ) : (
            exams?.map((exam) => (
              <tr
                key={exam.id}
                className="hover:bg-orange-50 transition-colors border-b border-orange-100"
              >
                <td className="p-3 max-w-48">
                  <div className="font-medium text-gray-800 truncate">{exam.examinationTitle}</div>
                </td>

                <td className="p-3 max-w-48">
                  <div className="font-medium text-gray-800 truncate">{exam.teacherName}</div>
                </td>

                <td className="p-3 max-w-48">
                  <div className="font-medium text-gray-800 truncate">{exam.examinerName}</div>
                </td>

                <td className="p-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}
                  >
                    {getStatusIcon(exam.status)}
                    <span className="ml-1 capitalize">{getStatusText(exam.status)}</span>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacheTable;
