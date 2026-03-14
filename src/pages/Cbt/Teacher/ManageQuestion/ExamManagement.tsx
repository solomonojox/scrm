import React, { useState, useMemo, useCallback } from "react";
import {
  Search, Download, Eye, Filter, ChevronLeft, ChevronRight,
  ArrowUpDown, Calendar, Clock, CheckCircle, PlayCircle,
  FileText, Edit, Copy,
} from "lucide-react";
import { AllExamQuestionType, ExamFilterParams } from "../../../../Types/Cbt/cbtTypes";

type SortField = "title" | "subjectName" | "examType" | "examDate" | "averageScore" | "progress";
type SortOrder = "asc" | "desc";

interface Props {
  exams: AllExamQuestionType[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  onFilterChange: (params: ExamFilterParams) => void;
  onEditExam?: (exam: AllExamQuestionType) => void;
  onDeleteExam?: (exam: AllExamQuestionType) => void;
  onDuplicateExam?: (exam: AllExamQuestionType) => void;
  onViewDetails?: (exam: AllExamQuestionType) => void;
}

const ExamManagement: React.FC<Props> = ({
  exams,
  totalRecords,
  totalPages,
  currentPage,
  pageSize,
  loading,
  onFilterChange,
  onEditExam,
  onDuplicateExam,
  onViewDetails,
  onDeleteExam,
}) => {
  // Local UI state for inputs (debounce-friendly)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");
  const [termFilter, setTermFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique filter options from current page data
  // (or you can hardcode known values for exam types / terms)
  const subjects = useMemo(() => Array.from(new Set(exams.map((e) => e.subjectName))).sort(), [exams]);
  const examTypes = useMemo(() => Array.from(new Set(exams.map((e) => e.examType))).sort(), [exams]);
  const terms = useMemo(() => Array.from(new Set(exams.map((e) => e.term))).sort(), [exams]);
  const statuses = useMemo(() => Array.from(new Set(exams.map((e) => e.status))).sort(), [exams]);

  const pushFilters = useCallback(
    (overrides: Partial<ExamFilterParams>) => {
      onFilterChange({
        pageNumber: 1, // reset to page 1 on any filter change
        pageSize,
        searchQuery: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        subjectName: subjectFilter !== "all" ? subjectFilter : undefined,
        examType: examTypeFilter !== "all" ? examTypeFilter : undefined,
        term: termFilter !== "all" ? termFilter : undefined,
        ...overrides,
      });
    },
    [onFilterChange, pageSize, searchQuery, statusFilter, subjectFilter, examTypeFilter, termFilter],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    pushFilters({ searchQuery: value || undefined, pageNumber: 1 });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    pushFilters({ status: value !== "all" ? value : undefined, pageNumber: 1 });
  };

  const handleSubjectChange = (value: string) => {
    setSubjectFilter(value);
    pushFilters({ subjectName: value !== "all" ? value : undefined, pageNumber: 1 });
  };

  const handleExamTypeChange = (value: string) => {
    setExamTypeFilter(value);
    pushFilters({ examType: value !== "all" ? value : undefined, pageNumber: 1 });
  };

  const handleTermChange = (value: string) => {
    setTermFilter(value);
    pushFilters({ term: value !== "all" ? value : undefined, pageNumber: 1 });
  };

  const handlePageSizeChange = (value: number) => {
    onFilterChange({ pageNumber: 1, pageSize: value });
  };

  const handlePageChange = (page: number) => {
    pushFilters({ pageNumber: page });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSubjectFilter("all");
    setExamTypeFilter("all");
    setTermFilter("all");
    onFilterChange({ pageNumber: 1, pageSize });
  };

  const exportToCSV = () => {
    const headers = ["Title","Subject","Exam Type","Term","Session","Duration (min)","Questions","Total Students","Avg Score","Progress","Status"];
    const rows = exams.map((e) => [e.title,e.subjectName,e.examType,e.term,e.academicSession,e.durationMinutes,e.totalQuestions,e.totalStudents,e.averageScore,e.progress,e.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exams.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Helpers (unchanged from your original) ──
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE": return <PlayCircle className="w-4 h-4 text-green-500" />;
      case "COMPLETED": return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE": return "bg-green-100 text-green-800 border border-green-200";
      case "COMPLETED": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "SCHEDULED": return "bg-orange-100 text-orange-800 border border-orange-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getExamTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      JAMB: "bg-purple-100 text-purple-700",
      WAEC: "bg-teal-100 text-teal-700",
      GCE: "bg-indigo-100 text-indigo-700",
      NECO: "bg-pink-100 text-pink-700",
      INTERNAL: "bg-yellow-100 text-yellow-700",
    };
    return colors[type] ?? "bg-gray-100 text-gray-700";
  };

  const stats = useMemo(() => ({
    total: totalRecords,
    draft: exams.filter((e) => e.status.toUpperCase() === "DRAFT").length,
    active: exams.filter((e) => e.status.toUpperCase() === "ACTIVE").length,
    completed: exams.filter((e) => e.status.toUpperCase() === "COMPLETED").length,
  }), [exams, totalRecords]);

  return (
    <div className="font-sans">
      <div className="bg-white shadow-sm border border-orange-100 rounded-xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-orange-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Exam Management</h2>
            <p className="text-gray-500 text-sm mt-1">
              Showing {exams.length} of {totalRecords} exams
              <span className="ml-1 text-orange-500">(Page {currentPage} of {totalPages})</span>
            </p>
          </div>
          <button onClick={exportToCSV} className="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Exams", value: stats.total, color: "blue" },
            { label: "Draft", value: stats.draft, color: "gray" },
            { label: "Active", value: stats.active, color: "green" },
            { label: "Completed", value: stats.completed, color: "orange" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
              <div className={`text-2xl font-bold text-${color}-600`}>{value}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, subject, type, term…"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${showFilters ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-700 border-orange-200 hover:bg-orange-50"}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: "Status", value: statusFilter, onChange: handleStatusChange, options: statuses },
                  { label: "Subject", value: subjectFilter, onChange: handleSubjectChange, options: subjects },
                  { label: "Exam Type", value: examTypeFilter, onChange: handleExamTypeChange, options: examTypes },
                  { label: "Term", value: termFilter, onChange: handleTermChange, options: terms },
                ].map(({ label, value, onChange, options }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <select
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full border border-orange-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    >
                      <option value="all">All</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Per page</label>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="w-full border border-orange-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={clearFilters} className="text-xs text-orange-600 hover:text-orange-700 font-semibold">
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table — unchanged from your original */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-50">
                {(["Exam Title","Subject","Type","Term","Session","Date","Duration","Questions","Students","Avg Score","Progress","Status","Actions"]).map((label) => (
                  <th key={label} className="text-left p-3 font-semibold text-gray-700 border-b border-orange-200 whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-gray-400">Loading…</td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium">No exams found</p>
                    <p className="text-xs mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-orange-50 transition-colors border-b border-orange-100">
                    <td className="p-3 max-w-48"><div className="font-medium text-gray-800 truncate">{exam.title}</div></td>
                    <td className="p-3 text-gray-700 whitespace-nowrap">{exam.subjectName}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getExamTypeColor(exam.examType)}`}>{exam.examType}</span>
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap capitalize">{exam.term.toLowerCase()}</td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">{exam.academicSession}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                        {exam.examDate ?? <span className="text-gray-400 italic">—</span>}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
                        {exam.durationMinutes} min
                      </div>
                    </td>
                    <td className="p-3 text-center text-gray-700 font-medium">{exam.totalQuestions}</td>
                    <td className="p-3 text-center text-gray-700 font-medium">{exam.totalStudents}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold text-gray-800">{exam.averageScore > 0 ? `${exam.averageScore.toFixed(1)}%` : exam.averageScore}</span>
                    </td>
                    <td className="p-3 min-w-24">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${exam.progress === 0 ? 1 : exam.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8 text-right">{exam.progress}%</span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {getStatusIcon(exam.status)}
                        <span className="ml-1 capitalize">{exam.status.toLowerCase()}</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <button onClick={() => onViewDetails?.(exam)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => onEditExam?.(exam)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                        {/* <button onClick={() => onDuplicateExam?.(exam)} className="p-1.5 text-gray-600 hover:bg-gray-50 rounded transition-colors" title="Duplicate"><Copy className="w-4 h-4" /></button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination — now driven by backend totalPages */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-orange-100 gap-3">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages} · {totalRecords} total
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 border border-orange-200 rounded-lg hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                  else p = currentPage - 2 + i;
                }
                return (
                  <button key={p} onClick={() => handlePageChange(p)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === p ? "bg-orange-500 text-white" : "border border-orange-200 text-gray-700 hover:bg-orange-50"}`}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 border border-orange-200 rounded-lg hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;