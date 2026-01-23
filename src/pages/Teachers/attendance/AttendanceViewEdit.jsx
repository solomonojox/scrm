/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Check,
  X,
  Clock,
  ArrowLeft,
  Eye,
  Edit3Icon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const AttendanceViewEdit = ({ attendanceItem, onClose, onSave, mode = "view" }) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [editedStudents, setEditedStudents] = useState([]);
  const [expandedStudent, setExpandedStudent] = useState(null);


  useEffect(() => {
    if (attendanceItem?.students) {
      setEditedStudents(attendanceItem.students);
    }
  }, [attendanceItem]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Present";
      case 1:
        return "Absent";
      case 2:
        return "Late";
      default:
        return "Not Marked";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800 border-green-200";
      case 1:
        return "bg-red-100 text-red-800 border-red-200";
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Handle status change in edit mode
  const handleStatusChange = (index, field, value) => {
    const updated = [...editedStudents];
    updated[index] = { ...updated[index], [field]: value };
    setEditedStudents(updated);
  };

  // Calculate summary
  const calculateSummary = (students) => {
    const present = students.filter((s) => s.status === 0).length;
    const absent = students.filter((s) => s.status === 1).length;
    const late = students.filter((s) => s.status === 2).length;
    const total = students.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, late, total, percentage };
  };

  const summary = calculateSummary(editedStudents);

  // Save changes
  const handleSave = () => {
    const updatedData = {
      ...attendanceItem,
      students: editedStudents,
      present: summary.present,
      absent: summary.absent,
      late: summary.late,
      overallPercentage: `${summary.percentage}%`,
    };
    onSave?.(updatedData);
  };

  // Clear all
  const handleClearAll = () => {
    const cleared = editedStudents.map((student) => ({
      ...student,
      status: null,
      timeIn: null,
    }));
    setEditedStudents(cleared);
  };

  // Cancel edit
  const handleCancel = () => {
    setEditedStudents(attendanceItem.students);
    setIsEditMode(false);
    setExpandedStudent(null);
  };

  // Toggle student details
  const toggleStudentDetails = (index) => {
    setExpandedStudent(expandedStudent === index ? null : index);
  };

  if (!attendanceItem) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">No attendance data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600" size={20} />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Calendar className="text-[#EE7306] flex-shrink-0" size={24} />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg md:text-2xl font-semibold text-gray-800 truncate">
                  {formatDate(attendanceItem.date)}
                </h2>
                <p className="text-xs md:text-sm text-gray-500">
                  {formatTime(attendanceItem.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 md:px-4 py-2 rounded-lg flex-shrink-0">
              <Users className="text-blue-600" size={18} />
              <span className="text-sm md:text-base text-blue-600 font-medium">
                {summary.total}
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-fit mx-auto md:mx-0">
            <button
              onClick={() => setIsEditMode(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                !isEditMode
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            {/* <button
              onClick={() => setIsEditMode(true)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isEditMode
                  ? "bg-[#EE7306] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Edit3Icon className="w-4 h-4 mr-1" />
              Edit
            </button> */}
          </div>
        </div>

        {/* Mobile Student Cards */}
        <div className="block md:hidden">
          <div className="p-4 space-y-3">
            {editedStudents.map((student, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleStudentDetails(index)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {student.firstName?.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">ID: {student.studentNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {getStatusLabel(student.status)}
                    </span>
                    {expandedStudent === index ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {expandedStudent === index && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Time In:</span>
                        {isEditMode ? (
                          <input
                            type="time"
                            value={student.timeIn || ""}
                            onChange={(e) => handleStatusChange(index, "timeIn", e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-32"
                          />
                        ) : (
                          <span className="text-sm font-medium">{student.timeIn || "-"}</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm text-gray-600 block">Attendance Status:</span>
                        {isEditMode ? (
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(index, "status", student.status === 0 ? null : 0)
                              }
                              className={`flex items-center justify-center gap-1 p-2 rounded border text-xs font-medium ${
                                student.status === 0
                                  ? "bg-green-500 text-white border-green-500"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              <Check size={14} />
                              Present
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(index, "status", student.status === 1 ? null : 1)
                              }
                              className={`flex items-center justify-center gap-1 p-2 rounded border text-xs font-medium ${
                                student.status === 1
                                  ? "bg-red-500 text-white border-red-500"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              <X size={14} />
                              Absent
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(index, "status", student.status === 2 ? null : 2)
                              }
                              className={`flex items-center justify-center gap-1 p-2 rounded border text-xs font-medium ${
                                student.status === 2
                                  ? "bg-orange-500 text-white border-orange-500"
                                  : "bg-gray-100 text-gray-700 border-gray-300"
                              }`}
                            >
                              <Clock size={14} />
                              Late
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            {student.status === 0 && <Check className="text-green-500" size={24} />}
                            {student.status === 1 && <X className="text-red-500" size={24} />}
                            {student.status === 2 && <Clock className="text-[#EE7306]" size={24} />}
                            {student.status === null && (
                              <span className="text-gray-400 text-sm">Not marked</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#EE7306] text-white">
                <th className="px-4 py-3 text-left text-sm font-medium">SN</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Photo</th>
                <th className="px-4 py-3 text-left text-sm font-medium">First Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Last Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Student ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Present</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Absent</th>
                <th className="px-4 py-3 text-center text-sm font-medium">Late</th>
              </tr>
            </thead>
            <tbody>
              {editedStudents.map((student, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                      {student.firstName?.charAt(0) || "A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{student.firstName}</td>
                  <td className="px-4 py-3 text-sm">{student.lastName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.studentId}</td>
                  <td className="px-4 py-3">
                    {isEditMode ? (
                      <input
                        type="time"
                        value={student.timeIn || ""}
                        onChange={(e) => handleStatusChange(index, "timeIn", e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-[120px]"
                      />
                    ) : (
                      <span className="text-sm">{student.timeIn || "-"}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditMode ? (
                      <input
                        type="checkbox"
                        checked={student.status === 1}
                        onChange={() =>
                          handleStatusChange(index, "status", student.status === 1 ? null : 0)
                        }
                        className="w-5 h-5 cursor-pointer accent-green-500"
                      />
                    ) : (
                      <div className="flex justify-center">
                        {student.status === 1 && <Check className="text-green-500" size={20} />}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditMode ? (
                      <input
                        type="checkbox"
                        checked={student.status === 0}
                        onChange={() =>
                          handleStatusChange(index, "status", student.status === 0 ? null : 0)
                        }
                        className="w-5 h-5 cursor-pointer accent-red-500"
                      />
                    ) : (
                      <div className="flex justify-center">
                        {student.status === 0 && <X className="text-red-500" size={20} />}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isEditMode ? (
                      <input
                        type="checkbox"
                        checked={student.status === 2}
                        onChange={() =>
                          handleStatusChange(index, "status", student.status === 2 ? null : 2)
                        }
                        className="w-5 h-5 cursor-pointer accent-orange-500"
                      />
                    ) : (
                      <div className="flex justify-center">
                        {student.status === 2 && <Clock className="text-[#EE7306]" size={20} />}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Summary Section</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {isEditMode && (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Clear All
                  </button>
                </>
              )}
              {/* <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#EE7306] text-white rounded-lg hover:bg-[#D66305] transition-colors text-sm font-medium shadow-sm"
              >
                Save Changes
              </button> */}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-200">
              <div className="text-xs md:text-sm text-blue-600 mb-1 font-medium">
                Total Students
              </div>
              <div className="text-lg md:text-2xl font-bold text-blue-700">{summary.total}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 md:p-4 border border-green-200">
              <div className="text-xs md:text-sm text-green-600 mb-1 font-medium">Present</div>
              <div className="text-lg md:text-2xl font-bold text-green-700">{summary.present}</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 md:p-4 border border-red-200">
              <div className="text-xs md:text-sm text-red-600 mb-1 font-medium">Absent</div>
              <div className="text-lg md:text-2xl font-bold text-red-700">{summary.absent}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-200">
              <div className="text-xs md:text-sm text-yellow-600 mb-1 font-medium">Late</div>
              <div className="text-lg md:text-2xl font-bold text-yellow-700">{summary.late}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 md:p-4 border border-purple-200 col-span-2 lg:col-span-1">
              <div className="text-xs md:text-sm text-purple-600 mb-1 font-medium">
                Attendance %
              </div>
              <div className="text-lg md:text-2xl font-bold text-purple-700">
                {summary.percentage}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceViewEdit;
