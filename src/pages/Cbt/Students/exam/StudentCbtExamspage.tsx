import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { AppDispatch, RootState } from "../../../../Store/store";
import {
  fetchStudentCatalogFailure,
  fetchStudentCatalogStart,
  fetchStudentCatalogSuccess,
} from "../../../../Store/cbt/student/studentCatalogSlice";
import { useState } from "react";

const diffColor: Record<string, "green" | "orange" | "red"> = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

// NOTE: CatalogExam.difficulty from getStudentCatalog is a number (seen: 1),
// not a string like the old mock data used. Mapping assumed as 1=Easy,
// 2=Medium, 3=Hard — confirm against the backend and adjust if wrong.
const difficultyLabel = (difficulty: number): "Easy" | "Medium" | "Hard" => {
  if (difficulty >= 3) return "Hard";
  if (difficulty === 2) return "Medium";
  return "Easy";
};

type Filter = "all Exam" | "easy" | "medium" | "hard";

const StudentCbtExamsPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all Exam");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { cbtUser } = useAuth();

  const catalogExams = useSelector((state: RootState) => state.getStudentCatalog.listRecords);

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

  const displayExams = catalogExams.map((exam) => ({
    id: exam.examId,
    subject: exam.subjectName,
    code: exam.subjectCode ?? exam.description,
    duration: exam.durationMinutes,
    questions: exam.totalQuestions,
    difficulty: difficultyLabel(exam.difficulty),
    alreadyTaken: exam.alreadyTaken,
    scheduledAt: exam.scheduledAt,
  }));

  const filtered =
    filter === "all Exam"
      ? displayExams
      : displayExams.filter((e) => e.difficulty.toLowerCase() === filter);

  const isExamStartable = (exam: { scheduledAt: string | null; questions: number }) => {
    // Must have at least one question
    if (exam.questions <= 0) return false;

    // Must be scheduled
    if (!exam.scheduledAt) return false;

    // Scheduled time must be now or in the past
    return new Date(exam.scheduledAt).getTime() <= Date.now();
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {(["all Exam", "easy", "medium", "hard"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === f
                ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                : "bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10 col-span-full">
            No exams found for this filter.
          </p>
        ) : (
          filtered.map((exam) => (
            <Card key={exam.id} cls="p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <Icon name="exam" size={22} cls="text-orange-500" />
                </div>
                <Badge text={exam.difficulty} variant={diffColor[exam.difficulty]} />
              </div>

              <h3 className="font-bold text-gray-900 mb-1 capitalize">{exam.subject}</h3>
              <p className="text-sm text-gray-400 mb-4">{exam.code}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-bold text-gray-900">{exam.duration} min</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-400">Questions</p>
                  <p className="text-sm font-bold text-gray-900">{exam.questions}</p>
                </div>
              </div>

              {exam.alreadyTaken ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
                >
                  <Icon name="check" size={16} />
                  Already Taken
                </button>
              ) : isExamStartable(exam) ? (
                <Btn
                  variant="primary"
                  cls="w-full justify-center"
                  onClick={() => navigate(`/cbt/student/exam/${exam.id}`)}
                >
                  <Icon name="play" size={16} />
                  Start Exam
                </Btn>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
                >
                  <Icon name="lock" size={16} />
                  {!exam.scheduledAt
                    ? "Not Scheduled"
                    : exam.questions <= 0
                      ? "No Questions"
                      : "Not Yet Available"}
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentCbtExamsPage;
