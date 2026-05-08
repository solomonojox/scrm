// src/Services/Auth/onboarding.js

import api from "../api";

export const schoolService = {

  getSchoolById: async (id) => {
    try {
      const res = await api.get(`/api/School/GetSchoolById/${id}`);
      // console.log("GetSchoolById success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("GetSchoolById error:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};