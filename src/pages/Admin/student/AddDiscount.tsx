import React, { useState } from 'react';
import { useAuth } from '../../../Context/Auth/useAuth';
import { discountService } from '../../../Services/discount';
import { toast } from 'react-toastify';

interface AddDiscountProps {
  onClose: () => void;
  studentId: string;
}

interface DiscountPayload {
  studentId: string;
  schoolId: string;
  discountAmount: number;
  reason: string;
  sessionId: string;
  termId: string;
}

interface ApiError {
  message?: string;
  [key: string]: any;
}

const AddDiscount: React.FC<AddDiscountProps> = ({
  onClose,
  studentId,
}) => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || '';
  const sessionId = user?.termId || '6b3e9702-c2cd-4319-1939-08def7144f5e';
  const termId = user?.termId || '';

  const [formData, setFormData] = useState({
    discountAmount: 0,
    reason: ''
  });

  const [errors, setErrors] = useState<{
    discountAmount?: string;
    reason?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discountAmount' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { discountAmount?: string; reason?: string } = {};

    if (!formData.discountAmount || formData.discountAmount <= 0) {
      newErrors.discountAmount = 'Discount amount must be greater than 0';
    }

    if (!formData.reason || formData.reason.trim().length < 3) {
      newErrors.reason = 'Reason must be at least 3 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Validate required IDs
    if (!schoolId || !sessionId || !termId) {
      setApiError('School, session, or term information is missing');
      return;
    }

    const payload: DiscountPayload = {
      studentId,
      schoolId,
      discountAmount: formData.discountAmount,
      reason: formData.reason.trim(),
      sessionId,
      termId
    };

    setIsLoading(true);
    setApiError(null);

    try {
      await discountService.addDiscount(payload);

      toast.success('Discount added successfully');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setApiError(errorMessage);

      // Error callback
      toast.error('Failed to add discount');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Add Discount</h2>
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

        {/* API Error Display */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Student ID Display (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                value={studentId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Discount Amount Input */}
            <div>
              <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount *
              </label>
              <input
                id="discountAmount"
                name="discountAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discountAmount || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.discountAmount ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter discount amount"
                disabled={isLoading}
              />
              {errors.discountAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.discountAmount}</p>
              )}
            </div>

            {/* Reason Input */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason *
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Enter reason for discount"
                disabled={isLoading}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            {/* Session & Term Info (Read-only) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session ID
                </label>
                <input
                  type="text"
                  value={sessionId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term ID
                </label>
                <input
                  type="text"
                  value={termId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* School ID (Hidden - Displayed for debugging if needed) */}
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School ID
              </label>
              <input
                type="text"
                value={schoolId}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/80 rounded-md transition-colors flex items-center justify-center min-w-30"
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
                'Add Discount'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDiscount;
