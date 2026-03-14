import React, { useState } from "react";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

export interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "essay";

const INITIAL_QUESTION = {
  type: "multiple-choice" as QuestionType,
  text: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 1,
};

interface AddQuestionProps {
  questions: Question[];
  onQuestionsChange: (questions: Question[]) => void;
}

// ─── Question Form (Sidebar) ───────────────────────────────────────────────────
const QuestionForm: React.FC<{
  onAdd: (q: Omit<Question, "id">) => void;
  onCancel: () => void;
}> = ({ onAdd, onCancel }) => {
  const [draft, setDraft] = useState({ ...INITIAL_QUESTION });

  const handleChange = (field: string, value: any) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...draft.options];
    updated[index] = value;
    setDraft((prev) => ({ ...prev, options: updated }));
  };

  const handleAdd = () => {
    if (!draft.text.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }
    if (draft.type === "multiple-choice" && !draft.correctAnswer) {
      toast.error("Please select the correct answer");
      return;
    }
    onAdd(draft);
    setDraft({ ...INITIAL_QUESTION });
  };

  return (
    <div className="border border-orange-200 rounded-lg p-4 bg-white">
      {/* Question Type */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
        <select
          value={draft.type}
          onChange={(e) => handleChange("type", e.target.value as QuestionType)}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
        <textarea
          value={draft.text}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Enter your question..."
          rows={3}
          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
      </div>

      {/* Answer Options (multiple choice only) */}
      {draft.type === "multiple-choice" && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options *
            </label>
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((letter, index) => (
                <div key={letter} className="flex items-center">
                  <span className="w-6 text-sm font-medium text-gray-600">{letter}.</span>
                  <input
                    type="text"
                    value={draft.options[index]}
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
              value={draft.correctAnswer}
              onChange={(e) => handleChange("correctAnswer", e.target.value)}
              className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="">Select correct answer</option>
              {draft.options.map(
                (opt, index) =>
                  opt && (
                    <option key={index} value={opt}>
                      Option {String.fromCharCode(65 + index)}
                    </option>
                  )
              )}
            </select>
          </div>
        </>
      )}

      {/* Points */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
        <input
          type="number"
          value={draft.points}
          onChange={(e) => handleChange("points", parseInt(e.target.value) || 1)}
          min="1"
          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard: React.FC<{
  question: Question;
  index: number;
  onDelete: (id: string) => void;
}> = ({ question, index, onDelete }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium text-gray-800 mb-2">
          Q{index + 1}. {question.text}
        </p>

        {question.type === "multiple-choice" && (
          <div className="space-y-1 text-sm">
            {question.options.map(
              (opt, i) =>
                opt && (
                  <div key={i} className="flex items-center">
                    <span
                      className={
                        opt === question.correctAnswer
                          ? "text-green-600 font-semibold"
                          : "text-gray-600"
                      }
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                      {opt === question.correctAnswer && " ✓"}
                    </span>
                  </div>
                )
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          {question.type} • {question.points} pt{question.points !== 1 ? "s" : ""}
        </p>
      </div>

      <button
        onClick={() => onDelete(question.id)}
        className="text-red-400 hover:text-red-600 ml-4 mt-0.5 transition-colors"
        aria-label="Delete question"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const AddQuestion: React.FC<AddQuestionProps> = ({ questions, onQuestionsChange }) => {
  const [showForm, setShowForm] = useState(false);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAdd = (draft: Omit<Question, "id">) => {
    onQuestionsChange([...questions, { id: Date.now().toString(), ...draft }]);
    setShowForm(false);
  };

  const handleDelete = (id: string) =>
    onQuestionsChange(questions.filter((q) => q.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Questions List ── */}
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
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Question Sidebar ── */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <div className="bg-orange-500 text-white rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-1">Add Question</h3>
            <p className="text-orange-100 text-sm">Create a new question for this exam</p>
          </div>

          {showForm ? (
            <QuestionForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;