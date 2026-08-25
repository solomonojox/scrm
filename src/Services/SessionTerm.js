import api from "./api";

export const sessionTermService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<Object>}
   */
  addSessionTerm: async (sessionData) => {
    const response = await api.post(`/api/Session/AddSessionTerm`, sessionData);
    return response.data;
  },
  delete: async (sessionData) => {
    const response = await api.post(`/api/Session/delete`, sessionData);
    return response.data;
  },

  /**
   * Retrieves all registered sessions
   * @returns {Promise<Array>} - List of sessions
   */
  getAllRegisteredSessionTerm: async (id) => {
    const response = await api.get(`/api/Session/GetSessionTermBySchoolId?schoolId=${id}`);
    return response.data.data;
  },

  setCurrentTerm: async (schoolId, sessionTermId) => {
    try {
      const response = await api.post(`/api/Session/SetActiveSessionTerm?schoolId=${schoolId}&sessionTermId=${sessionTermId}`);
      console.log(response);
    } catch (error) {
      console.error("Error fetching current term:", error);
    }
  },
};
