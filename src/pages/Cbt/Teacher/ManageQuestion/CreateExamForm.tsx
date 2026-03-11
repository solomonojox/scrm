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
import { teacherSubjectService } from "../../../../Services/Teachers/subject/TeacherSubjectService";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/CbtTeacherExamService";
import { classroomService } from "../../../../Services/Classroom";
import { toast } from "react-toastify";
import AddQuestion from "../../../../components/Cbt/teacher/AddQuestion";
import AddExam from "../../../../components/Cbt/teacher/AddExam";
import AddClassModal from "../../../../components/Cbt/teacher/AddClassModal";


// ─── Types ─────────────────────────────────────────────────────────────────────
interface OptionType {
  value: string | number | undefined;
  label: string;
}

interface CreatedExam {
  id: string;
  subjectId: string;
  examType: string;
  title: string;
  schoolId: string;
  classLevel: string | null;
  term: string;
  academicSession: string;
  durationMinutes: number;
  examDate: string | null;
  createdAt: string;
  updatedAt: string;
}

type ActiveTab = "exam" | "questions";

// ─── Component ─────────────────────────────────────────────────────────────────
const CreateExamForm: React.FC = () => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const subjectFetchedRecord = useSelector(
    (state: RootState) => state.getCbtSubject.listRecords
  );
  const subjectFetchedLoading = useSelector(
    (state: RootState) => state.getCbtSubject.loading
  );

  // ─── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>("exam");
  const [createdExam, setCreatedExam] = useState<CreatedExam | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ─── Modal state ────────────────────────────────────────────────────────────
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  // ─── Exam form state ─────────────────────────────────────────────────────────
  const [examData, setExamData] = useState<any>({
    title: "",
    class: "",
    classLabel: "",
    subject: "",
    subjectId: "",
    duration: 0,
    scheduledDate: "",
    passingScore: 50,
    instructions: "",
    examType: "",
    term: "",
    academicSession: "",
    schoolId: cbtUser?.schoolId ?? "",
  });

  // ─── Questions state ─────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<any[]>([]);

  // ─── Subjects ────────────────────────────────────────────────────────────────
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

  // ─── Handlers: Exam form ─────────────────────────────────────────────────────
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

  // ─── Handlers: Class modal ───────────────────────────────────────────────────
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
      console.error("Failed to add class:", err);
      toast.error("Failed to add class. Please try again.");
    }
  };

  // ─── Step 1: Create exam ─────────────────────────────────────────────────────
  const handleCreateExam = async () => {
    setIsSaving(true);
    try {
      const response = await cbtTeacherExamService.createExam(examData);
      // console.log("Create exam response:", response);

      if (response.status === true) {
        toast.success("Exam created successfully!");
        setCreatedExam(response);
        setTimeout(() => setActiveTab("questions"), 1000);
      }
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while creating the exam.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Step 2: Submit questions ─────────────────────────────────────────────────
  const handleSubmitQuestions = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    if (!createdExam) {
      toast.error("Exam ID is missing. Please re-create the exam.");
      return;
    }

    setIsSaving(true);
    try {
      const quizSubjectId = createdExam.subjectId ?? examData.subjectId;

      const mappedQuestions = questions.map((q) => ({
        quizType: "GENERAL",
        quizSubjectId,
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
        examId: createdExam.id,
      });

      if (res.status === true) {
        toast.success("Questions saved successfully!");
        // set all states back to initial state
        setExamData({
          title: "",
          subject: "",
          subjectId: "",
          class: "",
          classLabel: "",
          duration: 0,
          scheduledDate: "",
          passingScore: 0,
          instructions: "",
          examType: "",
          term: "",
          academicSession: "",
          schoolId: "",
        });
        setQuestions([]);
        setCreatedExam(null);
        // fallback to exam tab after saving questions
        setTimeout(() => setActiveTab("exam"), 1000);
      }
      console.log("Questions response:", res);
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while saving questions.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="font-sans">
      {/* Class Modal */}
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
        {/* ── Tabs ── */}
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
            {createdExam && (
              <span className="ml-1 w-2 h-2 rounded-full bg-green-500 inline-block" />
            )}
          </button>

          <button
            onClick={() => createdExam && setActiveTab("questions")}
            disabled={!createdExam}
            className={`relative flex items-center space-x-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "questions" && createdExam
                ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50"
                : createdExam
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                : "text-gray-300 cursor-not-allowed"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Questions</span>
            {questions.length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {questions.length}
              </span>
            )}
            {!createdExam && (
              <span className="ml-1.5 text-xs text-gray-300 font-normal">
                (create exam first)
              </span>
            )}
          </button>

          {/* Save Questions CTA */}
          {activeTab === "questions" && createdExam && (
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

        {/* ── Tab Panels ── */}
        <div className="p-6">
          {activeTab === "exam" && (
            <AddExam
              examData={examData}
              createdExam={createdExam}
              isSaving={isSaving}
              subjects={subjects}
              subjectFetchedLoading={subjectFetchedLoading}
              onExamChange={handleExamChange}
              onSelectChange={handleSelectChange}
              onSubjectChange={handleSubjectChange}
              onOpenAddClassModal={() => setShowAddClassModal(true)}
              onCreateExam={handleCreateExam}
              onGoToQuestions={() => setActiveTab("questions")}
            />
          )}

          {activeTab === "questions" && createdExam && (
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

export default CreateExamForm;