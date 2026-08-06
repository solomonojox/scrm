import cbtApi from "../../cbtApi";

const API = "/api/Examiner";

export const AdminCbtExaminerService = {
  // registerSchool: async (eventsData) => {
  //   try {
  //     const response = await cbtApi.post(`/api/School/RegisterSchool`, eventsData);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  create: async (data) => {
    try {
      const response = await cbtApi.post(API, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBySchool: async (schoolId) => {
    try {
      const response = await cbtApi.get(`${API}/school/${schoolId}`);
      return response?.data?.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await cbtApi.put(`${API}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await cbtApi.delete(`${API}/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
