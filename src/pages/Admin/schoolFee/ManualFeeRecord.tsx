import React, { useEffect, useState } from 'react'
import { BiMessageAlt } from 'react-icons/bi'
import { FaRegBell, FaSearch, FaDownload, FaPrint } from 'react-icons/fa'
import { useAuth } from '../../../Context/Auth/useAuth';
import ManualFeeRecordForm, { PaymentTerm } from './ManualFeeRecordForm';
import { AppDispatch, RootState } from '../../../Store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentsFailure, fetchStudentsStart, fetchStudentsSuccess } from '../../../Store/Student/studentSlice';
import { fetchClassroomsFailure, fetchClassroomsStart, fetchClassroomsSuccess } from '../../../Store/Admin/classroomSlice';
import { fetchGuardiansFailure, fetchGuardiansStart, fetchGuardiansSuccess } from '../../../Store/Guardian/guardianSlice';
import { fetchTeacherFailure, fetchTeacherStart, fetchTeacherSuccess } from '../../../Store/Teachers/teacherSlice';
import { fetchSessionFailure, fetchSessionStart, fetchSessionSuccess } from '../../../Store/sessionSlice';
import { studentService } from '../../../Services/Student/StudentService';
import { classroomService } from '../../../Services/Classroom';
import { guardianService } from '../../../Services/Guardian/guardian';
import { teacherService } from '../../../Services/Teachers/TeacherService';
import { sessionService } from '../../../Services/Session';
import { paymentService } from '../../../Services/Payment';
import { toast } from 'react-toastify';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Box,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { StudentType } from '../../../Types/Student/studentTypes';
import { schoolService } from '../../../Services/Admin/schoolService';
import { fetchSchoolFailure, fetchSchoolStart, fetchSchoolSuccess } from '../../../Store/Admin/schoolSlice';

interface InvoiceData {
    invoiceId: string;
    schoolId: string;
    schoolName: string | null;
    sessionTermId: string;
    studentCount: number;
    amountPerStudent: number;
    totalAmount: number;
    invoiceDate: string;
    dueDate: string;
    isPaid: boolean;
    paidDate: string | null;
    paymentReference: string | null;
    emailSent: boolean;
    emailSentDate: string;
    invoiceNumber: string;
    paymentInstructions: string | null;
    school: any | null;
    sessionTerm: any | null;
}

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

// Invoice type determines which API endpoint to call:
type InvoiceType = 'term' | 'session';

const ManualFeeRecord = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState('');
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [selectedStudentForInvoice, setSelectedStudentForInvoice] = useState<StudentType | null>(null);
    const [invoiceType, setInvoiceType] = useState<InvoiceType>('term');
    const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
    const [schoolData, setSchoolData] = useState<SchoolInfo | null>(null);

    const students = useSelector((state: RootState) => state.getStudent.listRecords);
    const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
    const guardians = useSelector((state: RootState) => state.getGuardian.listRecords);
    const sessions = useSelector((state: RootState) => state.getSession.listRecords);
    const school = useSelector((state: RootState) => state.getSchool.listRecords);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [dispatch, user]);

    const fetchData = async () => {
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
                schoolService.getSchoolById(schoolId)
            ]);

            dispatch(fetchStudentsSuccess(data));
            dispatch(fetchClassroomsSuccess(classRoom));
            dispatch(fetchGuardiansSuccess(guardian));
            dispatch(fetchTeacherSuccess(teachers));
            dispatch(fetchSessionSuccess(session));
            dispatch(fetchSchoolSuccess(schoolResponse));

            // Store school data separately for invoice use
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
                    cac: schoolResponse.cac
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

    const recordPayment = async (data: any) => {
        try {
            await paymentService.payStudentSchoolFeeManually(data);
            toast.success('Fee payment recorded successfully');
        } catch (error: any) {
            console.error('recordPayment error:', error);
            const message = error?.response?.data?.responseMessage || 'Failed to record fee payment';
            toast.error(message);
            throw message;
        }
    };

    const generatePaymentInvoice = async () => {
        const schoolId = user?.schoolId;
        const sessionTermId = user?.termId;

        if (!schoolId || !sessionTermId) {
            toast.error('School or session information is missing');
            return;
        }

        setIsGeneratingInvoice(true);
        try {
            let response: any;

            if (invoiceType === 'session') {
                response = await paymentService.generateSessionInvoice({ schoolId, sessionTermId });
            } else {
                response = await paymentService.generateInvoice({ schoolId, sessionTermId });
            }

            const baseInvoice: InvoiceData = response.data;

            // Enhance the invoice data with school information from our stored schoolData
            const enhancedInvoice: InvoiceData = {
                ...baseInvoice,
                schoolName: schoolData?.schoolName || baseInvoice.schoolName || user?.schoolName || null,
            };

            // If a specific student is selected, scope the totals to that student
            const finalInvoice: InvoiceData = selectedStudentForInvoice
                ? {
                    ...enhancedInvoice,
                    studentCount: 1,
                    totalAmount: enhancedInvoice.amountPerStudent,
                }
                : enhancedInvoice;

            setInvoiceData(finalInvoice);
            toast.success('Invoice generated successfully');
            setShowInvoicePreview(true);
        } catch (error: any) {
            console.error('generatePaymentInvoice error:', error);
            toast.error(error?.response?.data?.responseMessage || 'Failed to generate invoice');
        } finally {
            setIsGeneratingInvoice(false);
        }
    };

    // Enhanced school info with complete data from the API
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

    const getStudentInfo = () => {
        if (!selectedStudentForInvoice) {
            return {
                name: 'Multiple Students',
                guardianName: 'N/A',
                classroom: 'Various Classes',
                studentId: 'N/A',
                registrationNumber: 'N/A',
            };
        }
        return {
            name: `${selectedStudentForInvoice.firstname} ${selectedStudentForInvoice.lastname}`,
            guardianName: selectedStudentForInvoice.guardianName || 'Parent/Guardian Name',
            classroom: selectedStudentForInvoice.classroomName || 'Class Name',
            studentId: selectedStudentForInvoice.studentId || 'N/A',
            // registrationNumber: selectedStudentForInvoice.registrationNumber || 'N/A',
        };
    };

    // Format date for better display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-1 mb-4">
                <div className="w-full sm:w-auto mb-4 sm:mb-0">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full sm:w-80">
                        <FaSearch className="text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="ml-2 bg-transparent outline-none w-full text-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <FaRegBell className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
                    <BiMessageAlt className="text-gray-500 text-2xl hover:text-orange-500 cursor-pointer" />
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

            {/* Invoice Section */}
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Generate Invoice</h3>

                {/* Display School Info Summary */}
                {schoolData && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">School Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                            <div><span className="font-medium">School:</span> {schoolData.schoolName}</div>
                            <div><span className="font-medium">Reg. Number:</span> {schoolData.registrationNumber}</div>
                            <div><span className="font-medium">Address:</span> {schoolData.address}</div>
                            <div><span className="font-medium">Phone:</span> {schoolData.schoolPhone}</div>
                            <div><span className="font-medium">Email:</span> {schoolData.schoolEmail}</div>
                            <div><span className="font-medium">Type:</span> {schoolData.typeOfSchool}</div>
                        </div>
                    </div>
                )}

                {/* Invoice Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Type
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="radio"
                                name="invoiceType"
                                value="term"
                                checked={invoiceType === 'term'}
                                onChange={() => setInvoiceType('term')}
                                className="accent-orange-500"
                            />
                            Term Invoice
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="radio"
                                name="invoiceType"
                                value="session"
                                checked={invoiceType === 'session'}
                                onChange={() => setInvoiceType('session')}
                                className="accent-orange-500"
                            />
                            Full Session Invoice
                        </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {invoiceType === 'term' 
                            ? 'Generate invoice for the current term only' 
                            : 'Generate invoice covering the entire academic session'}
                    </p>
                </div>

                {/* Optional Student Filter */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Student for Invoice (Optional)
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        onChange={(e) => {
                            const studentId = e.target.value;
                            const student = students.find(s => s.studentId === studentId) ?? null;
                            setSelectedStudentForInvoice(student);
                        }}
                        value={selectedStudentForInvoice?.studentId || ''}
                    >
                        <option value="">-- All Students (Generate for entire school) --</option>
                        {students.map((student) => (
                            <option key={student.studentId} value={student.studentId}>
                                {student.firstname} {student.lastname} - {student.classroomName}
                            </option>
                        ))}
                    </select>
                    {selectedStudentForInvoice && (
                        <p className="text-xs text-green-600 mt-1">
                            ✅ Invoice will be generated for {selectedStudentForInvoice.firstname} {selectedStudentForInvoice.lastname} only
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                        onClick={generatePaymentInvoice}
                        disabled={isGeneratingInvoice}
                    >
                        {isGeneratingInvoice ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                Generating...
                            </>
                        ) : (
                            'Generate Invoice'
                        )}
                    </button>

                    {invoiceData && (
                        <>
                            <PDFDownloadLink
                                document={
                                    <InvoicePDF
                                        invoiceData={invoiceData}
                                        schoolInfo={getSchoolInfo()}
                                        studentInfo={getStudentInfo()}
                                        formatDate={formatDate}
                                    />
                                }
                                fileName={`${invoiceData.invoiceNumber}.pdf`}
                                className="no-underline"
                            >
                                {({ loading }) => (
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50 transition-colors"
                                        disabled={loading}
                                    >
                                        <FaDownload />
                                        {loading ? 'Preparing PDF...' : 'Download PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2 transition-colors"
                                onClick={() => setShowInvoicePreview(true)}
                            >
                                <FaPrint />
                                Preview Invoice
                            </button>
                        </>
                    )}
                </div>

                {/* Invoice Summary (when generated) */}
                {invoiceData && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">Generated Invoice Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <span className="text-gray-500">Invoice Number:</span>
                                <p className="font-medium text-gray-800">{invoiceData.invoiceNumber}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Amount per Student:</span>
                                <p className="font-medium text-gray-800">₦{invoiceData.amountPerStudent.toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Total Amount:</span>
                                <p className="font-medium text-gray-800">₦{invoiceData.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Student Count:</span>
                                <p className="font-medium text-gray-800">{invoiceData.studentCount}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Due Date:</span>
                                <p className="font-medium text-gray-800">{formatDate(invoiceData.dueDate)}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <p className={`font-medium ${invoiceData.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {invoiceData.isPaid ? 'Paid' : 'Pending'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Invoice Preview Dialog */}
            <Dialog
                open={showInvoicePreview}
                onClose={() => setShowInvoicePreview(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{ style: { height: '90vh' } }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Invoice Preview - {invoiceData?.invoiceNumber}</span>
                    <IconButton onClick={() => setShowInvoicePreview(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {invoiceData && (
                        <Box sx={{ height: '100%' }}>
                            <PDFViewer style={{ width: '100%', height: '100%' }}>
                                <InvoicePDF
                                    invoiceData={invoiceData}
                                    schoolInfo={getSchoolInfo()}
                                    studentInfo={getStudentInfo()}
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

export default ManualFeeRecord;