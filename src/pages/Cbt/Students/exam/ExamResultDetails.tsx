import React, { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface ExamResult {
  id: number;
  title: string;
  subject: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: 'passed' | 'failed';
  submittedDate: string;
  timeTaken: string;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  teacherFeedback: string;
  questions: QuestionReview[];
}

interface QuestionReview {
  id: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
}

const ExamResultDetails = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'summary' | 'review'>('summary');

  const examResult: ExamResult = {
    id: 1,
    title: 'Chemistry Quiz',
    subject: 'Chemistry',
    score: 18,
    totalPoints: 20,
    percentage: 90,
    status: 'passed',
    submittedDate: '2025-10-20 10:45 AM',
    timeTaken: '28 min',
    correctAnswers: 4,
    totalQuestions: 5,
    accuracy: 80,
    teacherFeedback: 'Excellent work! You demonstrated a strong understanding of the concepts.',
    questions: [
      {
        id: 1,
        question: 'What is the chemical formula for water?',
        userAnswer: 'H₂O',
        correctAnswer: 'H₂O',
        isCorrect: true,
        explanation: 'Water is composed of two hydrogen atoms and one oxygen atom.'
      },
      {
        id: 2,
        question: 'What is the atomic number of Carbon?',
        userAnswer: '6',
        correctAnswer: '6',
        isCorrect: true,
        explanation: 'Carbon has 6 protons in its nucleus.'
      },
      {
        id: 3,
        question: 'Which element is represented by "Na"?',
        userAnswer: 'Nitrogen',
        correctAnswer: 'Sodium',
        isCorrect: false,
        explanation: 'Na is the chemical symbol for Sodium (from Latin "Natrium").'
      },
      {
        id: 4,
        question: 'What is the pH of pure water?',
        userAnswer: '8',
        correctAnswer: '7',
        isCorrect: false,
        explanation: 'Pure water has a neutral pH of 7 at 25°C.'
      },
      {
        id: 5,
        question: 'How many electrons does Oxygen have?',
        userAnswer: '8',
        correctAnswer: '8',
        isCorrect: true,
        explanation: 'Oxygen has 8 electrons in a neutral atom.'
      }
    ]
  };

  const getStatusBadge = (status: 'passed' | 'failed') => {
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
        status === 'passed' 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-red-100 text-red-700 border border-red-200'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-8 px-4">
        <div>
            <BiArrowBack className='w-8 h-8 cursor-pointer' onClick={() => navigate(-1)}/>
        </div>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-700 p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Exam Results</h1>
              <h2 className="text-2xl font-semibold">{examResult.title}</h2>
            </div>
            {getStatusBadge(examResult.status)}
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span>Subject: {examResult.subject}</span>
              <span>•</span>
              <span>Submitted: {examResult.submittedDate}</span>
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="p-8 border-b border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Score</h3>
            <div className="text-6xl font-bold text-blue-600 mb-2">{examResult.percentage}%</div>
            <div className="text-xl text-gray-600 mb-4">
              {examResult.score} out of {examResult.totalPoints} points
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === 'summary'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex-1 py-4 text-lg font-semibold transition-colors ${
                activeTab === 'review'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Question Review
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'summary' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{examResult.submittedDate.split(' ')[0]}</div>
                  <div className="text-sm text-gray-600">Submitted</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{examResult.timeTaken}</div>
                  <div className="text-sm text-gray-600">Time Taken</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{examResult.correctAnswers}/{examResult.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800">{examResult.accuracy}%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
              </div>

              {/* Performance Summary */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Score Progress</span>
                    <span className="text-lg font-bold text-gray-800">{examResult.score} / {examResult.totalPoints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="h-4 rounded-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${examResult.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Teacher Feedback */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Teacher Feedback</h3>
                <p className="text-blue-700 leading-relaxed">{examResult.teacherFeedback}</p>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Question Review</h3>
                <p className="text-gray-600">Review your answers and see the correct solutions</p>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {examResult.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${
                        question.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                          {question.question}
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className={`p-3 rounded-lg border-2 ${
                            question.isCorrect 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-red-200 bg-red-50'
                          }`}>
                            <div className="text-sm font-semibold text-gray-600 mb-1">Your Answer</div>
                            <div className="text-gray-800">{question.userAnswer}</div>
                          </div>
                          <div className="p-3 rounded-lg border-2 border-green-200 bg-green-50">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Correct Answer</div>
                            <div className="text-gray-800">{question.correctAnswer}</div>
                          </div>
                        </div>

                        {question.explanation && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Explanation</div>
                            <div className="text-gray-700">{question.explanation}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Download Results PDF
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Back to Dashboard
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Retake Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResultDetails;