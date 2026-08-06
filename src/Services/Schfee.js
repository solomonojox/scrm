import api from "./api";

export const schoolFeeService = {
  /**
   * Adds a new school fee
   * @param {Object} feeData - The school fee object (amount, term, schoolId, etc.)
   * @returns {Promise<Object>}
   */
  addSchoolFee: async (feeData) => {
    try {
      const response = await api.post(`/api/SchoolFee/AddSchoolFee`, feeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all school fees
   * @returns {Promise<Array>} - List of school fees
   */
  getAllSchoolFees: async () => {
    try {
      const response = await api.get(`/api/SchoolFee/GetAllSchoolFees`);
      return response.data.data; // ✅ get the array inside `data`
    } catch (error) {
      throw error;
    }
  },

  getClassFeeForSession: async (classId, sessionId) => {
    try {
      const response = await api.get(`/api/SchoolFee/GetClassFeeForSession?classId=${classId}&sessionId=${sessionId}`);
      return response.data.data; // ✅ get the array inside `data`
    } catch (error) {
      throw error;
    }
  },

  update: async (id, feeData) => {
    try {
      const response = await api.put(`/api/SchoolFee/UpdateSchoolFee?id=${id}`, feeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getAllSchoolFeesBySchoolId: async (id) => {
    try {
      const response = await api.get(`/api/SchoolFee/GetSchoolFeesBySchoolId?schoolId=${id}`);
      return response.data.data; // ✅ get the array inside `data`
    } catch (error) {
      throw error;
    }
  },
};
