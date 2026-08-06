import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BiMessageAlt } from "react-icons/bi";
import { FaRegBell, FaSearch, FaPlus, FaFileInvoiceDollar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAuth } from "../../../Context/Auth/useAuth";
import ManualFeeRecordForm, { PaymentTerm } from "./ManualFeeRecordForm";
import InvoiceActionsCell from "./InvoiceActionsCell";
import InvoicePreviewModal from "./InvoicePreviewModal";
import {
  GeneratedInvoiceData,
  InvoiceTypeOption,
  PaymentRecordType,
} from "../../../Types/Admin/InvoiceRecordType";
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
import {
  fetchSchoolFailure,
  fetchSchoolStart,
  fetchSchoolSuccess,
} from "../../../Store/Admin/schoolSlice";
import { studentService } from "../../../Services/Student/StudentService";
import { classroomService } from "../../../Services/Classroom";
import { guardianService } from "../../../Services/Guardian/guardian";
import { teacherService } from "../../../Services/Teachers/TeacherService";
import { sessionService } from "../../../Services/Session";
import { paymentService } from "../../../Services/Payment";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { Dialog, DialogContent, DialogTitle, IconButton, CircularProgress } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import InvoicePDF from "./InvoicePDF";
import { deriveInvoiceStatusFromPaid, formatCurrencyPlain } from "../../../utils/invoiceUtils";
import { schoolService } from "../../../Services/Admin/schoolService";

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

interface SummaryStats {
  totalPayments: number;
  totalStudents: number;
  totalInvoices: number;
  averagePayment: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const InvoiceRecordsPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [payments, setPayments] = useState<PaymentRecordType[]>([]);

  // Invoices are generated on demand and aren't part of the payments
  // payload, so we track them separately, keyed by paymentId.
  const [generatedInvoices, setGeneratedInvoices] = useState<Record<string, GeneratedInvoiceData>>(
    {},
  );
  const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
  const [invoiceTypeByPayment, setInvoiceTypeByPayment] = useState<
    Record<string, InvoiceTypeOption>
  >({});

  const [schoolData, setSchoolData] = useState<SchoolInfo | null>(null);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);

  // Record Payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Invoice preview
  const [previewPayment, setPreviewPayment] = useState<PaymentRecordType | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

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

  // Reset back to page 1 whenever the search query changes, so the user
  // isn't stranded on a page that no longer has any matching rows.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchSupportingData = async () => {
    dispatch(fetchStudentsStart());
    dispatch(fetchClassroomsStart());
    dispatch(fetchGuardiansStart());
    dispatch(fetchTeacherStart());
    dispatch(fetchSessionStart());
    dispatch(fetchSchoolStart());

    try {
      const schoolId = localStorage.getItem("schoolId");

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

  // Pulls from the real payments endpoint:
  // { status, responseCode, responseMessage, data: PaymentRecordType[] }
  const fetchPayments = async () => {
    const schoolId = user?.schoolId || localStorage.getItem("schoolId");
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
            next[payment.paymentId] = "term";
          }
        });
        return next;
      });
    } catch (error: any) {
      console.error("fetchPayments error:", error);
      toast.error(error?.response?.data?.responseMessage || "Failed to load payment records");
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const recordPayment = async (data: any) => {
    try {
      await paymentService.payStudentSchoolFeeManually(data);
      toast.success("Fee payment recorded successfully");
      setIsPaymentModalOpen(false);
      fetchPayments();
    } catch (error: any) {
      console.error("recordPayment error:", error);
      const message = error?.response?.data?.responseMessage || "Failed to record fee payment";
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
      const invoiceType = invoiceTypeByPayment[payment.paymentId] ?? "term";

      if (!schoolId || !payment.sessionId) {
        toast.error("School or session information is missing");
        return;
      }

      setGeneratingIds((prev) => new Set(prev).add(payment.paymentId));
      try {
        let response: any;
        if (invoiceType === "session") {
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

        // CRITICAL FIX: Use the actual payment amount, not the API response amount
        // The API might return a default amount (like 500) instead of the actual payment
        const actualAmount = payment.amount;

        const invoice: GeneratedInvoiceData = {
          invoiceId: raw.invoiceId,
          invoiceNumber: raw.invoiceNumber || `INV-${Date.now()}`,
          invoiceDate: raw.invoiceDate || new Date().toISOString(),
          dueDate: raw.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          // Use the actual payment amount, not what the API returns
          amountPerStudent: actualAmount,
          totalAmount: actualAmount,
          studentCount: 1,
          isPaid: raw.isPaid || false,
          paidDate: raw.paidDate || null,
          paymentReference: raw.paymentReference || null,
          emailSent: raw.emailSent || false,
          emailSentDate: raw.emailSentDate || null,
          paymentInstructions: raw.paymentInstructions || null,
          schoolId: raw.schoolId ?? schoolId,
          schoolName: schoolData?.schoolName ?? raw.schoolName ?? null,
          sessionTermId: raw.sessionTermId ?? payment.sessionId,
          school: raw.school ?? null,
          sessionTerm: raw.sessionTerm ?? null,
        };

        setGeneratedInvoices((prev) => ({
          ...prev,
          [payment.paymentId]: invoice,
        }));

        toast.success(`Invoice generated successfully for ₦${actualAmount.toLocaleString()}`);
      } catch (error: any) {
        console.error("handleGenerateInvoice error:", error);
        const errorMessage =
          error?.response?.data?.responseMessage || error?.message || "Failed to generate invoice";
        toast.error(errorMessage);
      } finally {
        setGeneratingIds((prev) => {
          const next = new Set(prev);
          next.delete(payment.paymentId);
          return next;
        });
      }
    },
    [user, invoiceTypeByPayment, schoolData],
  );

  const getSchoolInfo = useCallback(
    () => ({
      name: schoolData?.schoolName || user?.schoolName || "School Management System",
      address: schoolData?.address || "123 Education Street, City, State",
      phone: schoolData?.schoolPhone || "(123) 456-7890",
      email: schoolData?.schoolEmail || user?.email || "info@school.edu",
      registrationNumber: schoolData?.registrationNumber || "N/A",
      ownerName: schoolData?.ownerName || "N/A",
      city: schoolData?.city || "N/A",
      state: schoolData?.state || "N/A",
      typeOfSchool: schoolData?.typeOfSchool || "N/A",
    }),
    [schoolData, user],
  );

  const getStudentInfo = useCallback(
    (payment: PaymentRecordType) => {
      // Try to find the student in the Redux store for additional info
      const student = students.find((s) => s.studentId === payment.studentId);
      const guardian = student?.guardianId
        ? guardians.find((g) => g.guardianId === student.guardianId)
        : null;

      return {
        name: payment.studentName,
        // guardianName: guardian?.guardianName || "N/A",
        classroom: payment.className,
        studentId: payment.studentId,
        // registrationNumber: student?.registrationNumber || "N/A",
      };
    },
    [students, guardians],
  );

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatDateTime = useCallback((dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) return payments;
    const query = searchQuery.trim().toLowerCase();
    return payments.filter(
      (payment) =>
        payment.studentName?.toLowerCase().includes(query) ||
        payment.className?.toLowerCase().includes(query) ||
        payment.sessionId?.toLowerCase().includes(query),
    );
  }, [payments, searchQuery]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / rowsPerPage));

  // Clamp currentPage if the filtered set shrinks (e.g. after a search
  // or a payments refresh) so we never render an out-of-range page.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredPayments.slice(start, start + rowsPerPage);
  }, [filteredPayments, currentPage, rowsPerPage]);

  const rangeStart = filteredPayments.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(currentPage * rowsPerPage, filteredPayments.length);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Build a compact page-number list with ellipses for large page counts,
  // e.g. [1, '...', 4, 5, 6, '...', 12]
  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const summaryStats = useMemo<SummaryStats>(() => {
    const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalStudents = new Set(payments.map((p) => p.studentId)).size;
    const totalInvoices = Object.keys(generatedInvoices).length;
    const paidInvoices = Object.values(generatedInvoices).filter((inv) => inv.isPaid).length;
    const unpaidInvoices = totalInvoices - paidInvoices;

    return {
      totalPayments,
      totalStudents,
      totalInvoices,
      averagePayment: totalStudents > 0 ? totalPayments / totalStudents : 0,
      paidInvoices,
      unpaidInvoices,
    };
  }, [payments, generatedInvoices]);

  const previewInvoice = previewPayment ? generatedInvoices[previewPayment.paymentId] : undefined;

  // Get active session info
  const activeSessionInfo = useMemo(() => {
    if (!sessions || sessions.length === 0) return null;

    const activeSession = sessions.find((s: any) => s.isActive);
    if (!activeSession) return null;

    const activeTerm = activeSession.sessionTerms?.find((t: any) => t.isActive);

    return {
      sessionId: activeSession.sessionId,
      term: activeTerm?.term || "Current Term",
      sessionTermId: activeTerm?.sessionTermId || activeSession.sessionKey,
    };
  }, [sessions]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:py-6 md:py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl p-4 mb-4">
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
          <div className="flex items-center rounded-full px-3 py-1 space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`}
              className="w-14 h-14 rounded-full"
              alt="Admin"
            />
            <div className="text-xs">
              <div className="font-semibold text-gray-700">
                {schoolData?.schoolName || user?.schoolName}
              </div>
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
                paginatedPayments.map((payment) => {
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
                        {formatCurrencyPlain(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateTime(payment.paymentDate)}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <select
                          value={invoiceTypeByPayment[payment.paymentId] ?? "term"}
                          onChange={(e) =>
                            handleInvoiceTypeChange(
                              payment.paymentId,
                              e.target.value as InvoiceTypeOption,
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

        {/* Pagination Bar */}
        {!isLoadingPayments && filteredPayments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                Showing <span className="font-medium text-gray-700">{rangeStart}</span>–
                <span className="font-medium text-gray-700">{rangeEnd}</span> of{" "}
                <span className="font-medium text-gray-700">{filteredPayments.length}</span>
              </span>
              <span className="hidden sm:inline text-gray-300">|</span>
              <label className="hidden sm:flex items-center gap-1.5">
                Rows per page:
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-1.5 py-1 text-sm bg-white
                             focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                >
                  {ROWS_PER_PAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="p-2 rounded-md text-gray-500 hover:bg-orange-50 hover:text-orange-500
                           disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              {pageNumbers.map((page, idx) =>
                page === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-sm text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="p-2 rounded-md text-gray-500 hover:bg-orange-50 hover:text-orange-500
                           disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-colors"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <Dialog
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}>
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
            schoolId={user?.schoolId || ""}
            sessionId={sessions}
          />
        </DialogContent>
      </Dialog>

      {/* Invoice Preview */}
      {previewPayment && previewInvoice && (
        <InvoicePreviewModal
          open={Boolean(previewPayment)}
          onClose={() => setPreviewPayment(null)}
          invoiceNumber={previewInvoice.invoiceNumber}
          status={deriveInvoiceStatusFromPaid(previewInvoice.isPaid, previewInvoice.dueDate)}
          document={
            <InvoicePDF
              invoiceData={previewInvoice}
              schoolInfo={getSchoolInfo()}
              studentInfo={getStudentInfo(previewPayment)}
              formatDate={formatDate}
            />
          }
          fileName={`${previewInvoice.invoiceNumber}.pdf`}
        />
      )}
    </div>
  );
};

export default InvoiceRecordsPage;