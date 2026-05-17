import React, { useCallback, useEffect, useState } from "react";
import { Exam, Page } from "../../../../Types/Cbt/student";
import { availableExams } from "../../../../constants/StudentCbtConstant";
import { Card } from "../../../../components/Cbt/student/UI/Card";
import Icon from "../../../../components/Cbt/student/UI/Icon";
import { Badge } from "../../../../components/Cbt/student/UI/Badge";
import { Btn } from "../../../../components/Cbt/student/UI/Btn";
import { useNavigate } from "react-router-dom";
import { ExamFilterParams } from "../../../../Types/Cbt/cbtTypes";
import { fetchAllExamQuestionFailure, fetchAllExamQuestionStart, fetchAllExamQuestionSuccess } from "../../../../Store/cbt/allExamQuestionSlice";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/cbtTeacherExamService";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { cbtStudentService } from "../../../../Services/Cbt/student/cbtStudentService";
import { useAuth } from "../../../../Context/Auth/useAuth";
import { Loader } from "lucide-react";


const diffColor: Record<string, "green" | "orange" | "red"> = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

type Filter = "all" | "easy" | "medium" | "hard";

const StudentCbtExamsPage: React.FC = () => {
  const { cbtUser } = useAuth()
  const [filter, setFilter] = useState<Filter>("all");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const listRecords = useSelector((state: RootState) => state.getAllExamQuestion.listRecords);
  const totalRecords = useSelector((state: RootState) => state.getAllExamQuestion.totalRecords);
  // console.log(listRecords)

  const filtered =
    filter === "all"
      ? listRecords
      : availableExams.filter((e) => e.difficulty?.toLowerCase() === filter);

  const [filters, setFilters] = useState<ExamFilterParams>({
    pageNumber: 1,
    pageSize: 100,
  });

  const fetchExams = useCallback(
    async (params?: ExamFilterParams) => {
      dispatch(fetchAllExamQuestionStart());
      try {
        const data = await cbtTeacherExamService.getExams(params);
        // console.log(data)
        dispatch(fetchAllExamQuestionSuccess(data));
      } catch (err) {
        dispatch(fetchAllExamQuestionFailure((err as Error).message));
      }
    },
    [dispatch],
  );

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchExams(filters);
  }, [filters]);

  const [loading, setLoading] = useState<boolean>(false)
  const handleStartExam = async (id: string) => {
    setLoading(true)
    try {
      const res = await cbtStudentService.startExam(cbtUser?.id, id)

      console.log(res)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    navigate(`/cbt/student/exam/${id}`);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {(["all", "easy", "medium", "hard"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f
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
        {filtered?.map((exam) => (
          <Card key={exam.id} cls="p-5 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                <Icon name="exam" size={22} cls="text-orange-500" />
              </div>
              {/* {exam.difficulty && (
                <Badge text={exam.difficulty} variant={diffColor[exam.difficulty]} />
              )} */}
            </div>

            <h3 className="font-bold text-gray-900 mb-1">{exam.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{exam.examType}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-bold text-gray-900">{exam.durationMinutes} min</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-gray-400">Questions</p>
                <p className="text-sm font-bold text-gray-900">{exam?.questions?.length}</p>
              </div>
            </div>

            {exam?.status === "SCHEDULED" ? (
              <Btn
                variant="primary"
                cls="w-full justify-center"
                onClick={() => {
                  // setActiveExam(exam);

                  handleStartExam(exam.id)
                }}
              >
                {!loading ?
                  <div className="flex items-center gap-4"><Icon name="play" size={16} /> Start Exam</div> :
                  <Loader className="animate-spin"/>
                }
              </Btn>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
              >
                <Icon name="lock" size={16} /> Locked
              </button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentCbtExamsPage;