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
} from "lucide-react";
import React, { useState } from "react";

const classes = [
  { id: 1, name: "JSS1A", students: 35 },
  { id: 2, name: "JSS1B", students: 32 },
  { id: 3, name: "JSS2A", students: 30 },
  { id: 4, name: "JSS2B", students: 28 },
];

const subjects = [
  "Mathematics",
  "English Language",
  "Biology",
  "Chemistry",
  "Physics",
  "Agricultural Science",
];

const studentsData = {
  1: [
    { id: 1, name: "Adebayo Oluwaseun", studentId: "JSS1A001" },
    { id: 2, name: "Chioma Nkechi", studentId: "JSS1A002" },
    { id: 3, name: "Ibrahim Musa", studentId: "JSS1A003" },
    { id: 4, name: "Fatima Aisha", studentId: "JSS1A004" },
    { id: 5, name: "Emeka Chijioke", studentId: "JSS1A005" },
  ],
  2: [
    { id: 6, name: "Blessing Favour", studentId: "JSS1B001" },
    { id: 7, name: "Tunde Adebisi", studentId: "JSS1B002" },
    { id: 8, name: "Aminat Zainab", studentId: "JSS1B003" },
  ],
  3: [
    { id: 9, name: "David Okechukwu", studentId: "JSS2A001" },
    { id: 10, name: "Hauwa Khadija", studentId: "JSS2A002" },
  ],
  4: [
    { id: 11, name: "Grace Chiamaka", studentId: "JSS2B001" },
    { id: 12, name: "Yusuf Abdullah", studentId: "JSS2B002" },
  ],
};

const NewResult = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [term, setTerm] = useState("1");
  const [session, setSession] = useState("2024/2025");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setSearchTerm("");
  };

  const handleScoreChange = (studentId, field, value) => {
    const numValue = value === "" ? "" : Math.min(Math.max(0, parseInt(value) || 0), 100);

    setResults((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: numValue,
      },
    }));
  };

  const calculateTotal = (studentId) => {
    const student = results[studentId] || {};
    const ca1 = parseInt(student.ca1) || 0;
    const ca2 = parseInt(student.ca2) || 0;
    const exam = parseInt(student.exam) || 0;
    return ca1 + ca2 + exam;
  };

  const getGrade = (total) => {
    if (total >= 90) return { grade: "A", color: "text-green-600" };
    if (total >= 80) return { grade: "B", color: "text-blue-600" };
    if (total >= 70) return { grade: "C", color: "text-yellow-600" };
    if (total >= 60) return { grade: "D", color: "text-orange-600" };
    if (total >= 50) return { grade: "E", color: "text-red-500" };
    return { grade: "F", color: "text-red-700" };
  };

  const handleSaveResults = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log("Saved Results:", { selectedClass, selectedSubject, term, session, results });
  };

  const currentStudents = selectedClass ? studentsData[selectedClass] || [] : [];
  const filteredStudents = currentStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isFormValid = selectedClass && selectedSubject && Object.keys(results).length > 0;

  return (
    <div className="min-h-screen">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-6 h-6" />
          <span className="font-bold">Results saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2" onClick={() => window.history.back()}>
          <div className="flex items-center justify-start">
            <div className="p-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer">
              <ArrowLeft className="w-6 h-6 " />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-3">
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

      {/* Selection Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#EE7306]" />
          Session & Subject Selection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Term Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all bg-white"
            >
              <option value="1">First Term</option>
              <option value="2">Second Term</option>
              <option value="3">Third Term</option>
            </select>
          </div>

          {/* Session Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Session</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all bg-white"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2023/2024">2023/2024</option>
              <option value="2022/2023">2022/2023</option>
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-orange-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all bg-white"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject, idx) => (
                <option key={idx} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Max Scores Info */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <p className="text-xs font-bold text-gray-700 mb-2">Max Scores</p>
            <div className="space-y-1 text-xs">
              <p className="text-gray-600">
                CA1: <span className="font-bold text-blue-600">20</span>
              </p>
              <p className="text-gray-600">
                CA2: <span className="font-bold text-blue-600">20</span>
              </p>
              <p className="text-gray-600">
                Exam: <span className="font-bold text-purple-600">60</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Select Class
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassSelect(cls.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedClass === cls.id
                  ? "bg-[#EE7306] text-white border-[#EE7306] shadow-lg scale-105"
                  : "bg-white text-gray-700 border-[#EE7306] hover:border-[#EE7306] hover:shadow-md"
              }`}
            >
              <div className="text-center">
                <p className="text-lg font-bold">{cls.name}</p>
                <p className="text-xs mt-1 opacity-80">{cls.students} students</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Student Results Entry */}
      {selectedClass && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Search Bar */}
          <div className="p-6 ">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#EE7306]" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring focus:ring-[#EE7306] focus:border-transparent transition-all bg-white"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#EE7306] text-white">
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase">S/N</th>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase">Student Name</th>
                  <th className="py-4 px-4 text-left text-xs font-bold uppercase">Student ID</th>
                  <th className="py-4 px-4 text-center text-xs font-bold uppercase">CA1 (20)</th>
                  <th className="py-4 px-4 text-center text-xs font-bold uppercase">CA2 (20)</th>
                  <th className="py-4 px-4 text-center text-xs font-bold uppercase">Exam (60)</th>
                  <th className="py-4 px-4 text-center text-xs font-bold uppercase">Total (100)</th>
                  <th className="py-4 px-4 text-center text-xs font-bold uppercase">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => {
                  const total = calculateTotal(student.id);
                  const { grade, color } = getGrade(total);

                  return (
                    <tr
                      key={idx}
                      className={`border-b border ${
                        idx % 2 === 0 ? "bg-white" : "bg-orange-50"
                      } hover:bg-orange-100 transition-colors`}
                    >
                      <td className="py-3 px-4 text-sm font-semibold text-gray-700">{idx + 1}</td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-800">{student.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{student.studentId}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={results[student.id]?.ca1 || ""}
                          onChange={(e) => handleScoreChange(student.id, "ca1", e.target.value)}
                          className="w-20 border border-orange-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-[#EE7306]"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={results[student.id]?.ca2 || ""}
                          onChange={(e) => handleScoreChange(student.id, "ca2", e.target.value)}
                          className="w-20 border border-orange-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-[#EE7306]"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          min="0"
                          max="60"
                          value={results[student.id]?.exam || ""}
                          onChange={(e) => handleScoreChange(student.id, "exam", e.target.value)}
                          className="w-20 border-2 border-purple-200 rounded-lg py-2 px-3 text-center text-sm focus:outline-none focus:ring focus:ring-purple-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 font-bold py-2 px-4 rounded-lg">
                          {total}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-2xl font-bold ${color}`}>{grade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredStudents.map((student, idx) => {
              const total = calculateTotal(student.id);
              const { grade, color } = getGrade(total);

              return (
                <div
                  key={student.id}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-orange-200 p-5 shadow-lg"
                >
                  {/* Student Header */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-blue-100">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-gray-800">{student.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 font-medium ml-10">{student.studentId}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Grade</p>
                      <span className={`text-3xl font-bold ${color}`}>{grade}</span>
                    </div>
                  </div>

                  {/* Score Inputs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">CA1 (20)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={results[student.id]?.ca1 || ""}
                        onChange={(e) => handleScoreChange(student.id, "ca1", e.target.value)}
                        className="w-full border border-orange-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-[#EE7306]"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">CA2 (20)</label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={results[student.id]?.ca2 || ""}
                        onChange={(e) => handleScoreChange(student.id, "ca2", e.target.value)}
                        className="w-full border border-orange-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-[#EE7306]"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-700 mb-2">Exam (60)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={results[student.id]?.exam || ""}
                      onChange={(e) => handleScoreChange(student.id, "exam", e.target.value)}
                      className="w-full border-2 border-purple-200 rounded-xl py-3 px-4 text-center text-sm font-bold focus:outline-none focus:ring focus:ring-purple-500"
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
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-3 ${
                isFormValid
                  ? "bg-gradient-to-r from-[#EE7306] to-[#EE7306]/70 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <Save className="w-5 h-5" />
              {isFormValid ? "Save All Results" : "Select Class & Subject to Continue"}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedClass && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Select a Class to Begin</h3>
          <p className="text-sm text-gray-600">
            Choose a class from above to start entering student results
          </p>
        </div>
      )}
    </div>
  );
};

export default NewResult;
