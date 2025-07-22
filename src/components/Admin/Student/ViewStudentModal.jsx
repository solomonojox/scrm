import React from "react";

const ViewStudentModal = ({ isOpen, student, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg animate-fadeIn overflow-hidden">
        {/* Header */}
        <header className="bg-blue-600 text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">
            Student Details
          </h2>
          <button
            aria-label="Close"
            className="text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </header>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(student).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="border px-3 py-2 rounded text-sm bg-gray-100">
                  {value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentModal;
