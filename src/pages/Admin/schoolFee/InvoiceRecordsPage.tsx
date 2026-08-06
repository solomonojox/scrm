import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BiMessageAlt } from 'react-icons/bi';
import { FaRegBell, FaSearch, FaPlus, FaFileInvoiceDollar } from 'react-icons/fa';
import { useAuth } from '../../../Context/Auth/useAuth';
import ManualFeeRecordForm, { PaymentTerm } from './ManualFeeRecordForm';
import InvoiceActionsCell from './InvoiceActionsCell';
import { GeneratedInvoiceData, InvoiceTypeOption, PaymentRecordType } from '../../../Types/Admin/InvoiceRecordType';
import { AppDispatch, RootState } from '../../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentsFailure, fetchStudentsStart, fetchStudentsSuccess } from '../../../Store/Student/studentSlice';
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from '../../../Store/Admin/classroomSlice';
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from '../../../Store/Guardian/guardianSlice';
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from '../../../Store/Teachers/teacherSlice';
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from '../../../Store/sessionSlice';
import { fetchSchoolFailure, fetchSchoolStart, fetchSchoolSuccess } from '../../../Store/Admin/schoolSlice';
import { studentService } from '../../../Services/Student/StudentService';
import { classroomService } from '../../../Services/Classroom';
import { guardianService } from '../../../Services/Guardian/guardian';
import { teacherService } from '../../../Services/Teachers/TeacherService';
import { sessionService } from '../../../Services/Session';
import { paymentService } from '../../../Services/Payment';
import { toast } from 'react-toastify';
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    CircularProgress,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { schoolService } from '../../../Services/Admin/schoolService';

interface SchoolInfo {
    schoolId: string;
    schoolName: string;
    address: string;
    schoolPhone: string;
    schoolEmail: string;
    registrationNumber: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    city: string;
    state: string;
    typeOfSchool: string;
    cac: string | null;
}

const InvoiceRecordsPage = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [payments, setPayments] = useState<PaymentRecordType[]>([]);

    // Invoices are generated on demand and aren't part of the payments
    // payload, so we track them separately, keyed by paymentId.
    const [generatedInvoices, setGeneratedInvoices] = useState<Record<string, GeneratedInvoiceData>>({});
    const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
    const [invoiceTypeByPayment, setInvoiceTypeByPayment] = useState<Record<string, InvoiceTypeOption>>({});

    const [schoolData, setSchoolData] = useState<SchoolInfo | null>(null);
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);

    // Record Payment modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // Invoice preview dialog
    const [previewPayment, setPreviewPayment] = useState<PaymentRecordType | null>(null);

    const students = useSelector((state: RootState) => state.getStudent.listRecords);
    const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
    const guardians = useSelector((state: RootState) => state.getGuardian.listRecords);
    const sessions = useSelector((state: RootState) => state.getSession.listRecords);

    useEffect(() => {
        if (user) {
            fetchSupportingData();
            fetchPayments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user]);

    const fetchSupportingData = async () => {
        dispatch(fetchStudentsStart());
        dispatch(fetchClassroomsStart());
        dispatch(fetchGuardiansStart());
        dispatch(fetchTeacherStart());
        dispatch(fetchSessionStart());
        dispatch(fetchSchoolStart());

        try {
            const schoolId = localStorage.getItem('schoolId');

            const [data, classRoom, guardian, teachers, session, schoolResponse] = await Promise.all([
                studentService.getAll(schoolId),
                classroomService.getAllClassrooms(schoolId),
                guardianService.getAll(schoolId),
                teacherService.getAll(schoolId),
                sessionService.getAllRegisteredSessions(schoolId),
                schoolService.getSchoolById(schoolId),
            ]);

            dispatch(fetchStudentsSuccess(data));
            dispatch(fetchClassroomsSuccess(classRoom));
            dispatch(fetchGuardiansSuccess(guardian));
            dispatch(fetchTeacherSuccess(teachers));
            dispatch(fetchSessionSuccess(session));
            dispatch(fetchSchoolSuccess(schoolResponse));

            if (schoolResponse) {
                setSchoolData({
                    schoolId: schoolResponse.schoolId,
                    schoolName: schoolResponse.schoolName,
                    address: schoolResponse.address,
                    schoolPhone: schoolResponse.schoolPhone,
                    schoolEmail: schoolResponse.schoolEmail,
                    registrationNumber: schoolResponse.registrationNumber,
                    ownerName: schoolResponse.ownerName,
                    ownerEmail: schoolResponse.ownerEmail,
                    ownerPhone: schoolResponse.ownerPhone,
                    city: schoolResponse.city,
                    state: schoolResponse.state,
                    typeOfSchool: schoolResponse.typeOfSchool,
                    cac: schoolResponse.cac,
                });
            }

            if (user?.termId) {
                setPaymentTerms([{ paymentTermId: user.termId, name: 'Current Term' }]);
            }
        } catch (err) {
            dispatch(fetchStudentsFailure((err as Error).message));
            dispatch(fetchClassroomsFailure((err as Error).message));
            dispatch(fetchGuardiansFailure((err as Error).message));
            dispatch(fetchTeacherFailure((err as Error).message));
            dispatch(fetchSessionFailure((err as Error).message));
            dispatch(fetchSchoolFailure((err as Error).message));
        }
    };

    // Pulls from the real payments endpoint:
    // { status, responseCode, responseMessage, data: PaymentRecordType[] }
    const fetchPayments = async () => {
        const schoolId = user?.schoolId || localStorage.getItem('schoolId');
        if (!schoolId) return;

        setIsLoadingPayments(true);
        try {
            const response: any = await paymentService.getPaymentsBySchoolId(schoolId);
            const records: PaymentRecordType[] = response?.data ?? [];
            setPayments(records);

            // Default every row to "term" invoice type unless already chosen
            setInvoiceTypeByPayment((prev) => {
                const next = { ...prev };
                records.forEach((payment) => {
                    if (!next[payment.paymentId]) {
                        next[payment.paymentId] = 'term';
                    }
                });
                return next;
            });
        } catch (error: any) {
            console.error('fetchPayments error:', error);
            toast.error(error?.response?.data?.responseMessage || 'Failed to load payment records');
        } finally {
            setIsLoadingPayments(false);
        }
    };

    const recordPayment = async (data: any) => {
        try {
            await paymentService.payStudentSchoolFeeManually(data);
            toast.success('Fee payment recorded successfully');
            setIsPaymentModalOpen(false);
            fetchPayments();
        } catch (error: any) {
            console.error('recordPayment error:', error);
            const message = error?.response?.data?.responseMessage || 'Failed to record fee payment';
            toast.error(message);
            throw message;
        }
    };

    const handleInvoiceTypeChange = (paymentId: string, type: InvoiceTypeOption) => {
        setInvoiceTypeByPayment((prev) => ({ ...prev, [paymentId]: type }));
    };

    const handleGenerateInvoice = useCallback(
        async (payment: PaymentRecordType) => {
            const schoolId = user?.schoolId;
            const sessionTermId = user?.termId;
            const invoiceType = invoiceTypeByPayment[payment.paymentId] ?? 'term';

            if (!schoolId || !payment.sessionId) {
                toast.error('School or session information is missing');
                return;
            }

            setGeneratingIds((prev) => new Set(prev).add(payment.paymentId));
            try {
                let response: any;
                if (invoiceType === 'session') {
                    response = await paymentService.generateSessionInvoice({
                        schoolId,
                        sessionTermId: sessionTermId,
                    });
                } else {
                    response = await paymentService.generateInvoice({
                        schoolId,
                        sessionTermId: sessionTermId,
                    });
                }

                const raw = response.data;

                // This invoice is for a single student's payment row, so
                // scope the totals down the same way the original single-
                // student flow did.
                const invoice: GeneratedInvoiceData = {
                    invoiceId: raw.invoiceId,
                    invoiceNumber: raw.invoiceNumber,
                    invoiceDate: raw.invoiceDate,
                    dueDate: raw.dueDate,
                    amountPerStudent: raw.amountPerStudent,
                    totalAmount: raw.amountPerStudent,
                    studentCount: 1,
                    isPaid: raw.isPaid,
                    paidDate: raw.paidDate,
                    paymentReference: raw.paymentReference,
                    emailSent: raw.emailSent,
                    emailSentDate: raw.emailSentDate,
                    paymentInstructions: raw.paymentInstructions,
                    schoolId: raw.schoolId ?? schoolId,
                    schoolName: schoolData?.schoolName ?? raw.schoolName ?? null,
                    sessionTermId: raw.sessionTermId ?? payment.sessionId,
                    school: raw.school ?? null,
                    sessionTerm: raw.sessionTerm ?? null,
                };

                setGeneratedInvoices((prev) => ({ ...prev, [payment.paymentId]: invoice }));
                toast.success('Invoice generated successfully');
            } catch (error: any) {
                console.error('handleGenerateInvoice error:', error);
                toast.error(error?.response?.data?.responseMessage || 'Failed to generate invoice');
            } finally {
                setGeneratingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(payment.paymentId);
                    return next;
                });
            }
        },
        [user, invoiceTypeByPayment, schoolData]
    );

    const getSchoolInfo = () => ({
        name: schoolData?.schoolName || user?.schoolName || 'School Management System',
        address: schoolData?.address || '123 Education Street, City, State',
        phone: schoolData?.schoolPhone || '(123) 456-7890',
        email: schoolData?.schoolEmail || user?.email || 'info@school.edu',
        registrationNumber: schoolData?.registrationNumber || 'N/A',
        ownerName: schoolData?.ownerName || 'N/A',
        city: schoolData?.city || 'N/A',
        state: schoolData?.state || 'N/A',
        typeOfSchool: schoolData?.typeOfSchool || 'N/A',
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredPayments = useMemo(() => {
        if (!searchQuery.trim()) return payments;
        const query = searchQuery.trim().toLowerCase();
        return payments.filter(
            (payment) =>
                payment.studentName?.toLowerCase().includes(query) ||
                payment.className?.toLowerCase().includes(query) ||
                payment.sessionId?.toLowerCase().includes(query)
        );
    }, [payments, searchQuery]);

    const previewInvoice = previewPayment ? generatedInvoices[previewPayment.paymentId] : undefined;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-1 mb-4">
                <div className="w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
                        <FaSearch className="text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search by student, class, or session"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ml-2 bg-transparent outline-none w-full text-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {/* <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" /> */}
                    {/* <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" /> */}
                    <div className="flex items-center rounded-full px-3 py-1 space-x-2">
                        <img
                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
                            className="w-14 h-14 rounded-full"
                            alt="Admin"
                        />
                        <div className="text-xs">
                            <div className="font-semibold text-gray-700">{schoolData?.schoolName || user?.schoolName}</div>
                            <div className="text-gray-400">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Header + Record Payment button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div className="flex items-center gap-2">
                    <FaFileInvoiceDollar className="text-orange-500 text-2xl" />
                    <h2 className="text-xl font-semibold text-gray-800">Invoice Records</h2>
                </div>
                <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors shadow-sm"
                >
                    <FaPlus className="text-sm" />
                    Record Payment
                </button>
            </div>

            {/* Payments / Invoice Records Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Class
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Session
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Payment Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Invoice Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Invoice
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoadingPayments ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center">
                                        <CircularProgress size={24} className="text-orange-500" />
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                                        No payment records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => {
                                    const invoice = generatedInvoices[payment.paymentId];
                                    const generated = Boolean(invoice?.invoiceId);
                                    return (
                                        <tr key={payment.paymentId} className="hover:bg-orange-50/40 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                {payment.studentName}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                                {payment.className}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                                {payment.sessionId}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                ₦{payment.amount}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                                                {formatDateTime(payment.paymentDate)}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                <select
                                                    value={invoiceTypeByPayment[payment.paymentId] ?? 'term'}
                                                    onChange={(e) =>
                                                        handleInvoiceTypeChange(
                                                            payment.paymentId,
                                                            e.target.value as InvoiceTypeOption
                                                        )
                                                    }
                                                    disabled={generatingIds.has(payment.paymentId)}
                                                    className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white
                                                        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="term">Term Invoice</option>
                                                    <option value="session">Full Session Invoice</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                {generated ? (
                                                    <div>
                                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            {invoice?.invoiceNumber}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                                        Not generated
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                <InvoiceActionsCell
                                                    payment={payment}
                                                    generatedInvoice={invoice}
                                                    isGenerating={generatingIds.has(payment.paymentId)}
                                                    schoolInfo={getSchoolInfo()}
                                                    formatDate={formatDate}
                                                    onGenerate={handleGenerateInvoice}
                                                    onPreview={setPreviewPayment}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Record Payment Modal */}
            <Dialog
                open={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    <IconButton onClick={() => setIsPaymentModalOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <ManualFeeRecordForm
                        onSubmit={recordPayment}
                        students={students}
                        classrooms={classrooms}
                        paymentTerms={paymentTerms}
                        guardians={guardians}
                        isLoading={false}
                        schoolId={user?.schoolId || ''}
                        sessionId={sessions}
                    />
                </DialogContent>
            </Dialog>

            {/* Invoice Preview Dialog */}
            <Dialog
                open={Boolean(previewPayment)}
                onClose={() => setPreviewPayment(null)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ style: { height: '90vh' } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Invoice Preview - {previewInvoice?.invoiceNumber}</span>
                    <IconButton onClick={() => setPreviewPayment(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {previewPayment && previewInvoice && (
                        <Box sx={{ height: '100%' }}>
                            <PDFViewer style={{ width: '100%', height: '100%' }}>
                                <InvoicePDF
                                    invoiceData={{
                                        invoiceId: previewInvoice.invoiceId,
                                        schoolId: previewInvoice.schoolId,
                                        schoolName: previewInvoice.schoolName,
                                        sessionTermId: previewInvoice.sessionTermId,
                                        studentCount: previewInvoice.studentCount,
                                        amountPerStudent: previewInvoice.amountPerStudent,
                                        totalAmount: previewInvoice.totalAmount,
                                        invoiceDate: previewInvoice.invoiceDate,
                                        dueDate: previewInvoice.dueDate,
                                        isPaid: previewInvoice.isPaid,
                                        paidDate: previewInvoice.paidDate,
                                        paymentReference: previewInvoice.paymentReference,
                                        emailSent: previewInvoice.emailSent,
                                        emailSentDate: previewInvoice.emailSentDate as string,
                                        invoiceNumber: previewInvoice.invoiceNumber,
                                        paymentInstructions: previewInvoice.paymentInstructions,
                                        school: previewInvoice.school,
                                        sessionTerm: previewInvoice.sessionTerm,
                                    }}
                                    schoolInfo={getSchoolInfo()}
                                    studentInfo={{
                                        name: previewPayment.studentName,
                                        guardianName: 'N/A',
                                        classroom: previewPayment.className,
                                        studentId: previewPayment.studentId,
                                        registrationNumber: 'N/A',
                                    }}
                                    formatDate={formatDate}
                                />
                            </PDFViewer>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InvoiceRecordsPage;