// src/Services/Auth/onboarding.js
import api from "../api";

export const guardianStudentService = {
  getAll: async (id) => {
    try {
      const res = await api.get(`/api/Student/GetGuardianStudents/${id}`);
      // console.log("GetAllGuardians success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllGuardians error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getGuardianById: async (id) => {
    console.log(id);
    try {
      const res = await api.get(`/api/Guardian/GetGuardianById/${id}`);
      // console.log("GetAllGuardians success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllGuardians error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await api.post("/api/Guardian/AddStudentGuardian", data);
      // console.log("AddStudentGuardian success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("AddStudentGuardian error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const res = await api.put(`/api/Guardian/${id}`, data);
      console.log("UpdateGuardian success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("UpdateGuardian error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/api/Guardian/${id}`);
      console.log("DeleteGuardian success:", res.data);
      return res.data;
    } catch (error) {
      console.error("DeleteGuardian error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};