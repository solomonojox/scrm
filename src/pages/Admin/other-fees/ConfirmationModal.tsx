import React from 'react';
import { OtherFee } from './OtherFees';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fee: OtherFee | null;
  actionType: 'activate' | 'deactivate';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  error,
  fee,
  actionType
}) => {
  if (!isOpen || !fee) return null;

  const isDeactivate = actionType === 'deactivate';
  const title = isDeactivate ? 'Confirm Deactivation' : 'Confirm Activation';
  const iconColor = isDeactivate ? 'text-red-600' : 'text-green-600';
  const bgColor = isDeactivate ? 'bg-red-100' : 'bg-green-100';
  const buttonColor = isDeactivate ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700';
  const actionText = isDeactivate ? 'Deactivate' : 'Activate';
  const statusText = isDeactivate ? 'Active' : 'Inactive';
  const newStatusText = isDeactivate ? 'Inactive' : 'Active';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className={`text-xl font-semibold ${iconColor}`}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="mb-6">
          {/* Warning/Confirmation Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center`}>
              {isDeactivate ? (
                <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className={`w-8 h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>

          {/* Confirmation Message */}
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
            Are you sure you want to {actionText.toLowerCase()} this fee?
          </h3>

          {/* Fee Details */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Fee Name:</span> {fee.feeName}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Amount:</span> {formatCurrency(fee.amount)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Type:</span> {fee.isMandatory ? 'Mandatory' : 'Optional'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Current Status:</span>
              <span className={`ml-1 font-medium ${fee.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {statusText}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Will be:</span>
              <span className={`ml-1 font-medium ${isDeactivate ? 'text-red-600' : 'text-green-600'}`}>
                {newStatusText}
              </span>
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center mt-4">
            {isDeactivate
              ? 'This action will deactivate the fee and it will no longer be available.'
              : 'This action will reactivate the fee and make it available again.'}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${buttonColor} rounded-md transition-colors flex items-center justify-center min-w-30`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              `Yes, ${actionText}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
