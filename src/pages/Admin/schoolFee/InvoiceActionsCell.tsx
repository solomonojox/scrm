import React from 'react';
import { FaSyncAlt, FaDownload, FaEye } from 'react-icons/fa';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CircularProgress } from '@mui/material';
import InvoicePDF from './InvoicePDF';
import { GeneratedInvoiceData, PaymentRecordType } from '../../../Types/Admin/InvoiceRecordType';

interface SchoolInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    registrationNumber?: string;
    ownerName?: string;
    city?: string;
    state?: string;
    typeOfSchool?: string;
}

interface InvoiceActionsCellProps {
    payment: PaymentRecordType;
    generatedInvoice?: GeneratedInvoiceData;
    isGenerating: boolean;
    schoolInfo: SchoolInfo;
    formatDate: (dateString: string) => string;
    onGenerate: (payment: PaymentRecordType) => void;
    onPreview: (payment: PaymentRecordType) => void;
}

/**
 * Small round icon button, styled to match the orange/white CBT admin
 * design language. Shows a disabled state, a hover state, and an optional
 * inline loading spinner.
 */
const ActionIconButton: React.FC<{
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant: 'primary' | 'success' | 'info';
    children: React.ReactNode;
}> = ({ label, onClick, disabled, loading, variant, children }) => {
    const variantClasses: Record<typeof variant, string> = {
        primary: 'bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white',
        success: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white',
        info: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white',
    };

    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center w-9 h-9 rounded-full
                transition-colors duration-150 ease-in-out
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:hover:text-gray-400
                ${disabled ? 'bg-gray-100 text-gray-400' : variantClasses[variant]}
            `}
        >
            {loading ? <CircularProgress size={16} color="inherit" /> : children}
        </button>
    );
};

const InvoiceActionsCell: React.FC<InvoiceActionsCellProps> = ({
    payment,
    generatedInvoice,
    isGenerating,
    schoolInfo,
    formatDate,
    onGenerate,
    onPreview,
}) => {
    const generated = Boolean(generatedInvoice?.invoiceId && generatedInvoice?.invoiceNumber);

    const studentInfo = {
        name: payment.studentName,
        guardianName: 'N/A',
        classroom: payment.className,
        studentId: payment.studentId,
        registrationNumber: 'N/A',
    };

    return (
        <div className="flex items-center gap-2">
            {/* Generate Invoice */}
            <ActionIconButton
                label={generated ? 'Regenerate Invoice' : 'Generate Invoice'}
                variant="primary"
                loading={isGenerating}
                onClick={() => onGenerate(payment)}
            >
                <FaSyncAlt className="text-sm" />
            </ActionIconButton>

            {/* Download PDF - disabled until generated */}
            {generated && generatedInvoice ? (
                <PDFDownloadLink
                    document={
                        <InvoicePDF
                            invoiceData={{
                                invoiceId: generatedInvoice.invoiceId,
                                schoolId: generatedInvoice.schoolId,
                                schoolName: generatedInvoice.schoolName,
                                sessionTermId: generatedInvoice.sessionTermId,
                                studentCount: generatedInvoice.studentCount,
                                amountPerStudent: generatedInvoice.amountPerStudent,
                                totalAmount: generatedInvoice.totalAmount,
                                invoiceDate: generatedInvoice.invoiceDate,
                                dueDate: generatedInvoice.dueDate,
                                isPaid: generatedInvoice.isPaid,
                                paidDate: generatedInvoice.paidDate,
                                paymentReference: generatedInvoice.paymentReference,
                                emailSent: generatedInvoice.emailSent,
                                emailSentDate: generatedInvoice.emailSentDate as string,
                                invoiceNumber: generatedInvoice.invoiceNumber,
                                paymentInstructions: generatedInvoice.paymentInstructions,
                                school: generatedInvoice.school,
                                sessionTerm: generatedInvoice.sessionTerm,
                            }}
                            schoolInfo={schoolInfo}
                            studentInfo={studentInfo}
                            formatDate={formatDate}
                        />
                    }
                    fileName={`${generatedInvoice.invoiceNumber}.pdf`}
                    className="no-underline"
                >
                    {({ loading }) => (
                        <ActionIconButton label="Download PDF" variant="success" loading={loading}>
                            <FaDownload className="text-sm" />
                        </ActionIconButton>
                    )}
                </PDFDownloadLink>
            ) : (
                <ActionIconButton label="Download PDF (generate invoice first)" variant="success" disabled>
                    <FaDownload className="text-sm" />
                </ActionIconButton>
            )}

            {/* Preview Invoice - disabled until generated */}
            <ActionIconButton
                label={generated ? 'Preview Invoice' : 'Preview Invoice (generate invoice first)'}
                variant="info"
                disabled={!generated}
                onClick={() => onPreview(payment)}
            >
                <FaEye className="text-sm" />
            </ActionIconButton>
        </div>
    );
};

export default InvoiceActionsCell;