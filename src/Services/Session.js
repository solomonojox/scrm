import api from "./api";

export const sessionService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<any>}
   */
  addSession: async (sessionData) => {
    try {
      const response = await api.post(`/api/Session/AddSession`, sessionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (sessionData) => {
    try {
      const response = await api.post(`/api/Session/delete`, sessionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Retrieves all registered sessions
   * @returns {Promise<Array>} - List of sessions
   */
  getAllRegisteredSessions: async (id) => {
    try {
      const response = await api.get(`/api/Session/GetSessionsBySchoolId?schoolId=${id}`);
      // console.log("session:", response.data);
      return response.data.data;
    } catch (error) {
      // throw error;
    }
  },
};
