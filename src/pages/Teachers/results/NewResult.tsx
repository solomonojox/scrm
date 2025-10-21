import {
  Save,
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  Search,
  ArrowLeft,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AppDispatch, RootState } from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../Context/Auth/useAuth";
import Select from "react-select";
import { classroomService } from "../../../Services/Classroom";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import { subjectService } from "../../../Services/Subject";
import {
  fetchSubjectFailure,
  fetchSubjectStart,
  fetchSubjectSuccess,
} from "../../../Store/subjectSlice";
import { sessionService } from "../../../Services/Session";
import {
  fetchSessionFailure,
  fetchSessionStart,
  fetchSessionSuccess,
} from "../../../Store/sessionSlice";
import { 
  fetchClassroomStudentsFailure, 
  fetchClassroomStudentsStart, 
  fetchClassroomStudentsSuccess 
} from "../../../Store/Admin/classroomStudentsSlice";
import { resultService } from "../../../Services/Results";
import { useNavigate } from "react-router-dom";

interface OptionType {
  value: string | number;
  label: string;
}

interface StudentResult {
  ca1?: number | string;
  ca2?: number | string;
  exam?: number | string;
  remarks?: string;
}

interface ResultsState {
  [studentId: string]: StudentResult;
}

interface SubjectFormData {
  subjectName: string;
  description: string;
}

const NewResult = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords || []);
  const students = useSelector((state: RootState) => state.getStudentsByClassId?.listRecords || []);
  const studentsLoading = useSelector((state: RootState) => state.getStudentsByClassId?.loading);
  const fetchedLoading = useSelector((state: RootState) => state.getSessionTerm.loading);
  const error = useSelector((state: RootState) => state.getSessionTerm.error);
  const subjects = useSelector((state: RootState) => state.getSubject?.listRecords || []);
  const subjectsLoading = useSelector((state: RootState) => state.getSubject?.loading);
  
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ResultsState>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [classFilter, setClassFilter] = useState("all");
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  const [formData, setFormData] = useState({
    currentTerm: "1",
    sessionId: "",
  });

  const [subjectFormData, setSubjectFormData] = useState<SubjectFormData>({
    subjectName: "",
    description: "",
  });

  // Fetch sessions and classrooms on component mount
  useEffect(() => {
    fetchResultRecords();
  }, [dispatch]);

  // Fetch subjects and students when classroom is selected
  useEffect(() => {
    if (selectedClassroomId && user?.schoolId) {
      fetchSubjectsByClassroom();
      fetchStudentsByClassroom();
    } else {
      // Clear subjects and students when no classroom is selected
      dispatch(fetchSubjectSuccess([]));
      dispatch(fetchClassroomStudentsSuccess([]));
      setSelectedSubjectId("");
    }
  }, [selectedClassroomId, user?.schoolId]);

  const fetchResultRecords = async () => {
    dispatch(fetchSessionStart());
    dispatch(fetchClassroomsStart());

    try {
      // Fetch sessions
      const sessionData = await sessionService.getAllRegisteredSessions(user?.schoolId);

      // Fetch classrooms for the teacher
      const classData = await classroomService.getClassroomByTeacherId(user?.id);

      dispatch(fetchSessionSuccess(sessionData));
      dispatch(fetchClassroomsSuccess(classData));
    } catch (err) {
      dispatch(fetchSessionFailure((err as Error).message));
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  const fetchSubjectsByClassroom = async () => {
    if (!selectedClassroomId || !user?.schoolId) return;

    dispatch(fetchSubjectStart());
    try {
      const subjectData = await subjectService.getAlSubjectByClassIdAndSchoolId(
        user.schoolId,
        selectedClassroomId
      );
      dispatch(fetchSubjectSuccess(subjectData));
    } catch (err) {
      dispatch(fetchSubjectFailure((err as Error).message));
      setErrorMessage("Failed to load subjects for this class");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const fetchStudentsByClassroom = async () => {
    if (!selectedClassroomId) return;

    dispatch(fetchClassroomStudentsStart());
    try {
      const studentData = await classroomService.getStudentsByClassroomId(selectedClassroomId);
      dispatch(fetchClassroomStudentsSuccess(studentData));
    } catch (err) {
      dispatch(fetchClassroomStudentsFailure((err as Error).message));
      setErrorMessage("Failed to load students for this class");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(results).length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [results]);

  const handleClassSelect = (classroomId: string) => {
    setSelectedClassroomId(classroomId);
    setSearchTerm("");
    setShowClassDropdown(false);
    setResults({}); // Clear previous results when class changes
  };

  const sessionOptions: OptionType[] = sessions.map((session: any) => ({
    value: session?.sessionKey || session?.sessionId,
    label: session?.sessionId || session?.sessionName,
  }));

  const subjectOptions: OptionType[] = subjects.map((subject: any) => ({
    value: subject?.subjectId || subject?.id,
    label: subject?.subjectName || subject?.name,
  }));

  const termOptions: OptionType[] = [
    { value: "1", label: "First Term" },
    { value: "2", label: "Second Term" },
    { value: "3", label: "Third Term" },
  ];

  // Group classrooms by level for better organization
  const groupedClasses = useMemo(() => {
    const groups: { [key: string]: typeof classrooms } = {};

    classrooms.forEach((cls) => {
      const level = cls.name.replace(/[0-9]/g, "").replace(/[A-Z]$/, "");
      if (!groups[level]) {
        groups[level] = [];
      }
      groups[level].push(cls);
    });

    return groups;
  }, [classrooms]);

  const filteredClassrooms = useMemo(() => {
    if (classFilter === "all") return classrooms;
    return classrooms.filter((cls) => cls.name.startsWith(classFilter));
  }, [classFilter, classrooms]);

  const getSelectedOption = (value: string, options: OptionType[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const handleSelectChange = (name: string, selectedOption: OptionType | null) => {
    if (name === "sessionId" || name === "currentTerm") {
      setFormData((prev) => ({
        ...prev,
        [name]: selectedOption ? String(selectedOption.value) : "",
      }));
    } else if (name === "subjectId") {
      setSelectedSubjectId(selectedOption ? String(selectedOption.value) : "");
    }
  };

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    if (field === "remarks") {
      setResults((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value,
        },
      }));
    } else {
      const numValue = value === "" ? "" : Math.min(Math.max(0, parseInt(value) || 0), 100);
      setResults((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: numValue,
        },
      }));
    }
  };

  const calculateTotal = (studentId: string): number => {
    const student = results[studentId] || {};
    const ca1 = parseInt(String(student.ca1)) || 0;
    const ca2 = parseInt(String(student.ca2)) || 0;
    const exam = parseInt(String(student.exam)) || 0;
    return ca1 + ca2 + exam;
  };

  const getGrade = (total: number): { grade: string; color: string } => {
    if (total >= 90) return { grade: "A", color: "text-green-600" };
    if (total >= 80) return { grade: "B", color: "text-blue-600" };
    if (total >= 70) return { grade: "C", color: "text-yellow-600" };
    if (total >= 60) return { grade: "D", color: "text-orange-600" };
    if (total >= 50) return { grade: "E", color: "text-red-500" };
    return { grade: "F", color: "text-red-700" };
  };

  const validateResults = (): boolean => {
    for (const studentId in results) {
      const student = results[studentId];
      const ca1 = parseInt(String(student.ca1)) || 0;
      const ca2 = parseInt(String(student.ca2)) || 0;
      const exam = parseInt(String(student.exam)) || 0;

      if (ca1 > 20 || ca2 > 20 || exam > 60) {
        setErrorMessage("One or more scores exceed maximum allowed values");
        return false;
      }
    }
    return true;
  };

  const handleAddSubject = async () => {
    if (!subjectFormData.subjectName.trim()) {
      setErrorMessage("Subject name is required");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setAddingSubject(true);

    try {
      const payload = {
        schoolId: user?.schoolId,
        classroomId: selectedClassroomId,
        teacherId: user?.id,
        subjectName: subjectFormData.subjectName,
        description: subjectFormData.description,
      };

      const res = await subjectService.addSubject(payload);
      if (res) {
        fetchSubjectsByClassroom();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setSubjectFormData({ subjectName: "", description: "" });
        setShowSubjectModal(false);
      }
    } catch (error) {
      setErrorMessage("Failed to add subject. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setAddingSubject(false);
    }
  };

  const handleSaveResults = async () => {
    if (!validateResults()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setSaving(true);

    try {
      // Transform results to match API payload format
      const scores = Object.entries(results).map(([studentId, result]) => ({
        studentId: studentId,
        cA1: parseInt(String(result.ca1)) || 0,
        cA2: parseInt(String(result.ca2)) || 0,
        examScore: parseInt(String(result.exam)) || 0,
        remarks: result.remarks || "",
      }));

      const payload = [
        {
          schoolId: user?.schoolId ,
          classroomId: selectedClassroomId,
          subjectId: selectedSubjectId,
          sessionId: formData.sessionId,
          term: formData.currentTerm,
          scores: scores,
        },
      ];
      const res = await resultService.addResult(payload); 

      console.log(res)
     if (res.status === true) {
        setShowSuccess(true);
        setResults({});
        setTimeout(() => setShowSuccess(false), 5000);
        navigate("/teacher/results");
      }


    } catch (error) {
      setErrorMessage("Failed to save results. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Get current students based on selected classroom
  const currentStudents = students;
  const filteredStudents = useMemo(() => {
    return currentStudents.filter((student: any) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentStudents, searchTerm]);

  // Memoize student totals for performance
  const studentTotals = useMemo(() => {
    return filteredStudents.reduce((acc, student) => {
      acc[student.id] = calculateTotal(student.id);
      return acc;
    }, {} as Record<string, number>);
  }, [filteredStudents, results]);

  const isFormValid =
    selectedClassroomId &&
    selectedSubjectId &&
    formData.sessionId &&
    formData.currentTerm &&
    Object.keys(results).length > 0;

  const selectedClassroom = selectedClassroomId
    ? classrooms.find((c) => c.id === selectedClassroomId || c.classroomId === selectedClassroomId)
    : null;

  const selectedClassName = selectedClassroom?.name || "";

  return (
    <div className="min-h-screen">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Operation successful!</span>
        </div>
      )}

      {/* Error Notification */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <XCircle className="w-6 h-6" />
          <span className="font-bold">{errorMessage}</span>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#EE7306]" />
                Add New Subject
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Name <span className="text-red-700">*</span>
                </label>
                <input
                  type="text"
                  value={subjectFormData.subjectName}
                  onChange={(e) =>
                    setSubjectFormData((prev) => ({ ...prev, subjectName: e.target.value }))
                  }
                  className="w-full border border-orange-200 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all"
                  placeholder="e.g., Mathematics"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={subjectFormData.description}
                  onChange={(e) =>
                    setSubjectFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full border border-orange-200 rounded-md py-3 px-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all resize-none"
                  placeholder="Enter subject description"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-gray-600 border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubject}
                  disabled={addingSubject || !subjectFormData.subjectName.trim()}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                    addingSubject || !subjectFormData.subjectName.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#EE7306] to-[#EE7306]/70 hover:shadow-lg"
                  }`}
                >
                  {addingSubject ? "Adding..." : "Add Subject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start">
              <button
                onClick={() => window.history.back()}
                className="p-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EE7306] to-[#EE7306]/70 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Result Entry</h1>
                <p className="text-sm text-gray-600">Create report cards for your classes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 lg:py-10">
        {/* Selection Panel */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#EE7306]" />
            Session & Subject Selection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Term Selection */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Term <span className="text-red-700">*</span>
              </label>
              <Select
                options={termOptions}
                value={getSelectedOption(formData.currentTerm, termOptions)}
                onChange={(selected) => handleSelectChange("currentTerm", selected)}
                placeholder="Select Term"
                className="text-sm"
                required
              />
            </div>

            {/* Session Selection */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Session <span className="text-red-700">*</span>
              </label>
              <Select
                options={sessionOptions}
                value={getSelectedOption(formData.sessionId, sessionOptions)}
                onChange={(selected) => handleSelectChange("sessionId", selected)}
                placeholder="Select Session"
                className="text-sm"
                isSearchable
                required
              />
            </div>

            {/* Class Selection Dropdown */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Class <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                  className={`w-full flex items-center justify-between p-3 border rounded-lg text-left text-sm transition-colors ${
                    selectedClassroomId
                      ? "border-[#EE7306] bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span
                    className={selectedClassroomId ? "text-gray-800 font-medium" : "text-gray-500"}
                  >
                    {selectedClassName || "Select Class"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      showClassDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showClassDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                    {/* Class Filter Tabs */}
                    <div className="p-2 border-b border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => setClassFilter("all")}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            classFilter === "all"
                              ? "bg-[#EE7306] text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          All
                        </button>
                        {Object.keys(groupedClasses).map((level) => (
                          <button
                            key={level}
                            onClick={() => setClassFilter(level)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                              classFilter === level
                                ? "bg-[#EE7306] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Class List */}
                    <div className="p-2">
                      {filteredClassrooms.map((cls: any) => (
                        <button
                          key={cls.id || cls.classroomId}
                          onClick={() => handleClassSelect(cls.id || cls.classroomId)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg mb-1 last:mb-0 transition-colors ${
                            selectedClassroomId === (cls.id || cls.classroomId)
                              ? "bg-[#EE7306] text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium text-sm">{cls.name}</div>
                            <div
                              className={`text-xs ${
                                selectedClassroomId === (cls.id || cls.classroomId)
                                  ? "text-orange-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {cls.studentCount || cls.students || 0} students
                            </div>
                          </div>
                          {selectedClassroomId === (cls.id || cls.classroomId) && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                      {filteredClassrooms.length === 0 && (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          No classes found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subject Selection */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject <span className="text-red-700">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    options={subjectOptions}
                    value={getSelectedOption(selectedSubjectId, subjectOptions)}
                    onChange={(selected) => handleSelectChange("subjectId", selected)}
                    placeholder={subjectsLoading ? "Loading subjects..." : "Select Subject"}
                    className="text-sm"
                    isSearchable
                    required
                    isDisabled={!selectedClassroomId || subjectsLoading}
                    isLoading={subjectsLoading}
                  />
                </div>
                <button
                  onClick={() => setShowSubjectModal(true)}
                  disabled={!selectedClassroomId}
                  className={`px-4 py-2 rounded-sm transition-all flex items-center gap-2 ${
                    selectedClassroomId
                      ? "bg-[#EE7306] hover:bg-[#EE7306]/90 text-white shadow-sm hover:shadow-md"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  title={!selectedClassroomId ? "Select a class first" : "Add new subject"}
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Add Subject</span>
                </button>
              </div>
              {!selectedClassroomId && (
                <p className="text-xs text-gray-500 mt-1">Select a class first to choose subject</p>
              )}
              {selectedClassroomId && subjects.length === 0 && !subjectsLoading && (
                <p className="text-xs text-orange-600 mt-1">No subjects found for this class</p>
              )}
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedClassroomId || selectedSubjectId) && (
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {selectedClassroomId && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Class:</span>
                    <span className="font-bold text-blue-700">{selectedClassName}</span>
                  </div>
                )}
                {selectedSubjectId && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Subject:</span>
                    <span className="font-bold text-purple-700">
                      {getSelectedOption(selectedSubjectId, subjectOptions)?.label}
                    </span>
                  </div>
                )}
                {formData.currentTerm && (
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Term:</span>
                    <span className="font-bold text-green-700">
                      {getSelectedOption(formData.currentTerm, termOptions)?.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats & Max Scores Info */}
        {selectedClassroomId && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-xl font-bold text-gray-800">
                      {studentsLoading ? "..." : currentStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Results Entered</p>
                    <p className="text-xl font-bold text-gray-800">
                      {Object.keys(results).length}/{currentStudents.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Subject</p>
                    <p className="text-lg font-bold text-gray-800 truncate">
                      {getSelectedOption(selectedSubjectId, subjectOptions)?.label ||
                        "Not selected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 shadow-sm">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span>📊</span> Max Scores
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CA1:</span>
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CA2:</span>
                  <span className="font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">20</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exam:</span>
                  <span className="font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    60
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                  <span className="text-gray-700 font-semibold">Total:</span>
                  <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    100
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Student Results Entry - Only show when all conditions are met */}
        {selectedClassroomId && selectedSubjectId && formData.sessionId && formData.currentTerm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#EE7306]" />
                  <input
                    type="text"
                    placeholder="Search students by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all bg-white"
                    aria-label="Search students"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {studentsLoading ? (
                    "Loading students..."
                  ) : (
                    `Showing ${filteredStudents.length} of ${currentStudents.length} students`
                  )}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {studentsLoading && (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE7306] mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading students...</p>
              </div>
            )}

            {/* Empty State for Students */}
            {!studentsLoading && currentStudents.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Found</h3>
                <p className="text-gray-600">There are no students enrolled in this class.</p>
              </div>
            )}

            {/* Students Table - Only show when students are loaded and available */}
            {!studentsLoading && currentStudents.length > 0 && (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#EE7306] to-[#EE7306]/90 text-white">
                        <th className="py-4 px-4 text-left text-xs font-bold uppercase">S/N</th>
                        <th className="py-4 px-4 text-left text-xs font-bold uppercase">
                          Student Name
                        </th>
                        <th className="py-4 px-4 text-left text-xs font-bold uppercase">Student ID</th>
                        <th className="py-4 px-4 text-center text-xs font-bold uppercase">CA1 (20)</th>
                        <th className="py-4 px-4 text-center text-xs font-bold uppercase">CA2 (20)</th>
                        <th className="py-4 px-4 text-center text-xs font-bold uppercase">Exam (60)</th>
                        <th className="py-4 px-4 text-center text-xs font-bold uppercase">
                          Total (100)
                        </th>
                        <th className="py-4 px-4 text-center text-xs font-bold uppercase">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student: any, idx: number) => {
                        const total = studentTotals[student.studentId] || 0;
                        const { grade, color } = getGrade(total);

                        return (
                          <tr
                            key={idx}
                            className={`border-b ${
                              idx % 2 === 0 ? "bg-white" : "bg-orange-50"
                            } hover:bg-orange-100 transition-colors`}
                          >
                            <td className="py-3 px-4 text-sm font-semibold text-gray-700">{idx + 1}</td>
                            <td className="py-3 px-4 text-sm font-bold text-gray-800">
                              { `${student.firstname} ${student.lastname}`}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                              {student.studentNo}
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={results[student.studentId]?.ca1 || ""}
                                onChange={(e) => handleScoreChange(student.studentId, "ca1", e.target.value)}
                                className="w-20 border border-orange-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-[#EE7306] transition-all"
                                placeholder="0"
                                aria-label={`CA1 score for ${student.firstname}`}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={results[student.studentId]?.ca2 || ""}
                                onChange={(e) => handleScoreChange(student.studentId, "ca2", e.target.value)}
                                className="w-20 border border-orange-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-[#EE7306] transition-all"
                                placeholder="0"
                                aria-label={`CA2 score for ${student.firstname}`}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min="0"
                                max="60"
                                value={results[student.studentId]?.exam || ""}
                                onChange={(e) => handleScoreChange(student.studentId, "exam", e.target.value)}
                                className="w-20 border-2 border-purple-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-purple-500 transition-all"
                                placeholder="0"
                                aria-label={`Exam score for ${student.firstname}`}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 font-bold py-2 px-4 rounded-lg min-w-16">
                                {total}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`text-2xl font-bold ${color}`}
                                aria-label={`Grade ${grade}`}
                              >
                                {total > 0 ? grade : "-"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden p-4 space-y-4">
                  {filteredStudents.map((student: any, idx: number) => {
                    const total = studentTotals[student.studentId] || 0;
                    const { grade, color } = getGrade(total);

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-orange-200 p-5 shadow-lg"
                      >
                        {/* Student Header */}
                        <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-blue-100">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <h3 className="text-base font-bold text-gray-800">
                                {`${student.firstname} ${student.lastname}`}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-600 font-medium ml-10 font-mono">
                              {student.studentNo}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Grade</p>
                            <span
                              className={`text-3xl font-bold ${color}`}
                              aria-label={`Grade ${grade}`}
                            >
                              {total > 0 ? grade : "-"}
                            </span>
                          </div>
                        </div>

                        {/* Score Inputs */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <label
                              htmlFor={`ca1-${student.studentId}`}
                              className="block text-xs font-bold text-gray-700 mb-2"
                            >
                              CA1 (20)
                            </label>
                            <input
                              id={`ca1-${student.studentId}`}
                              type="number"
                              min="0"
                              max="20"
                              value={results[student.studentId]?.ca1 || ""}
                              onChange={(e) => handleScoreChange(student.studentId, "ca1", e.target.value)}
                              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-[#EE7306] transition-all"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`ca2-${student.studentId}`}
                              className="block text-xs font-bold text-gray-700 mb-2"
                            >
                              CA2 (20)
                            </label>
                            <input
                              id={`ca2-${student.studentId}`}
                              type="number"
                              min="0"
                              max="20"
                              value={results[student.studentId]?.ca2 || ""}
                              onChange={(e) => handleScoreChange(student.studentId, "ca2", e.target.value)}
                              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-[#EE7306] transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor={`exam-${student.studentId}`}
                            className="block text-xs font-bold text-gray-700 mb-2"
                          >
                            Exam (60)
                          </label>
                          <input
                            id={`exam-${student.studentId}`}
                            type="number"
                            min="0"
                            max="60"
                            value={results[student.studentId]?.exam || ""}
                            onChange={(e) => handleScoreChange(student.studentId, "exam", e.target.value)}
                            className="w-full border-2 border-purple-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-purple-500 transition-all"
                            placeholder="0"
                          />
                        </div>

                        {/* Total */}
                        <div className="bg-gradient-to-r from-[#EE7306] to-[#EE7306]/70 rounded-xl p-4 text-center">
                          <p className="text-xs font-bold text-white mb-1">Total Score</p>
                          <p className="text-3xl font-bold text-white">{total}</p>
                          <p className="text-xs text-blue-100">out of 100</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save Button */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-t-2 border-blue-100">
                  <button
                    onClick={handleSaveResults}
                    disabled={!isFormValid || saving}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                      isFormValid && !saving
                        ? "bg-gradient-to-r from-[#EE7306] to-[#EE7306]/70 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-5 h-5" />
                    {saving
                      ? "Saving Results..."
                      : isFormValid
                      ? `Save Results for ${filteredStudents.length} Students`
                      : "Complete All Required Fields"}
                  </button>

                  {!isFormValid && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-gray-600">
                        Please select all required fields and enter at least one student result
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedClassroomId && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Class to Begin</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Choose a class from the dropdown above to start entering student results. You can
              filter classes by level to find what you need faster.
            </p>
          </div>
        )}

        {selectedClassroomId && !selectedSubjectId && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Subject</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Choose a subject for {selectedClassName} to start entering results. You can add new
              subjects if needed.
            </p>
          </div>
        )}

        {selectedClassroomId && selectedSubjectId && (!formData.sessionId || !formData.currentTerm) && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select Session and Term</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Please select both session and term to start entering results for {selectedClassName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewResult;