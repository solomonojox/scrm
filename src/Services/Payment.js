import api from "./api";

export const paymentService = {
  /**
   * Adds a new school fee
   * @param {Object} feeData - The school fee object (amount, term, schoolId, etc.)
   * @returns {Promise<Object>}
   */
  addStudentSchoolFee: async (feeData) => {
    try {
      const response = await api.post(`/api/Payment/AddStudentSchoolFee`, feeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all school fees
   * @returns {Promise<Array>} - List of school fees
   */
  getPaymentsBySchoolId: async (schoolId) => {
    try {
      const response = await api.get(`/api/Payment/GetPaymentsBySchoolId?schoolId=${schoolId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentPayment: async (studentId) => {
    try {
      const response = await api.get(`/api/Payment/GetStudentPayment/${studentId}`);
      return response.data.data; // ✅ get the array inside `data`
    } catch (error) {
      throw error;
    }
  },

  getStudentPaymentForSession: async (studentId, sessionId) => {
    try {
      const response = await api.get(
        `/api/Payment/GetStudentPaymentForSession?studentId=${studentId}&sessionId=${sessionId}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getClassFeeForSession: async (classId, sessionId) => {
    try {
      const response = await api.get(
        `/api/SchoolFee/GetClassFeeForSession?classId=${classId}&sessionId=${sessionId}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentPaymentBalanceForSessiozn: async (studentId, sessionId) => {
    try {
      const response = await api.get(
        `/api/Payment/GetStudentPaymentBalance?studentId=${studentId}&sessionId=${sessionId}`,
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getStudentTermFee: async (classId, sessionId, termId) => {
    try {
      const response = await api.get(
        `/api/SchoolFee/GetClassFeeForTerm?classId=${classId}&sessionId=${sessionId}&termId=${termId}`,
      );
      return response.data.data;
    } catch (error) {
      console.log("GetStudentTermFee error:", error);
      throw error;
    }
  },

  payStudentSchoolFee: async (data) => {
    try {
      const response = await api.post(`/api/Payment/StudentSchoolFeePayment`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/Payment/InitiateSchoolFeeGatewayPaymentAdvance
  initiateSchoolFeeGatewayPaymentAdvance: async (data) => {
    try {
      const response = await api.post("/api/Payment/InitiateSchoolFeeGatewayPaymentAdvance", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/Payment/StudentSchoolFeePayment
  // Processes student school fee payment from guardian's account
  studentSchoolFeePayment: async (data) => {
    try {
      const response = await api.post("/api/Payment/StudentSchoolFeePayment", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/Payment/ManualStudentSchoolFeePayment
  // Records a manual payment without processing through payment gateway (Admin only)
  // Body: { studentId, schoolId, classroomId, sessionId, amount, paymentTermId, guardianId }
  payStudentSchoolFeeManually: async (data) => {
    try {
      const response = await api.post("/api/Payment/ManualStudentSchoolFeePayment", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/Payment/AddStudentSchoolFee
  // Creates a new class fee for a specific session (Admin only)
  addStudentSchoolFee: async (data) => {
    try {
      const response = await api.post("/api/Payment/AddStudentSchoolFee", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPayment/{studentId}
  // Retrieves all payments made by a specific student
  getStudentPayment: async (studentId) => {
    try {
      const response = await api.get(`/api/Payment/GetStudentPayment/${studentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPaymentBalance
  getStudentPaymentBalance: async (studentId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentPaymentBalance", {
        params: { studentId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPaymentBalanceByTermId
  getStudentPaymentBalanceByTermId: async (studentId, termId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentPaymentBalanceByTermId", {
        params: { studentId, termId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPaymentBalanceByTerm
  // Retrieves student payment balance for a specific term by term name
  getStudentPaymentBalanceByTerm: async (studentId, termName) => {
    try {
      const response = await api.get("/api/Payment/GetStudentPaymentBalanceByTerm", {
        params: { studentId, termName },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentTotalFeePayment
  // Retrieves total fee paid by student for a specific session
  getStudentTotalFeePayment: async (studentId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentTotalFeePayment", {
        params: { studentId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPaymentForSession
  // Retrieves all payments made by a student for a specific session
  getStudentPaymentForSession: async (studentId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentPaymentForSession", {
        params: { studentId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetClassFeeBySession
  // Retrieves class fee amount for a specific session
  getClassFeeBySession: async (classroomId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetClassFeeBySession", {
        params: { classroomId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetTotalClassPaymentBySession
  // Retrieves total payments collected for a class in a specific session (Admin only)
  getTotalClassPaymentBySession: async (classroomId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetTotalClassPaymentBySession", {
        params: { classroomId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetClassAllFeePerSesson  (note: typo in API — 'Sesson' not 'Session')
  // Retrieves all class fees across all sessions (Admin only)
  getClassAllFeePerSession: async (classroomId) => {
    try {
      const response = await api.get("/api/Payment/GetClassAllFeePerSesson", {
        params: { classroomId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentPaymentForTerm
  // Retrieves all payments made by a student for a specific term
  getStudentPaymentForTerm: async (studentId, termId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentPaymentForTerm", {
        params: { studentId, termId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetStudentTotalFeePaymentForTerm
  // Retrieves total fee paid by student for a specific term
  getStudentTotalFeePaymentForTerm: async (studentId, termId) => {
    try {
      const response = await api.get("/api/Payment/GetStudentTotalFeePaymentForTerm", {
        params: { studentId, termId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetPaymentsBySchoolAndSession
  // Retrieves all payments for a school filtered by session (Admin only)
  getPaymentsBySchoolAndSession: async (schoolId, sessionId) => {
    try {
      const response = await api.get("/api/Payment/GetPaymentsBySchoolAndSession", {
        params: { schoolId, sessionId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetPaymentsBySchoolId
  // Retrieves all payments for a specific school across all sessions (Admin only)
  getPaymentsBySchoolId: async (schoolId) => {
    try {
      const response = await api.get("/api/Payment/GetPaymentsBySchoolId", {
        params: { schoolId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/Payment/GetPaymentsByActiveSession
  // Gets all payments for a school filtered by the active session.
  // This endpoint automatically uses the school's active session.
  getPaymentsByActiveSession: async (schoolId) => {
    try {
      const response = await api.get("/api/Payment/GetPaymentsByActiveSession", {
        params: { schoolId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ── SchoolInvoice Endpoints ─────────────────────────────────────────────────

  // GET /api/SchoolInvoice/school/{schoolId}
  // Retrieves all invoices for a specific school (Admin only)
  getInvoicesBySchool: async (schoolId) => {
    try {
      const response = await api.get(`/api/SchoolInvoice/school/${schoolId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/SchoolInvoice/{invoiceId}
  // Retrieves a specific invoice by ID (Admin only)
  getInvoiceById: async (invoiceId) => {
    try {
      const response = await api.get(`/api/SchoolInvoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/SchoolInvoice/analytics
  // Retrieves all invoices with analytics data (Admin only)
  getInvoiceAnalytics: async () => {
    try {
      const response = await api.get("/api/SchoolInvoice/analytics");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/SchoolInvoice/generate
  // Manually generates an invoice for a specific school and term (Admin only)
  // Body: { schoolId, sessionTermId }
  generateInvoice: async (data) => {
    try {
      const response = await api.post("/api/SchoolInvoice/generate", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT /api/SchoolInvoice/{invoiceId}/mark-paid
  // Marks an invoice as paid with payment reference (Admin only)
  markInvoicePaid: async (invoiceId, data) => {
    try {
      const response = await api.put(`/api/SchoolInvoice/${invoiceId}/mark-paid`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST /api/SchoolInvoice/GenerateSessionInvoice
  // Generates invoice for a school's full academic session
  // Body: { schoolId, sessionTermId }
  generateSessionInvoice: async (data) => {
    try {
      const response = await api.post("/api/SchoolInvoice/GenerateSessionInvoice", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // GET /api/SchoolInvoice/GetInvoicesBySchoolId
  getInvoicesBySchoolId: async (schoolId) => {
    try {
      const response = await api.get("/api/SchoolInvoice/GetInvoicesBySchoolId", {
        params: { schoolId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
