import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import ConfirmationModal from './ConfirmationModal';
import { OtherFee } from './OtherFees';

interface OtherFeesTableProps {
  otherFees: OtherFee[];
  onDeactivate: (feeId: string) => Promise<void>;
  onActivate?: (feeId: string) => Promise<void>;
  searchTerm?: string;
}

const OtherFeesTable: React.FC<OtherFeesTableProps> = ({
  otherFees,
  onDeactivate,
  onActivate,
  searchTerm = ''
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<OtherFee | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'deactivate'>('deactivate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActionClick = (fee: OtherFee, action: 'activate' | 'deactivate') => {
    setSelectedFee(fee);
    setActionType(action);
    setError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedFee) return;

    setIsLoading(true);
    setError(null);

    try {
      if (actionType === 'deactivate') {
        await onDeactivate(selectedFee.otherFeeId);
      } else {
        await onActivate?.(selectedFee.otherFeeId);
      }
      setShowConfirmModal(false);
      setSelectedFee(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (!isLoading) {
      setShowConfirmModal(false);
      setSelectedFee(null);
      setError(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to highlight matching text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }

    const parts = text.split(new RegExp(`(${highlight.trim()})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.trim().toLowerCase() ? (
            <span key={index} className="bg-yellow-200 font-medium">{part}</span>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  };

  if (otherFees.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          {searchTerm ? 'No fees found matching your search' : 'No other fees found'}
        </p>
        {searchTerm && (
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search terms
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {otherFees.map((fee) => (
                <tr key={fee.otherFeeId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {highlightText(fee.feeName, searchTerm)}
                    </div>
                    {fee.description && (
                      <div className="text-sm text-gray-500">
                        {highlightText(fee.description, searchTerm)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(fee.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${fee.isMandatory
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {fee.isMandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={fee.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {formatDate(fee.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {/* Activate/Deactivate Button */}
                      {fee.isActive ? (
                        <button
                          onClick={() => handleActionClick(fee, 'deactivate')}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Deactivate fee"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActionClick(fee, 'activate')}
                          className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                          title="Activate fee"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        isLoading={isLoading}
        error={error}
        fee={selectedFee}
        actionType={actionType}
      />
    </>
  );
};

export default OtherFeesTable;
