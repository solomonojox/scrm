import React, { useState } from "react";
import { Save, Plus, Calendar, Clock, Trash2, Edit2, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

const CreateExamForm: React.FC = () => {
  const [examData, setExamData] = useState({
    title: "",
    class: "",
    subject: "",
    duration: 60,
    scheduledDate: "",
    passingScore: 50,
    instructions: "",
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  });

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleExamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion({
      ...currentQuestion,
      [field]: value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: newOptions,
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert("Please enter a question text");
      return;
    }

    if (currentQuestion.type === "multiple-choice" && !currentQuestion.correctAnswer) {
      alert("Please select the correct answer");
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      text: currentQuestion.text,
      options: currentQuestion.options,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points,
    };

    setQuestions([...questions, newQuestion]);

    // Reset form
    setCurrentQuestion({
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    });

    setShowQuestionForm(false);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveExam = () => {
    if (!examData.title || !examData.class || !examData.subject) {
      alert("Please fill in all required exam details");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const examPayload = {
      ...examData,
      questions,
      totalPoints,
      totalQuestions: questions.length,
    };

    console.log("Exam Data:", examPayload);
    alert("Exam saved successfully!");
  };

  const classes = ["Grade 10A", "Grade 10B", "Grade 11A", "Grade 11B", "Grade 12A", "Grade 12B"];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];

  return (
    <div className="font-sans">
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-orange-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Create New Exam</h2>
            <p className="text-gray-600 text-sm mt-1">Greenfield High School</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{questions.length}</span> Questions •{" "}
              <span className="font-medium">{totalPoints}</span> Points
            </div>
            <button
              onClick={handleSaveExam}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Exam
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Exam Details Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Details</h3>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5 mb-4">
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
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>

                  {/* Class, Subject Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Class *
                      </label>
                      <select
                        name="class"
                        value={examData.class}
                        onChange={handleExamChange}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="">Select class</option>
                        {classes.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={examData.subject}
                        onChange={handleExamChange}
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                      >
                        <option value="">Select subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Duration, Date, Passing Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
                        className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
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
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Questions ({questions.length})
                </h3>
                <p className="text-sm text-gray-600">Review and manage your exam questions</p>
              </div>

              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No questions added yet</p>
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
                              {q.options.map((opt, i) => (
                                <div key={i} className="flex items-center">
                                  <span
                                    className={`${
                                      opt === q.correctAnswer
                                        ? "text-green-600 font-semibold"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {String.fromCharCode(65 + i)}. {opt}
                                    {opt === q.correctAnswer && " ✓"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-gray-500 mt-2">
                            Type: {q.type} • {q.points} point{q.points !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteQuestion(q.id)}
                          className="text-red-500 hover:text-red-700 ml-4"
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

          {/* Sidebar - Add Question Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-orange-500 text-white rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2">Add Question</h3>
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
                      className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Answer Options (for multiple choice) */}
                  {currentQuestion.type === "multiple-choice" && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Answer Options *
                        </label>
                        <div className="space-y-2">
                          {["A", "B", "C", "D"].map((letter, index) => (
                            <div key={letter} className="flex items-center">
                              <span className="w-6 text-sm font-medium text-gray-700">
                                {letter}.
                              </span>
                              <input
                                type="text"
                                value={currentQuestion.options[index]}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${letter}`}
                                className="flex-1 border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer *
                        </label>
                        <select
                          value={currentQuestion.correctAnswer}
                          onChange={(e) => handleQuestionChange("correctAnswer", e.target.value)}
                          className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select correct answer</option>
                          {currentQuestion.options.map(
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
                      value={currentQuestion.points}
                      onChange={(e) =>
                        handleQuestionChange("points", parseInt(e.target.value) || 1)
                      }
                      min="1"
                      className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Buttons */}
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
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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
      </div>
    </div>
  );
};

export default CreateExamForm;
