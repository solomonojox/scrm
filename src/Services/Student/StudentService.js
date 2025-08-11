// src/Services/Auth/onboarding.js
import api from "../api";

export const studentService = {
  getAll: async (id) => {
    try {
      const res = await api.get(`/api/Student/GetStudentsBySchool?schoolId=${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post("/api/Student/AddStudent", data);
      console.log("AddStudentStudent success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("AddStudentStudent error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/api/Student/UpdateStudent/${id}`, data);
      console.log("UpdateStudent success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("UpdateStudent error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/api/Student/${id}`);
      console.log("DeleteStudent success:", res.data);
      return res.data;
    } catch (error) {
      console.error("DeleteStudent error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
