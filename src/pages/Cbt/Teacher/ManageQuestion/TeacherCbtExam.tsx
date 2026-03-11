import React, { useState, useCallback, useMemo } from "react";
import { BookOpen, Plus, List, FileText, ArrowLeft, BarChart3 } from "lucide-react";
import ExamManagement from "./ExamManagement";
import CreateExamForm from "./CreateExamForm";

type ViewMode = "list" | "create" | "edit" | "add-question" | "view-details";

interface Question {
  id: string;
  type: string;
  text: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: number;
  passingScore: number;
  instructions: string;
  totalQuestions: number;
  totalPoints: number;
  completed: number;
  status: "scheduled" | "active" | "completed" | "draft";
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

const TeacherCbtExam: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "1",
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      class: "Grade 12A",
      date: "2025-11-15",
      duration: 90,
      passingScore: 50,
      instructions: "Please read all questions carefully before answering.",
      totalQuestions: 50,
      totalPoints: 100,
      completed: 0,
      status: "scheduled",
      questions: [],
      createdAt: "2025-11-01",
      updatedAt: "2025-11-01",
    },
    {
      id: "2",
      title: "Physics Mid-term Test",
      subject: "Physics",
      class: "Grade 11B",
      date: "2025-10-28",
      duration: 60,
      passingScore: 50,
      instructions: "Show all working. Calculators allowed.",
      totalQuestions: 30,
      totalPoints: 60,
      completed: 12,
      status: "active",
      questions: [],
      createdAt: "2025-10-15",
      updatedAt: "2025-10-20",
    },
    {
      id: "3",
      title: "Chemistry Quiz",
      subject: "Chemistry",
      class: "Grade 10A",
      date: "2025-10-20",
      duration: 30,
      passingScore: 50,
      instructions: "Multiple choice questions only.",
      totalQuestions: 20,
      totalPoints: 20,
      completed: 32,
      status: "completed",
      questions: [],
      createdAt: "2025-10-10",
      updatedAt: "2025-10-20",
    },
  ]);

  // Computed statistics
  const stats = useMemo(
    () => ({
      total: exams.length,
      active: exams.filter((e) => e.status === "active").length,
      scheduled: exams.filter((e) => e.status === "scheduled").length,
      completed: exams.filter((e) => e.status === "completed").length,
      draft: exams.filter((e) => e.status === "draft").length,
      totalQuestions: exams.reduce((sum, e) => sum + e.totalQuestions, 0),
      totalStudentsCompleted: exams.reduce((sum, e) => sum + e.completed, 0),
    }),
    [exams]
  );

  // Navigation handlers
  const handleCreateExam = useCallback(() => {
    setCurrentView("create");
    setSelectedExam(null);
  }, []);

  const handleEditExam = useCallback((exam: Exam) => {
    setSelectedExam(exam);
    setCurrentView("edit");
  }, []);

  const handleViewExamDetails = useCallback((exam: Exam) => {
    setSelectedExam(exam);
    setCurrentView("view-details");
  }, []);

  const handleAddQuestion = useCallback((exam?: Exam) => {
    if (exam) {
      setSelectedExam(exam);
    }
    setCurrentView("add-question");
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentView("list");
    setSelectedExam(null);
  }, []);

  // CRUD Operations
  const handleSaveExam = useCallback(
    (examData: any) => {
      const timestamp = new Date().toISOString();

      if (selectedExam) {
        // Update existing exam
        setExams((prev) =>
          prev.map((exam) =>
            exam.id === selectedExam.id
              ? {
                ...exam,
                ...examData,
                updatedAt: timestamp,
              }
              : exam
          )
        );
        console.log("Exam updated successfully");
      } else {
        // Create new exam
        const newExam: Exam = {
          id: Date.now().toString(),
          title: examData.title,
          subject: examData.subject,
          class: examData.class,
          date: examData.scheduledDate,
          duration: examData.duration,
          passingScore: examData.passingScore || 50,
          instructions: examData.instructions || "",
          totalQuestions: examData.questions?.length || 0,
          totalPoints: examData.totalPoints || 0,
          completed: 0,
          status: "draft",
          questions: examData.questions || [],
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        setExams((prev) => [newExam, ...prev]);
        console.log("Exam created successfully:", newExam);
      }

      handleBackToList();
    },
    [selectedExam, handleBackToList]
  );

  const handleDeleteExam = useCallback((examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams((prev) => prev.filter((exam) => exam.id !== examId));
      console.log("Exam deleted:", examId);
    }
  }, []);

  const handleDuplicateExam = useCallback((exam: Exam) => {
    const timestamp = new Date().toISOString();
    const duplicatedExam: Exam = {
      ...exam,
      id: Date.now().toString(),
      title: `${exam.title} (Copy)`,
      status: "draft",
      completed: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setExams((prev) => [duplicatedExam, ...prev]);
    console.log("Exam duplicated:", duplicatedExam);
  }, []);

  const handleAddQuestionToExam = useCallback(
    (questionData: Question) => {
      if (selectedExam) {
        const updatedExam = {
          ...selectedExam,
          questions: [...(selectedExam.questions || []), questionData],
          totalQuestions: (selectedExam.totalQuestions || 0) + 1,
          totalPoints: (selectedExam.totalPoints || 0) + questionData.points,
          updatedAt: new Date().toISOString(),
        };

        setExams((prev) => prev.map((exam) => (exam.id === selectedExam.id ? updatedExam : exam)));

        setSelectedExam(updatedExam);
        console.log("Question added to exam:", questionData);
      }

      // Stay on add-question view if adding to specific exam
      if (currentView === "add-question" && !selectedExam) {
        handleBackToList();
      }
    },
    [selectedExam, currentView, handleBackToList]
  );

  const handlePublishExam = useCallback((examId: string) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId
          ? { ...exam, status: "scheduled" as const, updatedAt: new Date().toISOString() }
          : exam
      )
    );
    console.log("Exam published:", examId);
  }, []);

  // Render methods
  const renderHeader = () => {
    const headerConfig: any = {
      list: {
        title: "Exam Management",
        subtitle: "Create, edit, and manage your exams and assessments",
        showBack: false,
      },
      create: {
        title: "Create New Exam",
        subtitle: "Design and configure your assessment",
        showBack: true,
        backAction: handleBackToList,
      },
      edit: {
        title: `Edit: ${selectedExam?.title || "Exam"}`,
        subtitle: "Update exam details and questions",
        showBack: true,
        backAction: handleBackToList,
      },
      "view-details": {
        title: selectedExam?.title || "Exam Details",
        subtitle: "View exam information and results",
        showBack: true,
        backAction: handleBackToList,
      },
    };

    const config = headerConfig[currentView];

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {config.showBack && (
            <button
              onClick={config.backAction}
              className="flex items-center text-orange-600 hover:text-orange-700 mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
            <p className="text-gray-600 text-sm mt-1">{config.subtitle}</p>
          </div>
        </div>

        {/* Quick Actions */}
        {currentView === "list" && (
          <div className="flex space-x-3">
            <button
              onClick={handleCreateExam}
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Exam
            </button>
          </div>
        )}
      </div>
    );
  };


  const renderNavigationTabs = () => {
    if (currentView !== "list") return null;

    return (
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-1 inline-flex">
          <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-orange-600 shadow-sm transition-colors">
            <List className="w-4 h-4 inline mr-2" />
            All Exams
          </button>

          <button
            onClick={handleCreateExam}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create New
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">{stats.totalQuestions}</span> Total Questions •{" "}
          <span className="font-medium">{stats.totalStudentsCompleted}</span> Student Submissions
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
      case "edit":
        return (
          <CreateExamForm
            // initialData={selectedExam}
            // onSave={handleSaveExam}
            // onCancel={handleBackToList}
            // onAddQuestion={() => handleAddQuestion(selectedExam || undefined)}
          />
        );

      case "view-details":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Exam Details View</h3>
            <p className="text-gray-600">Detailed view coming soon...</p>
          </div>
        );

      default:
        return (
          <ExamManagement
            // exams={exams}
            // onCreateExam={handleCreateExam}
            // onEditExam={handleEditExam}
            // onDeleteExam={handleDeleteExam}
            // onDuplicateExam={handleDuplicateExam}
            // onAddQuestion={handleAddQuestion}
            // onViewDetails={handleViewExamDetails}
            // onPublishExam={handlePublishExam}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-6 mb-6">
          {renderHeader()}
        </div>

        {/* Navigation & Stats */}
        {renderNavigationTabs()}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default TeacherCbtExam;
