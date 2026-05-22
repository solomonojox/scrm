import cbtApi from "../../cbtApi";

const API = "/api/Teacher";

export const AdminCbtTeacherService = {
  getAll: async () => {
    try {
      const response = await cbtApi.get(API);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch teachers");
    }
  },

  getBySchool: async (schoolId) => {
    try {
      const response = await cbtApi.get(`${API}/school/${schoolId}`);
      return response?.data?.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch teachers");
    }
  },

  getById: async (id) => {
    try {
      const response = await cbtApi.get(`${API}/${id}`);
      return response?.data?.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch teacher");
    }
  },

  create: async (data) => {
    try {
      const response = await cbtApi.post(API, data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to create teacher");
    }
  },

  update: async (id, data) => {
    try {
      const response = await cbtApi.put(`${API}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to update teacher");
    }
  },

  delete: async (id) => {
    try {
      const response = await cbtApi.delete(`${API}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to delete teacher");
    }
  },
};
