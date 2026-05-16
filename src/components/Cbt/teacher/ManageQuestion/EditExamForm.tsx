import React, { useEffect, useState } from "react";
import { Save, FileText, HelpCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { useAuth } from "../../../../Context/Auth/useAuth";
import {
  fetchCbtSubjectFailure,
  fetchCbtSubjectStart,
  fetchCbtSubjectSuccess,
} from "../../../../Store/cbt/cbtSlice";
import { classroomService } from "../../../../Services/Classroom";
import { toast } from "react-toastify";
import AddQuestion from "../../../../components/Cbt/teacher/AddQuestion";
import AddExam from "../../../../components/Cbt/teacher/AddExam";
import AddClassModal from "../../../../components/Cbt/teacher/AddClassModal";
import { AllExamQuestionType } from "../../../../Types/Cbt/cbtTypes";
import { teacherSubjectService } from "../../../../Services/Teachers/subject/TeacherSubjectService";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/cbtTeacherExamService";

interface OptionType {
  value: string | number | undefined;
  label: string;
}

type ActiveTab = "exam" | "questions";

interface Props {
  exam: AllExamQuestionType;
  onDone: () => void;
}

const EditExamForm: React.FC<Props> = ({ exam, onDone }) => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const subjectFetchedRecord = useSelector(
    (state: RootState) => state.getCbtSubject.listRecords
  );
  const subjectFetchedLoading = useSelector(
    (state: RootState) => state.getCbtSubject.loading
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>("exam");
  const [isSaving, setIsSaving] = useState(false);
  const [examUpdated, setExamUpdated] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);

  // Pre-fill all fields from the selected exam
  const [examData, setExamData] = useState<any>({
    title: exam.title,
    class: exam.classLevel ?? "",
    classLabel: exam.classLevel ?? "",
    subject: exam.subjectName,
    subjectId: exam.subjectId,
    duration: exam.durationMinutes,
    scheduledDate: exam.examDate ?? "",
    passingScore: 50,
    instructions: "",
    examType: exam.examType,
    term: exam.term,
    academicSession: exam.academicSession,
    schoolId: exam.schoolId ?? cbtUser?.schoolId ?? "",
  });

  useEffect(() => {
    if (!subjectFetchedLoading) fetchCbtSubjects();
  }, [dispatch]);

  const fetchCbtSubjects = async () => {
    dispatch(fetchCbtSubjectStart());
    try {
      const data = await teacherSubjectService.getAll();
      dispatch(fetchCbtSubjectSuccess(data));
    } catch (err) {
      dispatch(fetchCbtSubjectFailure((err as Error).message));
    }
  };

  const subjects: OptionType[] = subjectFetchedRecord.map((sub: any) => ({
    value: sub.id ?? sub.subjectId,
    label: sub.name ?? `${sub.subjectName} - Description (${sub.description})`,
  }));

  const handleExamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setExamData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (field: string, selected: OptionType | null) => {
    setExamData((prev: any) => ({ ...prev, [field]: selected?.value ?? "" }));
  };

  const handleSubjectChange = (selected: OptionType | null) => {
    setExamData((prev: any) => ({
      ...prev,
      subject: selected?.label ?? "",
      subjectId: String(selected?.value ?? ""),
    }));
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    try {
      await classroomService.addClassroom({
        name: newClassName,
        schoolId: cbtUser?.schoolId,
      });
      setExamData((prev: any) => ({ ...prev, classLabel: newClassName }));
      setNewClassName("");
      setShowAddClassModal(false);
    } catch (err) {
      toast.error("Failed to add class. Please try again.");
    }
  };

  const handleUpdateExam = async () => {
    setIsSaving(true);
    try {
      const response = await cbtTeacherExamService.updateExam(exam.id, examData);
      if (response.status === true) {
        toast.success("Exam updated successfully!");
        setExamUpdated(true);
        setTimeout(() => setActiveTab("questions"), 800);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while updating the exam.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitQuestions = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    setIsSaving(true);
    try {
      const mappedQuestions = questions.map((q) => ({
        quizType: "GENERAL",
        quizSubjectId: exam.subjectId,
        questionText: q.text,
        options: q.options
          .filter((opt: string) => opt.trim() !== "")
          .map((opt: string) => ({
            text: opt,
            isCorrect: opt === q.correctAnswer,
          })),
      }));

      const res = await cbtTeacherExamService.addExamQuestion({
        questions: mappedQuestions,
        examinationId: exam.id,
      });

      if (res.status === true) {
        toast.success("Questions saved successfully!");
        onDone();
      }
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while saving questions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="font-sans">
      <AddClassModal
        isOpen={showAddClassModal}
        newClassName={newClassName}
        onClassNameChange={setNewClassName}
        onConfirm={handleAddClass}
        onClose={() => {
          setShowAddClassModal(false);
          setNewClassName("");
        }}
      />

      <div className="bg-white shadow-sm border border-orange-100 rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-orange-100">
          <button
            onClick={() => setActiveTab("exam")}
            className={`relative flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "exam"
                ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Exam Details</span>
            {examUpdated && (
              <span className="ml-1 w-2 h-2 rounded-full bg-green-500 inline-block" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("questions")}
            className={`relative flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "questions"
                ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Questions</span>
            {questions.length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {questions.length}
              </span>
            )}
          </button>

          {activeTab === "questions" && (
            <div className="ml-auto flex items-center px-6">
              <button
                onClick={handleSubmitQuestions}
                disabled={isSaving || questions.length === 0}
                className="flex items-center bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save Questions"}
              </button>
            </div>
          )}
        </div>

        {/* Tab Panels */}
        <div className="p-6">
          {activeTab === "exam" && (
            <AddExam
              examData={examData}
              createdExam={exam as any}
              isSaving={isSaving}
              subjects={subjects}
              subjectFetchedLoading={subjectFetchedLoading}
              onExamChange={handleExamChange}
              onSelectChange={handleSelectChange}
              onSubjectChange={handleSubjectChange}
              onOpenAddClassModal={() => setShowAddClassModal(true)}
              onCreateExam={handleUpdateExam}
              onGoToQuestions={() => setActiveTab("questions")}
            />
          )}

          {activeTab === "questions" && (
            <AddQuestion
              questions={questions}
              onQuestionsChange={setQuestions}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditExamForm;