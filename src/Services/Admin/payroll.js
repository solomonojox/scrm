// src/Services/Auth/onboarding.js

import api from "../api";

export const payrollService = {
  getAllPayrollBySchoolId: async (id) => {
    try {
      const res = await api.get(`/api/Payroll/GetAllTeachersPayroll/${id}`);
      // console.log("GetAllTeachers success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Get Payroll error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  generatePayrollForTeacher: async (payrollData) => {
    try {
      const res = await api.post("/api/Payroll/Generate", payrollData);
      // console.log("GetAllTeachers success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("Get Payroll error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
