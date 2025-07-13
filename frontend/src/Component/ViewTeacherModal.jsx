import React from "react";

const ViewTeacherModal = ({ isOpen, teacher, onClose }) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg animate-fadeIn overflow-hidden">
        <header className="bg-[#d87f0a] text-white flex items-center justify-between px-4 py-3">
          <h2 className="flex-grow text-center font-semibold">
            Teacher Details
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
          {/* Display photo first */}
          {teacher.avatar && (
            <div className="flex justify-center">
              <img
                src={teacher.avatar}
                alt={`${teacher.firstName} ${teacher.lastName}`}
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>
          )}

          {/* Render all other properties */}
          {Object.entries(teacher).map(([key, value]) => {
            if (key === "avatar" || key === "_checked") return null;

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="border px-3 py-2 rounded text-sm bg-gray-100">
                  {value || "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ViewTeacherModal;
