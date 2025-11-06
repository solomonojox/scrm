import cbtApi from "../cbtApi";

export const cbtAuthService = {
  registerSchool: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/School/RegisterSchool`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  registerAdmin: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/SchoolAdmin/Register`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  login: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/CbtLogin/authenticate`, eventsData);
      return response.data.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },
};
