import api from "./api";

export const sessionService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<any>}
   */
  addSession: async (sessionData) => {
    const response = await api.post(`/api/Session/AddSession`, sessionData);
    return response.data;
  },

  setCurrentSession: async (schoolId, sessionId) => {
    const response = await api.post(`/api/Session/SetActiveSession?schoolId=${schoolId}&sessionKey=${sessionId}`, {});
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
  getAllRegisteredSessions: async (id) => {
    const response = await api.get(`/api/Session/GetSessionsBySchoolId?schoolId=${id}`);
    // console.log("session:", response.data);
    return response.data.data;
  },
};
