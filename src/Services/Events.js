import api from "./api";

export const eventsService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<Object>}
   */
  addEvent: async (eventsData) => {
    try {
      const response = await api.post(`/api/Event/AddEvent`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  /**
   * Retrieves all registered sessions
   * @returns {Promise<Array>} - List of sessions
   */
  getAllEvents: async () => {
    try {
      const response = await api.get(`/api/Event/GetAllEvents`);
      return response.data.data;
    } catch (error) {
      console.error("GetAllEventserror:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch news");
    }
  },
};
