
import React from "react";

const ViewStudentModal = ({ isOpen, student, onClose }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg animate-fadeIn overflow-hidden">
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

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {Object.entries(student).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
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
  );
};

export default ViewStudentModal;
