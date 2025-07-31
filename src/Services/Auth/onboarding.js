// src/Services/Auth/onboarding.js
import api from "../api";

export const onboardingService = {
  addSchool: async (data) => {
    try {
      const res = await api.post("/api/School/RegisterSchool", data);
      console.log("RegisterSchool success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("RegisterSchool error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  accountRegistration: async (data) => {
    try {
      const res = await api.post("/api/SchoolAccount/AddSchoolAccount", data);
      console.log("AddSchoolAccount success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("AddSchoolAccount error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  guardian: async (data) => {
    try {
      const res = await api.post("/api/Guardian/AddStudentGuardian", data);
      console.log("AddStudentGuardian success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("AddStudentGuardian error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getAllGuardians: async () => {
    try {
      const res = await api.get("/api/Guardian/GetAllGuardians");
      console.log("GetAllGuardians success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllGuardians error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getAllSchools: async () => {
    try {
      const res = await api.get("/api/School/GetAllSchools");
      console.log("GetAllSchools success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllSchools error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
