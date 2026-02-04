import React, { useEffect, useState } from 'react'
import { BiMessageAlt } from 'react-icons/bi'
import { FaRegBell, FaSearch, FaDownload, FaPrint } from 'react-icons/fa'
import { useAuth } from '../../../Context/Auth/useAuth';
import ManualFeeRecordForm from './ManualFeeRecordForm';
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
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

// Add interface for the invoice data
interface InvoiceData {
    invoiceId: string;
    schoolId: string;
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
    school: any | null;
    sessionTerm: any | null;
}

const ManualFeeRecord = () => {
    const { user } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const [searchQuery, setSearchQuery] = useState("");
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
    const [selectedStudentForInvoice, setSelectedStudentForInvoice] = useState<any>(null);

    const students = useSelector((state: RootState) => state.getStudent.listRecords);
    const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
    const guardians = useSelector((state: RootState) => state.getGuardian.listRecords);
    const sessions = useSelector((state: RootState) => state.getSession.listRecords);

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
        try {
            const data = await studentService.getAll(localStorage.getItem('schoolId'));
            const classRoom = await classroomService.getAllClassrooms(localStorage.getItem('schoolId'));
            const guardian = await guardianService.getAll(localStorage.getItem('schoolId'));
            const teachers = await teacherService.getAll(localStorage.getItem('schoolId'));
            const session = await sessionService.getAllRegisteredSessions(localStorage.getItem('schoolId'));
            dispatch(fetchStudentsSuccess(data));
            dispatch(fetchClassroomsSuccess(classRoom));
            dispatch(fetchGuardiansSuccess(guardian));
            dispatch(fetchTeacherSuccess(teachers));
            dispatch(fetchSessionSuccess(session));
        } catch (err) {
            dispatch(fetchStudentsFailure((err as Error).message));
            dispatch(fetchClassroomsFailure((err as Error).message));
            dispatch(fetchGuardiansFailure((err as Error).message));
            dispatch(fetchTeacherFailure((err as Error).message));
            dispatch(fetchSessionFailure((err as Error).message));
        }
    };

    const recordPayment = async (data: any) => {
        try {
            await paymentService.payStudentSchoolFeeManually(data);
            toast.success('Fee payment recorded successfully');
        } catch (error: any) {
            console.log("AddStudentSchoolFee error:", error);
            toast.error(error?.response?.data?.responseMessage || "Failed to add school fee");
            throw (error?.response?.data?.responseMessage || "Failed to add school fee");
        }
    }

    const generatePaymentInvoice = async () => {
        const data = {
            schoolId: user?.schoolId,
            sessionTermId: user?.termId
        }

        setIsGeneratingInvoice(true);
        try {
            const response = await paymentService.generateInvoince(data);
            setInvoiceData(response.data);

            // If there's a selected student, use that for the invoice
            if (selectedStudentForInvoice) {
                setInvoiceData(prev => ({
                    ...prev,
                    ...response.data,
                    studentCount: 1, // For single student invoice
                    totalAmount: response.data.amountPerStudent
                }));
            }

            toast.success('Invoice generated successfully');
            setShowInvoicePreview(true);
        } catch (error: any) {
            console.log("Generate invoice error:", error);
            toast.error(error?.response?.data?.responseMessage || "Failed to generate invoice");
        } finally {
            setIsGeneratingInvoice(false);
        }
    }

    const handleStudentSelectForInvoice = (student: any) => {
        setSelectedStudentForInvoice(student);
    }

    const getSchoolInfo = () => {
        return {
            name: user?.schoolName || 'School Management System',
            address: user?.schoolAddress || '123 Education Street, City, State',
            phone: user?.phone || '(123) 456-7890',
            email: user?.email || 'info@school.edu',
        };
    }

    const getStudentInfo = () => {
        if (!selectedStudentForInvoice && invoiceData) {
            // Return default info if no specific student selected
            return {
                name: 'Multiple Students',
                guardianName: 'N/A',
                classroom: 'Various Classes',
            };
        }

        return {
            name: selectedStudentForInvoice
                ? `${selectedStudentForInvoice.firstname} ${selectedStudentForInvoice.lastname}`
                : 'Student Name',
            guardianName: selectedStudentForInvoice?.guardianName || 'Parent/Guardian Name',
            classroom: selectedStudentForInvoice?.classroomName || 'Class Name',
        };
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
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
                            <div className="font-semibold text-gray-700">{user?.schoolName}</div>
                            <div className="text-gray-400">{user?.email}</div>
                        </div>
                    </div>
                </div>
            </div>

            <ManualFeeRecordForm
                onSubmit={recordPayment}
                students={students}
                classrooms={classrooms}
                paymentTerms={user?.termId || ''}
                guardians={guardians}
                isLoading={false}
                schoolId={user?.schoolId || ''}
                sessionId={sessions}
            />

            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Generate Invoice</h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Student for Invoice (Optional)
                    </label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => {
                            const studentId = e.target.value;
                            const student = students.find(s => s.studentId === studentId);
                            handleStudentSelectForInvoice(student);
                        }}
                    >
                        <option value="">-- Select Student (Optional) --</option>
                        {students.map((student) => (
                            <option key={student.studentId} value={student.studentId}>
                                {student.firstname} {student.lastname} - {student.classroomName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap gap-4">
                    <button
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50"
                        onClick={generatePaymentInvoice}
                        disabled={isGeneratingInvoice}
                    >
                        {isGeneratingInvoice ? (
                            <>
                                <CircularProgress size={20} color="inherit" />
                                Generating...
                            </>
                        ) : (
                            <>
                                Generate Invoice
                            </>
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
                                    />
                                }
                                fileName={`invoice-${invoiceData.invoiceNumber}.pdf`}
                                className="no-underline"
                            >
                                {({ loading }) => (
                                    <button
                                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50"
                                        disabled={loading}
                                    >
                                        <FaDownload />
                                        {loading ? 'Preparing PDF...' : 'Download PDF'}
                                    </button>
                                )}
                            </PDFDownloadLink>

                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center gap-2"
                                onClick={() => setShowInvoicePreview(true)}
                            >
                                <FaPrint />
                                Preview Invoice
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Invoice Preview Dialog */}
            <Dialog
                open={showInvoicePreview}
                onClose={() => setShowInvoicePreview(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    style: { height: '90vh' }
                }}
            >
                <DialogTitle className="flex justify-between items-center">
                    <span>Invoice Preview</span>
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
                                />
                            </PDFViewer>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ManualFeeRecord;