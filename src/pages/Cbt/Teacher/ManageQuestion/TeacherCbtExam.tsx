import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, List, ArrowLeft } from "lucide-react";
import ExamManagement from "./ExamManagement";
import CreateExamForm from "./CreateExamForm";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Store/store";

import {
  fetchAllExamQuestionFailure,
  fetchAllExamQuestionStart,
  fetchAllExamQuestionSuccess,
} from "../../../../Store/cbt/allExamQuestionSlice";
import { cbtTeacherExamService } from "../../../../Services/Cbt/Teacher/cbtTeacherExamService";

import { AllExamQuestionType, ExamFilterParams } from "../../../../Types/Cbt/cbtTypes";
import EditExamForm from "../../../../components/Cbt/teacher/ManageQuestion/EditExamForm";
import ViewExamDetails from "../../../../components/Cbt/teacher/ManageQuestion/ViewExamDetails";

type ViewMode = "list" | "create" | "edit" | "add-question" | "view-details";

const TeacherCbtExam: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const listRecords = useSelector((state: RootState) => state.getAllExamQuestion.listRecords);
  const totalRecords = useSelector((state: RootState) => state.getAllExamQuestion.totalRecords);
  const totalPages = useSelector((state: RootState) => state.getAllExamQuestion.totalPages);
  const fetchedLoading = useSelector((state: RootState) => state.getAllExamQuestion.loading);
  const error = useSelector((state: RootState) => state.getAllExamQuestion.error);

  const [currentView, setCurrentView] = useState<ViewMode>("list");
  const [selectedExam, setSelectedExam] = useState<AllExamQuestionType | null>(null);

  // Backend filter state lives here so it can be passed to ExamManagement
  const [filters, setFilters] = useState<ExamFilterParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  const fetchExams = useCallback(
    async (params?: ExamFilterParams) => {
      dispatch(fetchAllExamQuestionStart());
      try {
        const data = await cbtTeacherExamService.getExams(params);
        dispatch(fetchAllExamQuestionSuccess(data));
      } catch (err) {
        dispatch(fetchAllExamQuestionFailure((err as Error).message));
      }
    },
    [dispatch],
  );

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchExams(filters);
  }, [filters]);

  const handleFilterChange = useCallback((updated: ExamFilterParams) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleCreateExam = useCallback(() => {
    setCurrentView("create");
    setSelectedExam(null);
  }, []);

  const handleEditExam = useCallback((exam: AllExamQuestionType) => {
    setSelectedExam(exam);
    setCurrentView("edit");
  }, []);

  const handleViewExamDetails = useCallback((exam: AllExamQuestionType) => {
    setSelectedExam(exam);
    setCurrentView("view-details");
  }, []);

  const handleBackToList = useCallback(() => {
    setCurrentView("list");
    setSelectedExam(null);
  }, []);

  const renderHeader = () => {
    const headerConfig: Record<string, any> = {
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
            <button onClick={config.backAction} className="flex items-center text-orange-600 mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
            <p className="text-gray-600 text-sm">{config.subtitle}</p>
          </div>
        </div>

        {currentView === "list" && (
          <button
            onClick={handleCreateExam}
            className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </button>
        )}
      </div>
    );
  };

  const renderNavigationTabs = () => {
    if (currentView !== "list") return null;
    return (
      <div className="flex justify-between mb-6">
        <div className="bg-orange-50 border rounded-xl p-1 inline-flex">
          <button className="px-4 py-2 rounded-lg bg-white text-orange-600 shadow-sm">
            <List className="w-4 h-4 inline mr-2" />
            All Exams
          </button>
          <button
            onClick={handleCreateExam}
            className="px-4 py-2 text-gray-600 hover:text-orange-600"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create New
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalRecords}</span> Total Exams
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return <CreateExamForm />;

      case "edit":
        return selectedExam ? (
          <div className="p-6">
            <EditExamForm exam={selectedExam} onDone={handleBackToList} />
          </div>
        ) : null;

      case "view-details":
        return selectedExam ? (
          <div className="p-6">
            <ViewExamDetails exam={selectedExam} />
          </div>
        ) : null;

      // case "view-details":
      //   return (
      //     <div className="p-6">
      //       <h3 className="text-lg font-semibold mb-4">Exam Details</h3>
      //       <p className="text-gray-600">Detailed view coming soon...</p>
      //     </div>
      //   );

      default:
        return (
          <ExamManagement
            exams={listRecords}
            totalRecords={totalRecords}
            totalPages={totalPages}
            currentPage={filters.pageNumber ?? 1}
            pageSize={filters.pageSize ?? 10}
            loading={fetchedLoading}
            onFilterChange={handleFilterChange}
            onEditExam={handleEditExam}
            onDeleteExam={() => {}}
            onDuplicateExam={() => {}}
            onViewDetails={handleViewExamDetails}
          />
        );
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">{renderHeader()}</div>
        {renderNavigationTabs()}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};

export default TeacherCbtExam;
