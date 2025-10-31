import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CompletedExam {
  id: number;
  title: string;
  subject: string;
  submittedDate: string;
  status: 'passed' | 'failed';
  score: number;
  totalPoints: number;
  percentage: number;
  teacherFeedback?: string;
}

const CompletedExam = () => {
  const navigate = useNavigate()
  const completedExams: CompletedExam[] = [
    {
      id: 1,
      title: 'Chemistry Quiz',
      subject: 'Chemistry',
      submittedDate: '2025-10-20 10:45 AM',
      status: 'passed',
      score: 18,
      totalPoints: 20,
      percentage: 90,
      teacherFeedback: 'Excellent work! Keep it up.'
    },
    {
      id: 2,
      title: 'Biology Test',
      subject: 'Biology',
      submittedDate: '2025-10-18 14:30 PM',
      status: 'passed',
      score: 32,
      totalPoints: 40,
      percentage: 80
    },
    {
      id: 3,
      title: 'Physics Mid-term',
      subject: 'Physics',
      submittedDate: '2025-10-15 09:15 AM',
      status: 'passed',
      score: 45,
      totalPoints: 50,
      percentage: 90,
      teacherFeedback: 'Great problem-solving skills!'
    }
  ];

  const getStatusBadge = (status: 'passed' | 'failed') => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        status === 'passed' 
          ? 'bg-green-100 text-green-700 border border-green-200' 
          : 'bg-red-100 text-red-700 border border-red-200'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const ProgressBar = ({ percentage, score, totalPoints }: { percentage: number; score: number; totalPoints: number }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
          <span className="text-sm text-gray-600">{score}/{totalPoints} points</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              percentage >= 80 ? 'bg-green-500' : 
              percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Completed Exams</h1>
          <p className="text-gray-600">Review your exam results and performance</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">{completedExams.length}</div>
            <div className="text-gray-600">Exams Completed</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(completedExams.reduce((acc, exam) => acc + exam.percentage, 0) / completedExams.length)}%
            </div>
            <div className="text-gray-600">Average Score</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-800">
              {completedExams.filter(exam => exam.status === 'passed').length}/{completedExams.length}
            </div>
            <div className="text-gray-600">Exams Passed</div>
          </div>
        </div>

        {/* Completed Exams List */}
        <div className="space-y-6">
          {completedExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left Section - Exam Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold text-gray-800">{exam.title}</h2>
                      {getStatusBadge(exam.status)}
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      <span className="font-semibold">{exam.subject}</span>
                      <span className="mx-2">•</span>
                      <span>Submitted {exam.submittedDate}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <ProgressBar 
                        percentage={exam.percentage} 
                        score={exam.score} 
                        totalPoints={exam.totalPoints} 
                      />
                    </div>

                    {/* Teacher Feedback */}
                    {exam.teacherFeedback && (
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-800 mb-1">Teacher Feedback:</h3>
                        <p className="text-blue-700">{exam.teacherFeedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Action Button */}
                  <div className="lg:w-48 flex flex-col gap-3">
                    <button onClick={()=>{ navigate(`/cbt/student/exams/result`) }} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      View Detailed Results
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompletedExam;