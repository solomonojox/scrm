import React from "react";
import {
  Save,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import Select from "react-select";

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

export interface ExamFormData {
  title: string;
  class: string;
  classLabel: string;
  subject: string;
  subjectId: string;
  duration: number;
  scheduledDate: string;
  passingScore: number;
  instructions: string;
  examType: string;
  term: string;
  academicSession: string;
  schoolId: string;
}

interface AddExamProps {
  examData: ExamFormData;
  createdExam: CreatedExam | null;
  isSaving: boolean;
  subjects: OptionType[];
  subjectFetchedLoading: boolean;
  onExamChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  onSelectChange: (field: string, selected: OptionType | null) => void;
  onSubjectChange: (selected: OptionType | null) => void;
  onOpenAddClassModal: () => void;
  onCreateExam: () => void;
  onGoToQuestions: () => void;
}

// ─── Static options ────────────────────────────────────────────────────────────
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

const getSelectedOption = (
  value: string | number | undefined,
  options: OptionType[]
): OptionType | null => options.find((o) => String(o.value) === String(value)) ?? null;

// ─── Component ─────────────────────────────────────────────────────────────────
const AddExam: React.FC<AddExamProps> = ({
  examData,
  createdExam,
  isSaving,
  subjects,
  subjectFetchedLoading,
  onExamChange,
  onSelectChange,
  onSubjectChange,
  onOpenAddClassModal,
  onCreateExam,
  onGoToQuestions,
}) => {
  const isLocked = !!createdExam;

  return (
    <div className="bg-linear-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-orange-500" />
        Basic Information
      </h4>
      <p className="text-sm text-gray-600 mb-4">Set up the basic details for your exam</p>

      <div className="space-y-4">
        {/* Exam Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title *</label>
          <input
            type="text"
            name="title"
            value={examData.title}
            onChange={onExamChange}
            placeholder="e.g., Mathematics Final Exam"
            disabled={isLocked}
            className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {/* Exam Type & Term */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
            <Select
              options={examTypeOptions}
              value={getSelectedOption(examData.examType, examTypeOptions)}
              onChange={(selected) => onSelectChange("examType", selected)}
              styles={selectStyles}
              placeholder="Select exam type"
              isSearchable={false}
              isDisabled={isLocked}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term *</label>
            <Select
              options={termOptions}
              value={getSelectedOption(examData.term, termOptions)}
              onChange={(selected) => onSelectChange("term", selected)}
              styles={selectStyles}
              placeholder="Select term"
              isSearchable={false}
              isDisabled={isLocked}
            />
          </div>
        </div>

        {/* Class & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="classLabel"
                value={examData.classLabel}
                onChange={onExamChange}
                placeholder="e.g., Grade 10A"
                disabled={isLocked}
                className="flex-1 border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                onClick={onOpenAddClassModal}
                title="Add a new class"
                disabled={isLocked}
                className="flex items-center justify-center w-10.5 h-10.5 rounded-lg border border-orange-300 hover:bg-orange-50 text-orange-500 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <Select
              options={subjects}
              value={getSelectedOption(examData.subjectId, subjects)}
              onChange={onSubjectChange}
              styles={selectStyles}
              placeholder="Select subject"
              isLoading={subjectFetchedLoading}
              isSearchable
              isDisabled={isLocked}
            />
          </div>
        </div>

        {/* Academic Session */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Session *
          </label>
          <input
            type="text"
            name="academicSession"
            value={examData.academicSession}
            onChange={onExamChange}
            placeholder="e.g., 2025/2026"
            disabled={isLocked}
            className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          />
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
              onChange={onExamChange}
              disabled={isLocked}
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
              onChange={onExamChange}
              disabled={isLocked}
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
            onChange={onExamChange}
            placeholder="Enter exam instructions for students..."
            rows={3}
            disabled={isLocked}
            className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {/* CTA: Create / Success Banner */}
        {!createdExam ? (
          <div className="pt-2">
            <button
              onClick={onCreateExam}
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
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-700">Exam created successfully</p>
                <p className="text-xs text-green-600">ID: {createdExam.id}</p>
              </div>
            </div>
            <button
              onClick={onGoToQuestions}
              className="flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors ml-4 shrink-0"
            >
              Go to Questions
              <HelpCircle className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExam;