// src/Services/Auth/onboarding.js
import api from "../api";

export const guardianAccountService = {
  getGuardianAccount: async (id) => {
    try {
      const res = await api.get(`/api/Account/GetGuardianSavingsAccount/${id}`);
      //   console.log("GetAllGuardians success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllGuardians error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
