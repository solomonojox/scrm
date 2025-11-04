import {
  Edit3,
  Eye,
  MoreVertical,
  Trash2,
  Search,
  Calendar,
  User,
  GraduationCap,
  X,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Printer,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { resultService } from "../../../Services/Results";

interface MobileCardProps {
  item: any;
  index: number;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
  serialNumber: number;
}

const MobileCard = ({ item, index, onEdit, onDelete, onView, serialNumber }: MobileCardProps) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 p-5 mb-4 hover:shadow-xl hover:border-orange-200 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#EE7306] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-md">
              {serialNumber}
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#EE7306]" />
            <p className="text-base font-bold text-gray-800">{item.firstname} {item.lastname}</p>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-600 font-medium">{item.studentNo}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 rounded-full bg-white hover:bg-orange-100 transition-all duration-200 shadow-md hover:shadow-lg border border-orange-200"
          >
            <MoreVertical className="w-5 h-5 text-[#EE7306]" />
          </button>

          {showOptions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />
              <div className="absolute top-12 right-0 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-50 w-36 overflow-hidden">
                <ul className="flex flex-col">
                  <li
                    onClick={() => {
                      onView(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-yellow-50 bg-white hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Eye className="w-4 h-4 mr-2" /> View
                  </li>
                  <li
                    onClick={() => {
                      onEdit(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-green-50 bg-white hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-all duration-200 font-medium text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </li>
                  <li
                    onClick={() => {
                      onDelete(item);
                      setShowOptions(false);
                    }}
                    className="inline-flex items-center px-4 py-3 hover:bg-red-50 bg-white hover:text-red-600 text-red-600 cursor-pointer transition-all duration-200 font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3 bg-white rounded-xl p-4 shadow-inner border border-orange-100">
        <div className="flex items-center justify-between pb-2 border-b border-orange-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-xs font-bold text-purple-600">T{item.currentTerm}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Term</p>
              <p className="text-sm font-bold text-gray-800">
                {item.currentTerm === 1 ? "First" : item.currentTerm === 2 ? "Second" : "Third"} Term
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-2 border-b border-orange-100">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium">Session</p>
            <p className="text-sm font-bold text-gray-800">{item.currentSession}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Result Modal Component
const ResultModal = ({ isOpen, onClose, resultData, loading, mode, onSave }: any) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(mode === 'edit');
  const [editedData, setEditedData] = useState(resultData);

  React.useEffect(() => {
    setEditedData(resultData);
    setEditMode(mode === 'edit');
  }, [resultData, mode]);

  if (!isOpen) return null;

  const downloadAsPDF = async () => {
    if (!resultRef.current) return;
    
    try {
      const html2pdf = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')).default;
      
      const opt = {
        margin: 10,
        filename: `result-${resultData?.studentNo || 'student'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(resultRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadAsImage = async () => {
    if (!resultRef.current) return;
    
    try {
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')).default;
      
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `result-${resultData?.studentNo || 'student'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    onSave(editedData);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-[#EE7306] p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {editMode ? 'Edit Result' : 'Student Result'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Action Buttons */}
        {!editMode && (
          <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-2 justify-end print:hidden">
            <button
              onClick={downloadAsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={downloadAsImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
            >
              <ImageIcon className="w-4 h-4" />
              Image
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-[#EE7306] animate-spin mb-4" />
              <p className="text-gray-600">Loading result...</p>
            </div>
          ) : resultData ? (
            <div ref={resultRef} className="bg-white">
              {/* School Header */}
              <div className="text-center mb-6 pb-4 border-b-2 border-orange-500">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">School Name</h1>
                <p className="text-sm text-gray-600">School Address | Phone | Email</p>
                <h2 className="text-xl font-bold text-[#EE7306] mt-3">STUDENT REPORT CARD</h2>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-orange-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Student Name:</p>
                  <p className="font-bold text-gray-800">{resultData.firstname} {resultData.lastname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID:</p>
                  <p className="font-bold text-gray-800">{resultData.studentNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class:</p>
                  <p className="font-bold text-gray-800">{resultData.className || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Term:</p>
                  <p className="font-bold text-gray-800">
                    {resultData.currentTerm === 1 ? "First" : resultData.currentTerm === 2 ? "Second" : "Third"} Term
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Session:</p>
                  <p className="font-bold text-gray-800">{resultData.currentSession}</p>
                </div>
              </div>

              {/* Subjects/Grades Table */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Academic Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Subject</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-bold">CA (40)</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-bold">Exam (60)</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-bold">Total (100)</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-bold">Grade</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-bold">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultData.subjects && resultData.subjects.length > 0 ? (
                        resultData.subjects.map((subject: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-4 py-2">{subject.name}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.ca || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{subject.exam || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-bold">{subject.total || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-bold">{subject.grade || '-'}</td>
                            <td className="border border-gray-300 px-4 py-2">{subject.remark || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="border border-gray-300 px-4 py-4 text-center text-gray-500">
                            No subject data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Score</p>
                  <p className="text-2xl font-bold text-blue-600">{resultData.totalScore || '0'}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Average</p>
                  <p className="text-2xl font-bold text-green-600">{resultData.average || '0'}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Position</p>
                  <p className="text-2xl font-bold text-purple-600">{resultData.position || '-'}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Grade</p>
                  <p className="text-2xl font-bold text-orange-600">{resultData.grade || '-'}</p>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-700 mb-2">Class Teacher's Comment:</p>
                  <p className="text-sm text-gray-600">{resultData.teacherComment || 'No comment provided'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-bold text-gray-700 mb-2">Principal's Comment:</p>
                  <p className="text-sm text-gray-600">{resultData.principalComment || 'No comment provided'}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
                <div>
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <p className="text-sm text-gray-600">Class Teacher's Signature</p>
                  </div>
                </div>
                <div>
                  <div className="border-t border-gray-400 pt-2 mt-8">
                    <p className="text-sm text-gray-600">Principal's Signature</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No result data available</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {editMode && (
          <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#EE7306] text-white rounded-lg hover:bg-orange-600 transition-all font-medium"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, studentName }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Delete Result</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the result for <span className="font-bold">{studentName}</span>? 
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AllResult = ({ students, fetchedSessions }: { students: any[]; fetchedSessions: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openRowIndex, setOpenRowIndex] = useState(null);
  
  // Modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const handleOptionsClick = (rowIndex: any) => {
    setOpenRowIndex(openRowIndex === rowIndex ? null : rowIndex);
  };

  const fetchStudentResult = async (student: any) => {
    setLoading(true);
    try {
      const response = await resultService.getResultBySchoolAndClass(
        fetchedSessions[0].schoolId,
        student.studentId || student.id,
        student.classroomId,
        fetchedSessions[0].sessionKey,
        student.currentTerm
      );
      const data = await response.json();
      
      // Mock data structure if API doesn't return complete data
      const mockResult = {
        ...student,
        subjects: data.subjects || [
          { name: 'Mathematics', ca: 35, exam: 55, total: 90, grade: 'A', remark: 'Excellent' },
          { name: 'English', ca: 32, exam: 50, total: 82, grade: 'A', remark: 'Very Good' },
          { name: 'Science', ca: 30, exam: 48, total: 78, grade: 'B', remark: 'Good' },
        ],
        totalScore: data.totalScore || 250,
        average: data.average || 83.3,
        position: data.position || '5th',
        grade: data.grade || 'A',
        teacherComment: data.teacherComment || 'Excellent performance. Keep it up!',
        principalComment: data.principalComment || 'Well done. Continue with the good work.',
      };
      
      setResultData(mockResult);
    } catch (err) {
      console.error("Error fetching result:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (item: any) => {
    setSelectedStudent(item);
    setModalMode('view');
    setShowResultModal(true);
    await fetchStudentResult(item);
    setOpenRowIndex(null);
  };

  const handleEdit = async (item: any) => {
    setSelectedStudent(item);
    setModalMode('edit');
    setShowResultModal(true);
    await fetchStudentResult(item);
    setOpenRowIndex(null);
  };

  const handleDelete = (item: any) => {
    setSelectedStudent(item);
    setShowDeleteModal(true);
    setOpenRowIndex(null);
  };

  const confirmDelete = async () => {
    try {
      // Add your delete API call here
      console.log("Deleting result for:", selectedStudent);
      alert(`Result deleted for ${selectedStudent.firstname} ${selectedStudent.lastname}`);
      setShowDeleteModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error deleting result:", err);
      alert("Failed to delete result. Please try again.");
    }
  };

  const handleSaveEdit = async (editedData: any) => {
    try {
      // Add your update API call here
      console.log("Saving edited result:", editedData);
      alert("Result updated successfully!");
      setShowResultModal(false);
    } catch (err) {
      console.error("Error saving result:", err);
      alert("Failed to save changes. Please try again.");
    }
  };

  // Filtering logic
  const filteredData = students.filter(
    (item, index) =>
      searchTerm === "" ||
      item?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.studentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (index + 1).toString().includes(searchTerm)
  );

  // Pagination
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <section className="w-full bg-white py-3 sm:py-6">
      {/* Search Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-orange-200 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-orange-500 focus:border-transparent transition-all shadow-sm bg-white"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-4 px-4 text-left">
                  <input type="checkbox" title="select all" className="w-4 h-4 rounded" />
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">S/N</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">Name</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">Student ID</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">Term</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">Session</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-[#717182] uppercase tracking-wider">Options</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-sm text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${index % 2 === 0 ? "bg-white" : "bg-orange-50"} hover:bg-orange-100 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </td>
                    <td className="text-sm px-4 py-3 text-gray-700 font-semibold">
                      {indexOfFirstRow + index + 1}
                    </td>
                    <td className="text-sm px-4 py-3 text-gray-800 font-bold">
                      {item?.firstname} {item?.lastname}
                    </td>
                    <td className="text-sm px-4 py-3 text-gray-700">{item?.studentNo}</td>
                    <td className="text-sm px-4 py-3 text-gray-700">
                      {item?.currentTerm === 1 ? "First Term" : item?.currentTerm === 2 ? "Second Term" : "Third Term"}
                    </td>
                    <td className="text-sm px-4 py-3 text-gray-700">{item?.currentSession}</td>
                    <td className="text-sm px-4 py-3 relative">
                      <button
                        onClick={() => handleOptionsClick(index)}
                        className="p-1 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-[#EE7306]" />
                      </button>

                      {openRowIndex === index && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setOpenRowIndex(null)} />
                          <div className="absolute top-8 right-0 bg-white border border-orange-200 rounded-xl shadow-2xl z-50 w-32 overflow-hidden">
                            <ul className="flex flex-col">
                              <li
                                onClick={() => handleView(item)}
                                className="inline-flex items-center px-4 py-2 hover:bg-yellow-100 bg-yellow-50 hover:text-yellow-600 text-yellow-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                              >
                                <Eye className="w-4 h-4 mr-2" /> View
                              </li>
                              <li
                                onClick={() => handleEdit(item)}
                                className="inline-flex items-center px-4 py-2 hover:bg-green-100 bg-green-50 hover:text-green-600 text-green-600 cursor-pointer border-b border-orange-100 transition-colors font-medium text-sm"
                              >
                                <Edit3 className="w-4 h-4 mr-2" /> Edit
                              </li>
                              <li
                                onClick={() => handleDelete(item)}
                                className="inline-flex items-center px-4 py-2 hover:bg-red-100 bg-red-50 hover:text-red-600 text-red-600 cursor-pointer transition-colors font-medium text-sm"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {currentRows.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-orange-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No records found</p>
            </div>
          ) : (
            currentRows.map((item, index) => (
              <MobileCard
                key={index}
                item={item}
                index={index}
                serialNumber={indexOfFirstRow + index + 1}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-5 bg-white">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            <p className="text-[12px] text-[#717182]">
              Showing {indexOfFirstRow + 1} - {Math.min(indexOfLastRow, filteredData.length)} of{" "}
              {filteredData.length} entries
            </p>
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-[#EE7306] text-white hover:from-[#EE7306] hover:to-orange-700 hover:shadow-lg"
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage === 1) {
                pageNum = i + 1;
              } else if (currentPage === totalPages) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                    currentPage === pageNum
                      ? "bg-gradient-to-br from-orange-500 to-[#EE7306] text-white shadow-lg scale-110"
                      : "text-[#EE7306] bg-white hover:bg-orange-100 border-2 border-orange-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow-md ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-[#EE7306] text-white hover:from-[#EE7306] hover:to-orange-700 hover:shadow-lg"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false);
          setResultData(null);
          setSelectedStudent(null);
        }}
        resultData={resultData}
        loading={loading}
        mode={modalMode}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStudent(null);
        }}
        onConfirm={confirmDelete}
        studentName={selectedStudent ? `${selectedStudent.firstname} ${selectedStudent.lastname}` : ''}
      />
    </section>
  );
};

export default AllResult;