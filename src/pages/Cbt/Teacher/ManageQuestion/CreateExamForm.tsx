import React, { useEffect, useState } from "react";
import {
  Save,
  Plus,
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";
import { classroomService } from "../../../../Services/Classroom";
import { useAuth } from "../../../../Context/Auth/useAuth";
import Select from "react-select";
import {
  fetchCbtSubjectFailure,
  fetchCbtSubjectStart,
  fetchCbtSubjectSuccess,
} from "../../../../Store/cbt/cbtSlice";
import { teacherSubjectService } from "../../../../Services/Teachers/subject/TeacherSubjectService";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/CbtTeacherExamService";
// import { AppContext } from "../../../../Context/AppContext";
import { toast } from "react-toastify";

interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface OptionType {
  value: string | number | undefined;
  label: string;
}

// Shape of the created exam returned by the API
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

const CreateExamForm: React.FC = () => {
  const { cbtUser } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  // const { notifySuccess, notifyError } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState<ActiveTab>("exam");

  // ─── Store the full created exam object so we can pull id + subjectId ─────
  const [createdExam, setCreatedExam] = useState<CreatedExam | null>(null);

  // ─── Subjects from Redux ──────────────────────────────────────────────────
  const subjectFetchedRecord = useSelector((state: RootState) => state.getCbtSubject.listRecords);
  const subjectFetchedLoading = useSelector((state: RootState) => state.getCbtSubject.loading);

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    if (!subjectFetchedLoading) fetchCbtSubject();
  }, [dispatch]);

  const fetchCbtSubject = async () => {
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

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    try {
      await classroomService.addClassroom({
        name: newClassName,
        schoolId: cbtUser?.schoolId,
      });
      setExamData((prev) => ({ ...prev, classLabel: newClassName }));
      setNewClassName("");
      setShowAddClassModal(false);
    } catch (err) {
      console.error("Failed to add class:", err);
    }
  };

  // ─── Static select options ────────────────────────────────────────────────
  const termOptions: OptionType[] = [
    { value: "FIRST", label: "First Term" },
    { value: "SECOND", label: "Second Term" },
    { value: "THIRD", label: "Third Term" },
  ];

  const examTypeOptions: OptionType[] = [
    { value: "WAEC", label: "WAEC" },
    { value: "NECO", label: "NECO" },
    { value: "JAMB", label: "JAMB" },
    { value: "GCE", label: "GCE" },
    { value: "INTERNAL", label: "Internal" },
  ];

  const getSelectedOption = (
    value: string | number | undefined,
    options: OptionType[],
  ): OptionType | null => options.find((o) => String(o.value) === String(value)) ?? null;

  const handleSelectChange = (field: string, selected: OptionType | null) => {
    setExamData((prev) => ({ ...prev, [field]: selected?.value ?? "" }));
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? "#f97316" : "#fdba74",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(249,115,22,0.2)" : "none",
      "&:hover": { borderColor: "#f97316" },
      borderRadius: "0.5rem",
      backgroundColor: "white",
      minHeight: "42px",
      fontSize: "0.875rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#f97316" : state.isFocused ? "#fff7ed" : "white",
      color: state.isSelected ? "white" : "#374151",
      fontSize: "0.875rem",
    }),
    placeholder: (base: any) => ({ ...base, color: "#9ca3af", fontSize: "0.875rem" }),
    singleValue: (base: any) => ({ ...base, fontSize: "0.875rem", color: "#374151" }),
    menu: (base: any) => ({ ...base, borderRadius: "0.5rem", zIndex: 50 }),
    loadingMessage: (base: any) => ({ ...base, fontSize: "0.875rem" }),
    noOptionsMessage: (base: any) => ({ ...base, fontSize: "0.875rem" }),
  };

  // ─── Exam form state ──────────────────────────────────────────────────────
  const [examData, setExamData] = useState({
    title: "",
    class: "" as string,
    classLabel: "",
    subject: "",
    subjectId: "" as string,
    duration: 0,
    scheduledDate: "",
    passingScore: 50,
    instructions: "",
    examType: "" as string,
    term: "" as string,
    academicSession: "" as string,
    schoolId: cbtUser?.schoolId ?? "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });
  const [isSaving, setIsSaving] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleExamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setExamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, options: newOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }
    if (currentQuestion.type === "multiple-choice" && !currentQuestion.correctAnswer) {
      toast.error("Please select the correct answer");
      return;
    }
    setQuestions((prev) => [...prev, { id: Date.now().toString(), ...currentQuestion }]);
    setCurrentQuestion({
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });
    setShowQuestionForm(false);
  };

  const deleteQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  // ─── Step 1: Create exam ──────────────────────────────────────────────────
  const handleCreateExam = async () => {
    setIsSaving(true);
    try {
      // createExam should return the full API response object
      const response = await cbtTeacherExamService.createExam(examData);

      // The API wraps the exam in: { status, responseCode, responseMessage, data }
      // Handle both: service returns full response OR just the data object
      const examRecord: CreatedExam = response?.data ?? response?.examId?.data ?? response;

      console.log("Full exam response:", response);
      console.log("Extracted exam record:", examRecord);
      console.log("Exam ID:", examRecord?.id);
      console.log("Subject ID from exam:", examRecord?.subjectId);

      if (!examRecord?.id) {
        throw new Error("Exam was created but no ID was returned. Check the service response.");
      }

      if (response.status === true) {
        setCreatedExam(examRecord);
        setActiveTab("questions");
        toast.success("Exam created successfully!");
      }
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while creating the exam.");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Step 2: Submit questions ─────────────────────────────────────────────
  const handleSubmitQuestions = async () => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }
    if (!createdExam?.id) {
      toast.error("Exam ID is missing. Please re-create the exam.");
      return;
    }

    setIsSaving(true);
    try {
      // Use subjectId from the created exam response (not from examData)
      // so it always matches what the server persisted
      const quizSubjectId = createdExam.subjectId ?? examData.subjectId;

      const mappedQuestions = questions.map((q) => ({
        quizType: "GENERAL",
        quizSubjectId,
        questionText: q.text,
        options: q.options
          .filter((opt) => opt.trim() !== "")
          .map((opt) => ({
            text: opt,
            isCorrect: opt === q.correctAnswer,
          })),
      }));

      console.log("Submitting questions payload:", {
        examId: createdExam.id,
        questions: mappedQuestions,
      });

      const res = await cbtTeacherExamService.addExamQuestion({
        questions: mappedQuestions,
        examId: createdExam.id,
      });

      console.log("Questions response:", res);
      toast.success("Questions saved successfully!");
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred while saving questions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Add New Class</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enter the class name to add it to your school
            </p>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddClass()}
              placeholder="e.g., Grade 10A"
              className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 text-sm"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddClass}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Add Class
              </button>
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setNewClassName("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
              <span className="ml-1.5 text-xs text-gray-300 font-normal">(create exam first)</span>
            )}
          </button>

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

        <div className="p-6">
          {/* TAB 1: EXAM DETAILS */}
          {activeTab === "exam" && (
            <div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-orange-500" />
                  Basic Information
                </h4>
                <p className="text-sm text-gray-600 mb-4">Set up the basic details for your exam</p>

                <div className="space-y-4">
                  {/* Exam Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={examData.title}
                      onChange={handleExamChange}
                      placeholder="e.g., Mathematics Final Exam"
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      disabled={!!createdExam}
                    />
                  </div>

                  {/* Exam Type & Term */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Type *
                      </label>
                      <Select
                        options={examTypeOptions}
                        value={getSelectedOption(examData.examType, examTypeOptions)}
                        onChange={(selected) => handleSelectChange("examType", selected)}
                        styles={selectStyles}
                        placeholder="Select exam type"
                        isSearchable={false}
                        isDisabled={!!createdExam}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Term *</label>
                      <Select
                        options={termOptions}
                        value={getSelectedOption(examData.term, termOptions)}
                        onChange={(selected) => handleSelectChange("term", selected)}
                        styles={selectStyles}
                        placeholder="Select term"
                        isSearchable={false}
                        isDisabled={!!createdExam}
                      />
                    </div>
                  </div>

                  {/* Class & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class *
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          name="classLabel"
                          value={examData.classLabel}
                          onChange={handleExamChange}
                          placeholder="e.g., Grade 10A"
                          disabled={!!createdExam}
                          className="flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        />
                        <button
                          onClick={() => setShowAddClassModal(true)}
                          title="Add a new class"
                          disabled={!!createdExam}
                          className="flex items-center justify-center w-[42px] h-[42px] rounded-lg border border-orange-300 hover:bg-orange-50 text-orange-500 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Select
                        options={subjects}
                        value={getSelectedOption(examData.subjectId, subjects)}
                        onChange={(selected) => {
                          setExamData((prev) => ({
                            ...prev,
                            subject: selected?.label ?? "",
                            subjectId: String(selected?.value ?? ""),
                          }));
                        }}
                        styles={selectStyles}
                        placeholder="Select subject"
                        isLoading={subjectFetchedLoading}
                        isSearchable
                        isDisabled={!!createdExam}
                      />
                    </div>
                  </div>

                  {/* Academic Session & Passing Score */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Session *
                      </label>
                      <input
                        type="text"
                        name="academicSession"
                        value={examData.academicSession}
                        onChange={handleExamChange}
                        placeholder="e.g., 2025/2026"
                        disabled={!!createdExam}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        name="passingScore"
                        value={examData.passingScore}
                        onChange={handleExamChange}
                        min="0"
                        max="100"
                        disabled={!!createdExam}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Duration & Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1 text-orange-500" />
                        Duration (min) *
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={examData.duration}
                        onChange={handleExamChange}
                        disabled={!!createdExam}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1 text-orange-500" />
                        Date *
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={examData.scheduledDate}
                        onChange={handleExamChange}
                        disabled={!!createdExam}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={examData.instructions}
                      onChange={handleExamChange}
                      placeholder="Enter exam instructions for students..."
                      rows={3}
                      disabled={!!createdExam}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>

                  {/* Create Exam Button / Success Banner */}
                  {!createdExam ? (
                    <div className="pt-2">
                      <button
                        onClick={handleCreateExam}
                        disabled={isSaving}
                        className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Creating Exam..." : "Create Exam"}
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-700">
                            Exam created successfully
                          </p>
                          <p className="text-xs text-green-600">ID: {createdExam.id}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("questions")}
                        className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors ml-4 flex-shrink-0"
                      >
                        Go to Questions
                        <HelpCircle className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS */}
          {activeTab === "questions" && createdExam && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Questions List */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Questions ({questions.length})
                    </h3>
                    <p className="text-sm text-gray-500">
                      Total: <span className="font-medium text-gray-700">{totalPoints} pts</span>
                    </p>
                  </div>

                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm font-medium">No questions added yet</p>
                      <p className="text-xs mt-1">Use the form on the right to add questions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((q, index) => (
                        <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 mb-2">
                                Q{index + 1}. {q.text}
                              </p>
                              {q.type === "multiple-choice" && (
                                <div className="space-y-1 text-sm">
                                  {q.options.map(
                                    (opt, i) =>
                                      opt && (
                                        <div key={i} className="flex items-center">
                                          <span
                                            className={
                                              opt === q.correctAnswer
                                                ? "text-green-600 font-semibold"
                                                : "text-gray-600"
                                            }
                                          >
                                            {String.fromCharCode(65 + i)}. {opt}
                                            {opt === q.correctAnswer && " ✓"}
                                          </span>
                                        </div>
                                      ),
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-gray-400 mt-2">
                                {q.type} • {q.points} pt{q.points !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteQuestion(q.id)}
                              className="text-red-400 hover:text-red-600 ml-4 mt-0.5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Question Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-orange-500 text-white rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-1">Add Question</h3>
                    <p className="text-orange-100 text-sm">Create a new question for this exam</p>
                  </div>

                  {showQuestionForm ? (
                    <div className="border border-orange-200 rounded-lg p-4 bg-white">
                      {/* Question Type */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </label>
                        <select
                          value={currentQuestion.type}
                          onChange={(e) => handleQuestionChange("type", e.target.value)}
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                          <option value="essay">Essay</option>
                        </select>
                      </div>

                      {/* Question Text */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text *
                        </label>
                        <textarea
                          value={currentQuestion.text}
                          onChange={(e) => handleQuestionChange("text", e.target.value)}
                          placeholder="Enter your question..."
                          rows={3}
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                      </div>

                      {/* Answer Options */}
                      {currentQuestion.type === "multiple-choice" && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Answer Options *
                            </label>
                            <div className="space-y-2">
                              {["A", "B", "C", "D"].map((letter, index) => (
                                <div key={letter} className="flex items-center">
                                  <span className="w-6 text-sm font-medium text-gray-600">
                                    {letter}.
                                  </span>
                                  <input
                                    type="text"
                                    value={currentQuestion.options[index]}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${letter}`}
                                    className="flex-1 border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer *
                            </label>
                            <select
                              value={currentQuestion.correctAnswer}
                              onChange={(e) =>
                                handleQuestionChange("correctAnswer", e.target.value)
                              }
                              className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            >
                              <option value="">Select correct answer</option>
                              {currentQuestion.options.map(
                                (opt, index) =>
                                  opt && (
                                    <option key={index} value={opt}>
                                      Option {String.fromCharCode(65 + index)}
                                    </option>
                                  ),
                              )}
                            </select>
                          </div>
                        </>
                      )}

                      {/* Points */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Points
                        </label>
                        <input
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            handleQuestionChange("points", parseInt(e.target.value) || 1)
                          }
                          min="1"
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={addQuestion}
                          className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Question
                        </button>
                        <button
                          onClick={() => setShowQuestionForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowQuestionForm(true)}
                      className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Question
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExamForm;
