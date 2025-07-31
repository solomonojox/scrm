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
      console.error("AddSchoolFee error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add school fee"
      );
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
    console.error("GetAllSchoolFees error:", error);
    throw new Error(
      error?.response?.data?.responseMessage || "Failed to fetch school fees"
    );
  }
}

};
