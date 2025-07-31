import React, { useEffect, useRef } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

const NotificationModal = ({ show, onClose }) => {
  const modalRef = useRef();

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!show) return null;

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        @keyframes shake {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-15deg); }
          40% { transform: rotate(15deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
        }

        .shake-bell {
          animation: shake 1s infinite;
          transform-origin: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray bg-opacity-20">
        <div
          ref={modalRef}
          className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg animate-fadeIn"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <FaBell className="text-orange-500 shake-bell" />
              <span>Notifications</span>
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
          <div className="text-sm text-gray-600 text-center">
            Your notifications will appear here.
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationModal;
