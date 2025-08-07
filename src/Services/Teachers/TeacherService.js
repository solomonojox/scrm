// src/Services/Auth/onboarding.js
import api from "../api";

export const teacherService = {
  getAll: async () => {
    try {
      const res = await api.get("/api/Teacher/GetAllTeachers");
      // console.log("GetAllTeachers success:", res.data);
      return res.data;
    } catch (error) {
      console.error("GetAllTeachers error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post("/api/Teacher/AddTeacher", data);
      console.log("AddTeacherTeacher success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("AddTeacherTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/api/Teacher/UpdateTeacher/${id}`, data);
      console.log("UpdateTeacher success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("UpdateTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
      console.log("success:", res.data);
      return res.data;
    } catch (error) {
      console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const res = await api.delete(`/api/Teacher/${id}`);
      console.log("DeleteTeacher success:", res.data);
      return res.data;
    } catch (error) {
      console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
