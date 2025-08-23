import { ArrowLeft, Download, Upload, X } from "lucide-react";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dateCreated: string;
  dueDate: string;
  teacherName: string;
  status: "Completed" | "Pending" | "Overdue";
  pupilName: string;
  class: string;
  submissionDate?: string;
  score?: string;
  description: string;
  questions: string[];
  resources: string[];
}

interface AssignmentModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({ assignment, isOpen, onClose }) => {
  if (!isOpen || !assignment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Overdue":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold">View Assignment</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-6">
            {/* Student Image */}
            <div className="flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                alt="Student"
                className="w-48 h-48 rounded-lg object-cover"
              />
              <button className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2">
                <Download size={16} />
                <span>Download Resources</span>
              </button>
            </div>

            {/* Assignment Details */}
            <div className="">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Title: <span className="text-gray-900">{assignment.title}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Subject: <span className="text-gray-900">{assignment.subject}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Teacher's Name: <span className="text-gray-900">{assignment.teacherName}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Pupil Name: <span className="text-gray-900">{assignment.pupilName}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Class: <span className="text-gray-900">{assignment.class}</span>
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm font-medium text-gray-700">Copy Link:</span>
                    <button className="ml-2 text-orange-500 hover:text-orange-600">📋</button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        assignment.status
                      )}`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Date Created: <span className="text-gray-900">{assignment.dateCreated}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Due Date: <span className="text-gray-900">{assignment.dueDate}</span>
                  </p>
                  {assignment.submissionDate && (
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Submission Date:{" "}
                      <span className="text-gray-900">{assignment.submissionDate}</span>
                    </p>
                  )}
                  {assignment.score && (
                    <p className="text-sm font-medium text-gray-700 mt-2">
                      Score: <span className="text-green-600 font-bold">{assignment.score}</span>
                    </p>
                  )}
                  <p className="text-sm font-medium text-gray-700 mt-2">
                    Resources:{" "}
                    <span className="text-gray-900">{assignment.resources.join(", ")}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{assignment.description}</p>
          </div>

          {/* Questions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Questions</h3>
            <ol className="space-y-3">
              {assignment.questions.map((question, index) => (
                <li key={index} className="text-gray-700">
                  <span className="font-medium">{index + 1}.</span> {question}
                </li>
              ))}
            </ol>
          </div>

          {/* Download Assignment Button */}
          <div className="mt-6">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>Download Assignment</span>
            </button>
          </div>

          {/* Submit Assignment Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Submit Assignment</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Upload className="text-gray-400" size={24} />
                </div>
                <p className="text-sm text-orange-500 font-medium">Upload Here 📁</p>
                <p className="text-xs text-gray-500 mt-1">preview</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Note (Optional)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
