import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({
    triggerButton,
    onConfirm,
    onCancel,
    title = "Are You Sure?",
    message = "This action cannot be undone. Are you sure you want to proceed?",
    confirmText = "Yes, Proceed",
    cancelText = "Cancel",
    alternativeBg = "",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onCancel && onCancel();
    };

    const handleConfirm = async () => {
        try {
            if (onConfirm) {
                await onConfirm();
            }
            setIsOpen(false);
        } catch (error) {
            console.error('Confirmation action failed:', error);
            // Optionally handle error (keep modal open, show error message, etc.)
        }
    };

    return (
        <>
            {React.cloneElement(triggerButton, { onClick: handleOpen })}

            {isOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#00000099] bg-opacity-50 ${className}`}>
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-bounce-once">
                        <div className="flex flex-col items-center">
                            {/* Animated Warning Icon */}
                            <div className="text-yellow-500 text-6xl mb-4 animate-shake">
                                <AlertTriangle size={64} className="animate-shake" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                                {title}
                            </h2>

                            <p className="text-gray-600 text-center mb-6">
                                {message}
                            </p>

                            <div className="flex space-x-4 w-full">
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1  text-white py-2 rounded transition ${alternativeBg !== "" ? alternativeBg : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={handleClose}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ConfirmationModal;