import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Context/Auth/useAuth';
import OtherFeesTable from './OtherFeesTable';
import CreateOtherFeeModal from './CreateOtherFeeModal';
import { OtherFeeService } from '../../../Services/other-fees';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from '../../../Store/Admin/classroomSlice';
import { classroomService } from '../../../Services/Classroom';

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
  classroomId: string;
  feeName: string;
  amount: number;
  isMandatory: boolean;
  description: string;
  sessionId: string;
  termId: string;
}

export interface Classroom {
  classroomId: string;
  name: string;
  teacherId: string;
  capacity: number;
  schoolId: string;
}

const OtherFees: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const schoolId = user?.schoolId || '';
  const sessionId = user?.sessionId || '';
  const termId = user?.termId || '';

  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const fetchingClass = useSelector((state: RootState) => state.getClassrooms.loading);

  const [otherFees, setOtherFees] = useState<OtherFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');

  // Fetch other fees on component mount
  useEffect(() => {
    if (schoolId) fetchOtherFees();
  }, [schoolId]);

  useEffect(() => {
    if (schoolId) fetchOtherFees();
  }, [selectedClassroom]);

  useEffect(() => {
    if (!fetchingClass && classrooms.length === 0) {
      fetchClassroom();
    }
  }, [dispatch]);

  const fetchClassroom = async () => {
    dispatch(fetchClassroomsStart());
    try {
      const data = await classroomService.getClassroomBySchoolId(localStorage.getItem("schoolId"));
      dispatch(fetchClassroomsSuccess(data));
    } catch (err) {
      dispatch(fetchClassroomsFailure((err as Error).message));
    }
  };

  const fetchOtherFees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await OtherFeeService.getOtherFees(schoolId, selectedClassroom);
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

  // Filter fees based on search term and classroom
  const filteredFees = otherFees.filter(fee => {
    // Search filter
    const searchLower = searchTerm.toLowerCase().trim();
    let matchesSearch = true;
    if (searchLower) {
      matchesSearch = (
        fee.feeName.toLowerCase().includes(searchLower) ||
        fee.description?.toLowerCase().includes(searchLower) ||
        fee.amount.toString().includes(searchLower) ||
        (fee.isMandatory ? 'mandatory' : 'optional').includes(searchLower) ||
        (fee.isActive ? 'active' : 'inactive').includes(searchLower)
      );
    }

    // Classroom filter
    let matchesClassroom = true;
    if (selectedClassroom) {
      // Since the fee data doesn't have classroomId directly,
      // we'll filter based on the fee being used in the selected classroom
      // This assumes you have a way to link fees to classrooms
      // For now, we'll keep all fees if classroom filter is not applicable
      // You can modify this logic based on your data structure
      matchesClassroom = true; // Placeholder - implement based on your data
    }

    return matchesSearch && matchesClassroom;
  });

  // Get unique classroom options for filter
  const classroomOptions = classrooms.map((classroom: Classroom) => ({
    value: classroom.classroomId,
    label: classroom.name
  }));

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
            {filteredFees.length} fee(s) found {searchTerm && `(filtered from ${otherFees.length})`}
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

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fees by name, description, amount, type, or status..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Classroom Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
          >
            <option value="">All Classrooms</option>
            {classroomOptions.map((classroom) => (
              <option key={classroom.value} value={classroom.value}>
                {classroom.label}
              </option>
            ))}
          </select>
          {selectedClassroom && (
            <button
              onClick={() => setSelectedClassroom('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedClassroom) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {selectedClassroom && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Classroom: {classroomOptions.find(c => c.value === selectedClassroom)?.label || selectedClassroom}
              <button
                onClick={() => setSelectedClassroom('')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <OtherFeesTable
        otherFees={filteredFees}
        onDeactivate={handleDeactivateFee}
        searchTerm={searchTerm}
      />

      {/* Create Modal */}
      <CreateOtherFeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFee}
        schoolId={schoolId}
        sessionId={sessionId}
        termId={termId}
        classrooms={classrooms}
      />
    </div>
  );
};

export default OtherFees;
