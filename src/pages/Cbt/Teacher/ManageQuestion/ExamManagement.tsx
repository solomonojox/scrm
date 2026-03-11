import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  Clock4,
  FileText,
  Trash2,
  Edit,
  Copy,
  MoreVertical,
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  duration: number;
  totalQuestions: number;
  completed: number;
  totalStudents: number;
  averageScore: number;
  passingScore: number;
  status: "scheduled" | "active" | "completed" | "draft";
}

type SortField = "title" | "subject" | "class" | "date" | "completed" | "averageScore";
type SortOrder = "asc" | "desc";

interface Props {
  exams: any[];
  onCreateExam: () => void;
  onEditExam: (exam: any) => void;
  onDeleteExam: (exam: any) => void;
  onDuplicateExam: (exam: any) => void;
  onAddQuestion: (exam: any) => void;
  onViewDetails: (exam: any) => void;
  onPublishExam: (exam: any) => void;
}

const ExamManagement: React.FC<Props> = () => {
  const [exams] = useState<Exam[]>([
    {
      id: "1",
      title: "Mathematics Final Exam",
      subject: "Mathematics",
      class: "Grade 12A",
      date: "2025-11-15",
      duration: 90,
      totalQuestions: 50,
      completed: 45,
      totalStudents: 50,
      averageScore: 78.5,
      passingScore: 50,
      status: "scheduled",
    },
    {
      id: "2",
      title: "Physics Mid-term Test",
      subject: "Physics",
      class: "Grade 11B",
      date: "2025-10-28",
      duration: 60,
      totalQuestions: 30,
      completed: 28,
      totalStudents: 35,
      averageScore: 72.3,
      passingScore: 50,
      status: "active",
    },
    {
      id: "3",
      title: "Chemistry Quiz",
      subject: "Chemistry",
      class: "Grade 10A",
      date: "2025-10-20",
      duration: 30,
      totalQuestions: 20,
      completed: 32,
      totalStudents: 32,
      averageScore: 85.2,
      passingScore: 50,
      status: "completed",
    },
    {
      id: "4",
      title: "English Literature Essay",
      subject: "English",
      class: "Grade 12B",
      date: "2025-11-20",
      duration: 120,
      totalQuestions: 5,
      completed: 0,
      totalStudents: 40,
      averageScore: 0,
      passingScore: 50,
      status: "draft",
    },
    {
      id: "5",
      title: "Biology Practical Test",
      subject: "Biology",
      class: "Grade 11A",
      date: "2025-11-10",
      duration: 45,
      totalQuestions: 25,
      completed: 38,
      totalStudents: 38,
      averageScore: 68.7,
      passingScore: 50,
      status: "completed",
    },
    {
      id: "6",
      title: "History World War II",
      subject: "History",
      class: "Grade 10B",
      date: "2025-11-25",
      duration: 60,
      totalQuestions: 40,
      completed: 0,
      totalStudents: 30,
      averageScore: 0,
      passingScore: 50,
      status: "scheduled",
    },
    {
      id: "7",
      title: "Computer Science Algorithms",
      subject: "Computer Science",
      class: "Grade 12A",
      date: "2025-11-12",
      duration: 90,
      totalQuestions: 35,
      completed: 12,
      totalStudents: 45,
      averageScore: 81.4,
      passingScore: 50,
      status: "active",
    },
    {
      id: "8",
      title: "Geography Climate Change",
      subject: "Geography",
      class: "Grade 11B",
      date: "2025-10-15",
      duration: 50,
      totalQuestions: 30,
      completed: 35,
      totalStudents: 35,
      averageScore: 76.8,
      passingScore: 50,
      status: "completed",
    },
  ]);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique subjects for filter
  const subjects = useMemo(() => {
    return Array.from(new Set(exams.map((exam) => exam.subject))).sort();
  }, [exams]);

  // Filter and sort logic
  const filteredAndSortedExams = useMemo(() => {
    let filtered = [...exams];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.subject.toLowerCase().includes(query) ||
          exam.class.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((exam) => exam.status === statusFilter);
    }

    // Subject filter
    if (subjectFilter !== "all") {
      filtered = filtered.filter((exam) => exam.subject === subjectFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [exams, searchQuery, statusFilter, subjectFilter, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedExams.length / itemsPerPage);
  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedExams.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedExams, currentPage, itemsPerPage]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    console.log("Exporting to CSV...");
    // Implementation would go here
  };

  // Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="w-4 h-4 text-orange-500" />;
      case "active":
        return <PlayCircle className="w-4 h-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "draft":
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock4 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "active":
        return "bg-green-100 text-green-800 border border-green-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getCompletionColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return "text-green-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-gray-600";
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUpDown className="w-4 h-4 text-orange-500" />
    ) : (
      <ArrowUpDown className="w-4 h-4 text-orange-500" />
    );
  };

  // Stats
  const stats = useMemo(
    () => ({
      total: exams.length,
      active: exams.filter((e) => e.status === "active").length,
      completed: exams.filter((e) => e.status === "completed").length,
      scheduled: exams.filter((e) => e.status === "scheduled").length,
    }),
    [exams]
  );

  return (
    <div className="font-sans">
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-orange-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exam Results</h2>
            <p className="text-gray-600 text-sm mt-1">
              Showing {filteredAndSortedExams.length} of {exams.length} exams
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-700">Total Exams</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-700">Active</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            <div className="text-sm text-gray-700">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.scheduled}</div>
            <div className="text-sm text-gray-700">Scheduled</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search exams by title, subject, or class..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${showFilters
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-orange-200 hover:bg-orange-50"
                }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={subjectFilter}
                    onChange={(e) => {
                      setSubjectFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items per page */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items per page
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="w-full border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-orange-50">
                <th
                  className="text-left truncate p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center">
                    Exam Title
                    {renderSortIcon("title")}
                  </div>
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("subject")}
                >
                  <div className="flex items-center">
                    Subject
                    {renderSortIcon("subject")}
                  </div>
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("class")}
                >
                  <div className="flex items-center">
                    Class
                    {renderSortIcon("class")}
                  </div>
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    {renderSortIcon("date")}
                  </div>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200">
                  Duration
                </th>
                <th
                  className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("completed")}
                >
                  <div className="flex items-center">
                    Progress
                    {renderSortIcon("completed")}
                  </div>
                </th>
                <th
                  className="text-left truncate p-3 text-sm font-semibold text-gray-700 border-b border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleSort("averageScore")}
                >
                  <div className="flex items-center">
                    Avg Score
                    {renderSortIcon("averageScore")}
                  </div>
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200">
                  Status
                </th>
                <th className="text-left p-3 text-sm font-semibold text-gray-700 border-b border-orange-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedExams.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium">No exams found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                paginatedExams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="hover:bg-orange-50 transition-colors border-b border-orange-100"
                  >
                    <td className="p-3 truncate">
                      <div className="font-medium text-gray-800">{exam.title}</div>
                      <div className="text-xs text-gray-500">{exam.totalQuestions} questions</div>
                    </td>
                    <td className="p-3 truncate text-gray-700">{exam.subject}</td>
                    <td className="p-3 truncate text-gray-700">{exam.class}</td>
                    <td className="p-3 truncate">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-orange-500" />
                        {exam.date}
                      </div>
                    </td>
                    <td className="p-3 truncate">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-orange-500" />
                        {exam.duration} min
                      </div>
                    </td>
                    <td className="p-3 truncate">
                      <div
                        className={`font-medium ${getCompletionColor(
                          exam.completed,
                          exam.totalStudents
                        )}`}
                      >
                        {exam.completed}/{exam.totalStudents}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${(exam.completed / exam.totalStudents) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-800">
                        {exam.averageScore > 0 ? `${exam.averageScore.toFixed(1)}%` : "N/A"}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          exam.status
                        )}`}
                      >
                        {getStatusIcon(exam.status)}
                        <span className="ml-1.5 capitalize">{exam.status}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-orange-100">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedExams.length)} of{" "}
              {filteredAndSortedExams.length} results
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-orange-200 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                        ? "bg-orange-500 text-white"
                        : "border border-orange-200 text-gray-700 hover:bg-orange-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-orange-200 rounded-lg hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;
