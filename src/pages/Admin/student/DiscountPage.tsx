import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Context/Auth/useAuth';
import { discountService } from '../../../Services/discount';

interface Discount {
  discountId: string;
  studentId: string;
  studentName: string;
  className: string | null;
  schoolId: string;
  discountAmount: number;
  reason: string;
  isActive: boolean;
  sessionId: string;
  termId: string;
  createdBy: string;
  createdAt: string;
}

interface ApiResponse {
  status: boolean;
  responseCode: string;
  responseMessage: string;
  data: Discount[];
}

const DiscountPage: React.FC = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || '';
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deactivate modal states
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivatingDiscount, setDeactivatingDiscount] = useState<Discount | null>(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  // Fetch discounts on component mount
  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await discountService.getDiscounts(schoolId);
      console.log(response);
      setDiscounts(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateClick = (discount: Discount) => {
    setDeactivatingDiscount(discount);
    setDeactivateError(null);
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = async () => {
    if (!deactivatingDiscount) return;

    setDeactivateLoading(true);
    setDeactivateError(null);

    try {
      // Call the deactivate API
      await discountService.DeactivateDiscount(deactivatingDiscount.discountId);

      // Refresh the list after successful deactivation
      await fetchDiscounts();

      // Close modal
      setShowDeactivateModal(false);
      setDeactivatingDiscount(null);

    } catch (err) {
      setDeactivateError(err instanceof Error ? err.message : 'An error occurred while deactivating discount');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleCloseDeactivateModal = () => {
    if (!deactivateLoading) {
      setShowDeactivateModal(false);
      setDeactivatingDiscount(null);
      setDeactivateError(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading discounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-5xl mb-3">!</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Discounts</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDiscounts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Discounts</h1>
          <p className="text-sm text-gray-600 mt-1">
            {discounts.length} discount(s) found
          </p>
        </div>
        <button
          onClick={fetchDiscounts}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Discount List */}
      {discounts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No discounts found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {discounts.map((discount) => (
            <div
              key={discount.discountId}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between">
                {/* Left Section - Student Info */}
                <div className="flex-1 min-w-50">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {discount.studentName}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Student ID:</span> {discount.studentId}
                    </p>
                    {discount.className && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Class:</span> {discount.className}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle Section - Discount Details */}
                <div className="flex-1 min-w-37.5 mx-4">
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(discount.discountAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {discount.reason}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${discount.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      <span className="text-sm text-gray-600">
                        {discount.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section - Meta & Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="text-sm text-gray-500 text-right">
                    <p>Created: {formatDate(discount.createdAt)}</p>
                    <p className="mt-1">By: {discount.createdBy}</p>
                  </div>
                  {discount.isActive && (
                    <button
                      onClick={() => handleDeactivateClick(discount)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Deactivate
                    </button>
                  )}
                  {!discount.isActive && (
                    <span className="text-sm text-gray-500 italic">Deactivated</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && deactivatingDiscount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
          onClick={handleCloseDeactivateModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b">
              <h2 className="text-xl font-semibold text-red-600">
                Confirm Deactivation
              </h2>
              <button
                onClick={handleCloseDeactivateModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={deactivateLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mb-6">
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Confirmation Message */}
              <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
                Are you sure you want to deactivate this discount?
              </h3>

              {/* Discount Details */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Student:</span> {deactivatingDiscount.studentName}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Student ID:</span> {deactivatingDiscount.studentId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Amount:</span> {formatCurrency(deactivatingDiscount.discountAmount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Reason:</span> {deactivatingDiscount.reason}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Status:</span>
                  <span className="ml-1 text-green-600 font-medium">Active</span>
                </p>
              </div>

              {deactivateError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{deactivateError}</p>
                </div>
              )}

              <p className="text-sm text-gray-500 text-center mt-4">
                This action cannot be undone. The discount will be marked as inactive.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseDeactivateModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={deactivateLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeactivateConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors flex items-center justify-center min-w-30"
                disabled={deactivateLoading}
              >
                {deactivateLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deactivating...
                  </>
                ) : (
                  'Yes, Deactivate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountPage;
