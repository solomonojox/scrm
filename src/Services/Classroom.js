import api from "./api";

export const classroomService = {
  /**
   * Adds a new classroom
   * @param {Object} classroomData - The classroom object (name, schoolId, etc.)
   * @returns {Promise<Object>}
   */
  addClassroom: async (classroomData) => {
    try {
      const response = await api.post(`/api/Classroom/AddClassroom`, classroomData);
      return response.data;
    } catch (error) {
      console.error("AddClassroom error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add classroom"
      );
    }
  },

  /**
   * Retrieves all classrooms
   * @returns {Promise<Array>} - List of classrooms
   */
  getAllClassrooms: async () => {
    try {
      const response = await api.get(`/api/Classroom/GetAllClassroom`);
      return response.data;
    } catch (error) {
      console.error("GetAllClassroom error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch classrooms"
      );
    }
  },
};
