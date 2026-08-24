import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Context/Auth/useAuth';
import OtherFeesTable from './OtherFeesTable';
import CreateOtherFeeModal from './CreateOtherFeeModal';
import { OtherFeeService } from '../../../Services/other-fees';

export interface OtherFee {
  otherFeeId: string;
  schoolId: string;
  feeName: string;
  amount: number;
  isMandatory: boolean;
  description: string;
  sessionId: string;
  termId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateOtherFeePayload {
  schoolId: string;
  feeName: string;
  amount: number;
  isMandatory: boolean;
  description: string;
  sessionId: string;
  termId: string;
}

const OtherFees: React.FC = () => {
  const { user } = useAuth();
  const schoolId = user?.schoolId || '';
  const sessionId = user?.sessionId || '';
  const termId = user?.termId || '';

  const [otherFees, setOtherFees] = useState<OtherFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch other fees on component mount
  useEffect(() => {
    fetchOtherFees();
  }, []);

  const fetchOtherFees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await OtherFeeService.getOtherFees(schoolId);
      setOtherFees(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching other fees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFee = async (data: CreateOtherFeePayload) => {
    try {
      await OtherFeeService.createOtherFees(data);
      await fetchOtherFees();
      setShowCreateModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDeactivateFee = async (feeId: string) => {
    try {
      await OtherFeeService.deactivateOtherFee(feeId);
      await fetchOtherFees();
    } catch (err) {
      throw err;
    }
  };

  // const handleActivateFee = async (feeId: string) => {
  //   try {
  //     await OtherFeeService.activateOtherFee(feeId);
  //     await fetchOtherFees();
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading other fees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 text-5xl mb-3">!</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Other Fees</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchOtherFees}
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
          <h1 className="text-2xl font-bold text-gray-800">Other Fees</h1>
          <p className="text-sm text-gray-600 mt-1">
            {otherFees.length} fee(s) found
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchOtherFees}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Fee
          </button>
        </div>
      </div>

      {/* Table */}
      <OtherFeesTable
        otherFees={otherFees}
        onDeactivate={handleDeactivateFee}
        // onActivate={handleActivateFee}
      />

      {/* Create Modal */}
      <CreateOtherFeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFee}
        schoolId={schoolId}
        sessionId={sessionId}
        termId={termId}
      />
    </div>
  );
};

export default OtherFees;
