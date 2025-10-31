import React, { useState } from 'react';

const ExamInterface = () => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());

  const questions = [
    { id: 1, text: "What is the derivative of x²?", options: ["x", "2x", "x²", "2x²"], correct: "2x" },
    { id: 2, text: "What is F=ma?", options: ["Newton's 1st", "Newton's 2nd", "Newton's 3rd", "Hooke's Law"], correct: "Newton's 2nd" },
    { id: 3, text: "What is speed of light?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10¹² m/s"], correct: "3×10⁸ m/s" },
    { id: 4, text: "What is Planck's constant?", options: ["6.626×10⁻³⁴ Js", "6.626×10⁻³² Js", "6.626×10⁻³⁶ Js", "6.626×10⁻³⁸ Js"], correct: "6.626×10⁻³⁴ Js" },
    { id: 5, text: "What is kinetic energy formula?", options: ["½mv", "½mv²", "mv²", "mgh"], correct: "½mv²" }
  ];

  const toggleFlag = (questionId: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId);
    } else {
      newFlagged.add(questionId);
    }
    setFlaggedQuestions(newFlagged);
  };

  const getQuestionStatus = (questionId: number) => {
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (questionId === currentQuestion) return 'current';
    return 'unanswered';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Physics Mid-term Test</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <span className="bg-white/20 px-3 py-1 rounded-full">Physics</span>
            <span>Time remaining: 45:30</span>
            <span>Question {currentQuestion} of {questions.length}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Main Question Area */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">5 points</span>
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    flaggedQuestions.has(currentQuestion)
                      ? 'bg-yellow-50 border-yellow-400 text-yellow-700'
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {flaggedQuestions.has(currentQuestion) ? '★ Flagged' : '☆ Flag Question'}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  What is the derivative of x²?
                </h2>
                
                <div className="space-y-3">
                  {questions[currentQuestion - 1].options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAnswer === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="hidden"
                      />
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center">
                        {selectedAnswer === option && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </span>
                      <span className="text-lg">{String.fromCharCode(65 + index)}. {option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                disabled={currentQuestion === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length, currentQuestion + 1))}
                disabled={currentQuestion === questions.length}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigator</h3>
            <p className="text-sm text-gray-600 mb-4">Click to jump to any question</p>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {questions.map((question) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestion(question.id)}
                  className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium transition-all ${
                    getQuestionStatus(question.id) === 'current'
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : getQuestionStatus(question.id) === 'flagged'
                      ? 'border-yellow-400 bg-yellow-100 text-yellow-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {question.id}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 bg-white mr-2 rounded"></div>
                <span className="text-gray-600">Unanswered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-yellow-400 bg-yellow-100 mr-2 rounded"></div>
                <span className="text-gray-600">Flagged</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;