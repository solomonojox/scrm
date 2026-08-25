import React, { useState } from 'react';
import { Classroom, CreateOtherFeePayload } from './OtherFees';
import { classrooms } from '../../../Types/classroomTypes';

interface CreateOtherFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOtherFeePayload) => Promise<void>;
  schoolId: string;
  sessionId: string;
  termId: string;
  classrooms: classrooms[]
}

const CreateOtherFeeModal: React.FC<CreateOtherFeeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  schoolId,
  sessionId,
  termId,
  classrooms
}) => {
  const [formData, setFormData] = useState({
    classroomId: '',
    feeName: '',
    amount: 0,
    isMandatory: true,
    description: ''
  });
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');

  const [errors, setErrors] = useState<{
    feeName?: string;
    amount?: string;
    description?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }

    // Clear errors
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { feeName?: string; amount?: string; description?: string } = {};

    if (!formData.feeName || formData.feeName.trim().length < 3) {
      newErrors.feeName = 'Fee name must be at least 3 characters long';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description || formData.description.trim().length < 5) {
      newErrors.description = 'Description must be at least 5 characters long';
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

    const payload: CreateOtherFeePayload = {
      schoolId,
      classroomId: selectedClassroom,
      feeName: formData.feeName.trim(),
      amount: formData.amount,
      isMandatory: formData.isMandatory,
      description: formData.description.trim(),
      sessionId,
      termId
    };

    setIsLoading(true);
    setApiError(null);

    try {
      await onSubmit(payload);
      // Reset form on success
      setFormData({
        classroomId: '',
        feeName: '',
        amount: 0,
        isMandatory: true,
        description: ''
      });
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to create fee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const classroomOptions = classrooms.map((classroom: Classroom) => ({
    value: classroom.classroomId,
    label: classroom.name
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Create Other Fee</h2>
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

        {/* API Error */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Fee Name */}
          <div className="mb-4">
            <label htmlFor="feeName" className="block text-sm font-medium text-gray-700 mb-1">
              Fee Name *
            </label>
            <input
              id="feeName"
              name="feeName"
              type="text"
              value={formData.feeName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.feeName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter fee name"
              disabled={isLoading}
            />
            {errors.feeName && (
              <p className="mt-1 text-sm text-red-600">{errors.feeName}</p>
            )}
          </div>

          <div className="relative mb-4">
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

          {/* Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount || ''}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter amount"
              disabled={isLoading}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Is Mandatory */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                name="isMandatory"
                type="checkbox"
                checked={formData.isMandatory}
                onChange={handleInputChange}
                className="w-4 h-4 accent-primary"
                disabled={isLoading}
              />
              <span className="text-sm font-medium text-gray-700">Mandatory Fee</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              {formData.isMandatory
                ? 'This fee will be automatically added to all students'
                : 'This fee can be optionally added to students'}
            </p>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter fee description"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Read-only IDs */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">
              <span className="font-medium">School ID:</span> {schoolId || 'Not set'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Session ID:</span> {sessionId || 'Not set'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              <span className="font-medium">Term ID:</span> {termId || 'Not set'}
            </p>
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
                  Creating...
                </>
              ) : (
                'Create Fee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOtherFeeModal;
