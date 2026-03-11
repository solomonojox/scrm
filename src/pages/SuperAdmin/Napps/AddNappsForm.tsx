import React, { useState, useEffect, useContext } from 'react';
import { superAdminService } from '../../../Services/superAdmin';
import { AppContext } from '../../../Context/AppContext';

// Define the form data interface based on the payload
interface NappsFormData {
    contactName: string;
    chapterState: string;
    contactEmail: string;
    contactPhone: string;
}

// Define props interface for the component
interface AddNappsFormProps {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
    initialData?: Partial<NappsFormData>;
    title?: string;
    isEditing?: boolean;
}

const AddNappsForm: React.FC<AddNappsFormProps> = ({
    open,
    onClose,
    refetch,
    initialData = {},
    title = 'Add New Chapter',
    isEditing = false,
}) => {
    const { showOverlay, hideOverlay } = useContext(AppContext);
    const [formData, setFormData] = useState<NappsFormData>({
        contactName: '',
        chapterState: '',
        contactEmail: '',
        contactPhone: '',
        ...initialData,
    });

    // Validation errors state
    const [errors, setErrors] = useState<Partial<Record<keyof NappsFormData, string>>>({});

    // UI states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name as keyof NappsFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof NappsFormData, string>> = {};

        // Contact Name validation
        if (!formData.contactName.trim()) {
            newErrors.contactName = 'Contact name is required';
        } else if (formData.contactName.length < 2) {
            newErrors.contactName = 'Contact name must be at least 2 characters';
        }

        // Chapter State validation
        if (!formData.chapterState.trim()) {
            newErrors.chapterState = 'Chapter state is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.contactEmail.trim()) {
            newErrors.contactEmail = 'Email is required';
        } else if (!emailRegex.test(formData.contactEmail)) {
            newErrors.contactEmail = 'Please enter a valid email address';
        }

        // Phone validation (optional, but if provided, validate format)
        if (formData.contactPhone.trim()) {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            if (!phoneRegex.test(formData.contactPhone)) {
                newErrors.contactPhone = 'Please enter a valid phone number';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        showOverlay();

        try {
            await superAdminService.createNapp(formData);
            setFormData({
                contactName: '',
                chapterState: '',
                contactEmail: '',
                contactPhone: '',
                ...initialData,
            });
            refetch();
            onClose();
        } catch (error: any) {
            // console.log(error.response.data.responseMessage)
            setSubmitError(error.response.data.responseMessage || 'An error occurred while submitting');
        } finally {
            setIsSubmitting(false);
            hideOverlay();
        }
    };

    // Handle modal close
    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    // Prevent closing when clicking inside the modal
    const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
                onClick={handleModalClick}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit Napps' : title}
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600">{submitError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4">
                            {/* Contact Name */}
                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contactName"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    maxLength={100}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactName
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500'
                                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Enter contact name"
                                />
                                {errors.contactName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                                )}
                            </div>

                            {/* Chapter State */}
                            <div>
                                <label htmlFor="chapterState" className="block text-sm font-medium text-gray-700 mb-1">
                                    Chapter State <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="chapterState"
                                    name="chapterState"
                                    value={formData.chapterState}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.chapterState
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500'
                                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Enter chapter state"
                                />
                                {errors.chapterState && (
                                    <p className="mt-1 text-sm text-red-600">{errors.chapterState}</p>
                                )}
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        name="contactEmail"
                                        value={formData.contactEmail}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactEmail
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-blue-500'
                                            } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                        placeholder="Enter email address"
                                    />
                                    {formData.contactEmail && !errors.contactEmail && (
                                        <span className="absolute right-3 top-2.5 text-green-500">✓</span>
                                    )}
                                </div>
                                {errors.contactEmail && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                                )}
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Phone
                                </label>
                                <input
                                    type="tel"
                                    id="contactPhone"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contactPhone
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-blue-500'
                                        } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    placeholder="Enter phone number"
                                />
                                {errors.contactPhone ? (
                                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-500">Optional: Enter phone number</p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex justify-center"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : isEditing ? (
                                    'Update'
                                ) : (
                                    'Add'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNappsForm;