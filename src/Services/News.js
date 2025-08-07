import api from "./api";

export const newsService = {
  /**
   * Adds a new session
   * @param {Object} sessionData - The session object (schoolId, sessionId, name, dates, etc.)
   * @returns {Promise<Object>}
   */
  addNews: async (newsData) => {
    try {
      const response = await api.post(`/api/News/AddNews`, newsData);
      return response.data;
    } catch (error) {
      console.error("AddNews error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add news"
      );
    }
  },

  /**
   * Retrieves all registered sessions
   * @returns {Promise<Array>} - List of sessions
   */
  getAllRegisteredNews: async () => {
    try {
      const response = await api.get(`/api/News/GetAllNews`);
      return response.data.data;
    } catch (error) {
      console.error("GetAllRegisteredNewserror:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch news"
      );
    }
  },
};
