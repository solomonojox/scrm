

export type InvoiceTypeOption = 'term' | 'session';

/** One row from the payments list endpoint. */
export interface PaymentRecordType {
    paymentId: string;
    studentId: string;
    studentName: string;
    classroomId: string;
    className: string;
    sessionId: string;
    amount: number;
    paymentDate: string;
    guardianName?: string;
    registrationNumber?: string;
}

export interface PaymentsApiResponse {
    status: boolean;
    responseCode: string;
    responseMessage: string;
    data: PaymentRecordType[];
}

/**
 * An invoice is NOT part of the payments payload — it only exists once the
 * user clicks "Generate Invoice" for that row. This is what we expect back
 * from `generateInvoice` / `generateSessionInvoice`, keyed by `paymentId`
 * in the page's local state.
 */
export interface GeneratedInvoiceData {
    invoiceId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    amountPerStudent: number;
    totalAmount: number;
    studentCount: number;
    isPaid: boolean;
    paidDate: string | null;
    paymentReference: string | null;
    emailSent: boolean;
    emailSentDate: string | null;
    paymentInstructions: string | null;
    schoolId: string;
    schoolName: string | null;
    sessionTermId: string;
    school: any | null;
    sessionTerm: any | null;
}
