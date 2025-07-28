import api from "./api";

export const sessionService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<Object>}
   */
  addSession: async (sessionData) => {
    try {
      const response = await api.post(`/api/Session/AddSession`, sessionData);
      return response.data;
    } catch (error) {
      console.error("AddSession error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add session"
      );
    }
  },

  /**
   * Retrieves all registered sessions
   * @returns {Promise<Array>} - List of sessions
   */
  getAllRegisteredSessions: async () => {
    try {
      const response = await api.get(`/api/Session/GetAllRegisteredSession`);
      return response.data;
    } catch (error) {
      console.error("GetAllRegisteredSession error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch sessions"
      );
    }
  },
};
