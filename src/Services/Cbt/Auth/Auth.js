import cbtApi from "../cbtApi";

export const cbtAuthService = {
  registerSchool: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/School/RegisterSchool`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to register school");
    }
  },

  registerAdmin: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/SchoolAdmin/Register`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to register admin");
    }
  },

  login: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/CbtLogin/authenticate`, eventsData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
