import React from "react";
import { Plus, X } from "lucide-react";

interface AddClassModalProps {
  isOpen: boolean;
  newClassName: string;
  onClassNameChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  newClassName,
  onClassNameChange,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold text-gray-800">Add New Class</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors -mt-0.5"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Enter the class name to add it to your school
        </p>

        <input
          type="text"
          value={newClassName}
          onChange={(e) => onClassNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          placeholder="e.g., Grade 10A"
          className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4 text-sm"
          autoFocus
        />

        <div className="flex space-x-2">
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddClassModal;