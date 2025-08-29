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
      console.error(" AddStudentSchoolFee error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to add school fee");
    }
  },

  /**
   * Retrieves all school fees
   * @returns {Promise<Array>} - List of school fees
   */
  getPaymentsBySchoolId: async (schoolId) => {
    try {
      const response = await api.get(
        `/api/Payment/GetPaymentsBySchoolId?schoolId=${schoolId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("GetPaymentsBySchoolId error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch school payments"
      );
    }
  },

  getStudentPayment: async (studentId) => {
    try {
      const response = await api.get(`/api/Payment/GetStudentPayment/${studentId}`);
      return response.data.data; // ✅ get the array inside `data`
    } catch (error) {
      console.error("GetStudentPayment error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch school fees");
    }
  },

  getStudentPaymentForSession: async (studentId, sessionId) => {
    try {
      const response = await api.get(
        `/api/Payment/GetStudentPaymentForSession?studentId=${studentId}&sessionId=${sessionId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("GetStudentPayment error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch school fees");
    }
  },
};
