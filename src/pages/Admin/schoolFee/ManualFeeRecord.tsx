// src/Pages/Admin/Payments/ManualFeeRecord.tsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaDownload, FaPrint, FaPlus, FaFileInvoiceDollar } from "react-icons/fa";
import { useAuth } from "../../../Context/Auth/useAuth";
import ManualFeeRecordForm, { PaymentTerm } from "./ManualFeeRecordForm";
import { AppDispatch, RootState } from "../../../Store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentsFailure,
  fetchStudentsStart,
  fetchStudentsSuccess,
} from "../../../Store/Student/studentSlice";
import {
  fetchClassroomsFailure,
  fetchClassroomsStart,
  fetchClassroomsSuccess,
} from "../../../Store/Admin/classroomSlice";
import {
  fetchGuardiansFailure,
  fetchGuardiansStart,
  fetchGuardiansSuccess,
} from "../../../Store/Guardian/guardianSlice";
import {
  fetchTeacherFailure,
  fetchTeacherStart,
  fetchTeacherSuccess,
} from "../../../Store/Teachers/teacherSlice";
import {
  fetchSessionFailure,
  fetchSessionStart,
  fetchSessionSuccess,
} from "../../../Store/sessionSlice";
import { studentService } from "../../../Services/Student/StudentService";
import { classroomService } from "../../../Services/Classroom";
import { guardianService } from "../../../Services/Guardian/guardian";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { sessionService } from "../../../Services/Session";
import { paymentService } from "../../../Services/Payment";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { StudentType } from "../../../Types/Student/studentTypes";
import { schoolService } from "../../../Services/Admin/schoolService";
import {
  fetchSchoolFailure,
  fetchSchoolStart,
  fetchSchoolSuccess,
} from "../../../Store/Admin/schoolSlice";

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

type InvoiceType = "term" | "session";

const ManualFeeRecord = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [selectedStudentForInvoice, setSelectedStudentForInvoice] =
    useState<StudentType | null>(null);
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("term");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolInfo | null>(null);

  // Record Payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const students = useSelector((state: RootState) => state.getStudent.listRecords);
  const classrooms = useSelector((state: RootState) => state.getClassrooms.listRecords);
  const guardians = useSelector((state: RootState) => state.getGuardian.listRecords);
  const sessions = useSelector((state: RootState) => state.getSession.listRecords);

  useEffect(() => {
    if (user) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  const fetchData = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchClassroomsStart());
    dispatch(fetchGuardiansStart());
    dispatch(fetchTeacherStart());
    dispatch(fetchSessionStart());
    dispatch(fetchSchoolStart());

    try {
      const schoolId = localStorage.getItem("schoolId");

      const [data, classRoom, guardian, teachers, session, schoolResponse] =
        await Promise.all([
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
        setPaymentTerms([{ paymentTermId: user.termId, name: "Current Term" }]);
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
    setIsSubmittingPayment(true);
    try {
      await paymentService.payStudentSchoolFeeManually(data);
      toast.success("Fee payment recorded successfully");
      setIsPaymentModalOpen(false);
    } catch (error: any) {
      console.error("recordPayment error:", error);
      const message =
        error?.response?.data?.responseMessage || "Failed to record fee payment";
      toast.error(message);
      throw message;
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const generatePaymentInvoice = async () => {
    const schoolId = user?.schoolId;
    const sessionTermId = user?.termId;

    if (!schoolId || !sessionTermId) {
      toast.error("School or session information is missing");
      return;
    }

    setIsGeneratingInvoice(true);
    try {
      let response: any;
      if (invoiceType === "session") {
        response = await paymentService.generateSessionInvoice({
          schoolId,
          sessionTermId,
        });
      } else {
        response = await paymentService.generateInvoice({ schoolId, sessionTermId });
      }

      const baseInvoice: InvoiceData = response.data;
      const enhancedInvoice: InvoiceData = {
        ...baseInvoice,
        schoolName:
          schoolData?.schoolName || baseInvoice.schoolName || user?.schoolName || null,
      };

      const finalInvoice: InvoiceData = selectedStudentForInvoice
        ? {
            ...enhancedInvoice,
            studentCount: 1,
            totalAmount: enhancedInvoice.amountPerStudent,
          }
        : enhancedInvoice;

      setInvoiceData(finalInvoice);
      toast.success("Invoice generated successfully");
      setShowInvoicePreview(true);
    } catch (error: any) {
      console.error("generatePaymentInvoice error:", error);
      toast.error(
        error?.response?.data?.responseMessage || "Failed to generate invoice",
      );
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const getSchoolInfo = () => ({
    name: schoolData?.schoolName || user?.schoolName || "School Management System",
    address: schoolData?.address || "123 Education Street, City, State",
    phone: schoolData?.schoolPhone || "(123) 456-7890",
    email: schoolData?.schoolEmail || user?.email || "info@school.edu",
    registrationNumber: schoolData?.registrationNumber || "N/A",
    ownerName: schoolData?.ownerName || "N/A",
    city: schoolData?.city || "N/A",
    state: schoolData?.state || "N/A",
    typeOfSchool: schoolData?.typeOfSchool || "N/A",
  });

  const getStudentInfo = () => {
    if (!selectedStudentForInvoice) {
      return {
        name: "Multiple Students",
        guardianName: "N/A",
        classroom: "Various Classes",
        studentId: "N/A",
        registrationNumber: "N/A",
      };
    }
    return {
      name: `${selectedStudentForInvoice.firstname} ${selectedStudentForInvoice.lastname}`,
      guardianName: selectedStudentForInvoice.guardianName || "Parent/Guardian Name",
      classroom: selectedStudentForInvoice.classroomName || "Class Name",
      studentId: selectedStudentForInvoice.studentId || "N/A",
    };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filter students for the invoice filter dropdown
  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const haystack = `${s.firstname} ${s.lastname} ${s.classroomName}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [students, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-full mx-auto space-y-6">
        {/* Page Header + Record Payment button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaFileInvoiceDollar className="text-orange-500 text-2xl" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                School Fee Payments
              </h1>
              <p className="text-sm text-gray-600">
                Home <span className="text-orange-500 font-semibold">: School Fees</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-orange-600 transition-colors"
          >
            <FaPlus />
            Record Payment
          </button>
        </div>

        {/* School info summary */}
        {schoolData && (
          <div className="bg-white shadow-md rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              School Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium">School:</span> {schoolData.schoolName}
              </div>
              <div>
                <span className="font-medium">Reg. Number:</span>{" "}
                {schoolData.registrationNumber}
              </div>
              <div>
                <span className="font-medium">Address:</span> {schoolData.address}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {schoolData.schoolPhone}
              </div>
              <div>
                <span className="font-medium">Email:</span> {schoolData.schoolEmail}
              </div>
              <div>
                <span className="font-medium">Type:</span> {schoolData.typeOfSchool}
              </div>
            </div>
          </div>
        )}

        {/* Invoice generation card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Generate Invoice
          </h3>

          {/* Invoice Type */}
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
                  checked={invoiceType === "term"}
                  onChange={() => setInvoiceType("term")}
                  className="accent-orange-500"
                />
                Term Invoice
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="invoiceType"
                  value="session"
                  checked={invoiceType === "session"}
                  onChange={() => setInvoiceType("session")}
                  className="accent-orange-500"
                />
                Full Session Invoice
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {invoiceType === "term"
                ? "Generate invoice for the current term only"
                : "Generate invoice covering the entire academic session"}
            </p>
          </div>

          {/* Student filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student for Invoice (Optional)
            </label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-2">
              <FaSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search student by name or class"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-sm"
              />
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
              onChange={(e) => {
                const studentId = e.target.value;
                const student = students.find((s) => s.studentId === studentId) ?? null;
                setSelectedStudentForInvoice(student);
              }}
              value={selectedStudentForInvoice?.studentId || ""}
            >
              <option value="">-- All Students (Generate for entire school) --</option>
              {filteredStudents.map((student) => (
                <option key={student.studentId} value={student.studentId}>
                  {student.firstname} {student.lastname} - {student.classroomName}
                </option>
              ))}
            </select>
            {selectedStudentForInvoice && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Invoice will be generated for {selectedStudentForInvoice.firstname}{" "}
                {selectedStudentForInvoice.lastname} only
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors text-sm"
              onClick={generatePaymentInvoice}
              disabled={isGeneratingInvoice}
            >
              {isGeneratingInvoice ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  Generating...
                </>
              ) : (
                "Generate Invoice"
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
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors text-sm"
                      disabled={loading}
                    >
                      <FaDownload />
                      {loading ? "Preparing PDF..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
                  onClick={() => setShowInvoicePreview(true)}
                >
                  <FaPrint />
                  Preview Invoice
                </button>
              </>
            )}
          </div>

          {/* Invoice summary */}
          {invoiceData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">
                Generated Invoice Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Invoice Number:</span>
                  <p className="font-medium text-gray-800">
                    {invoiceData.invoiceNumber}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Amount per Student:</span>
                  <p className="font-medium text-gray-800">
                    ₦{invoiceData.amountPerStudent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total Amount:</span>
                  <p className="font-medium text-gray-800">
                    ₦{invoiceData.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Student Count:</span>
                  <p className="font-medium text-gray-800">
                    {invoiceData.studentCount}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Due Date:</span>
                  <p className="font-medium text-gray-800">
                    {formatDate(invoiceData.dueDate)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p
                    className={`font-medium ${
                      invoiceData.isPaid ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {invoiceData.isPaid ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Payment Modal */}
      <Dialog
        open={isPaymentModalOpen}
        onClose={() => !isSubmittingPayment && setIsPaymentModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span className="text-lg font-semibold text-slate-900">Record School Fee Payment</span>
          <IconButton
            onClick={() => setIsPaymentModalOpen(false)}
            disabled={isSubmittingPayment}
          >
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
            isLoading={isSubmittingPayment}
            schoolId={user?.schoolId || ""}
            sessionId={sessions}
          />
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Dialog */}
      <Dialog
        open={showInvoicePreview}
        onClose={() => setShowInvoicePreview(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ style: { height: "90vh" } }}
      >
        <DialogTitle
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>Invoice Preview - {invoiceData?.invoiceNumber}</span>
          <IconButton onClick={() => setShowInvoicePreview(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {invoiceData && (
            <Box sx={{ height: "100%" }}>
              <PDFViewer style={{ width: "100%", height: "100%" }}>
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