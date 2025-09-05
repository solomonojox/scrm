// src/Services/Auth/onboarding.js

import api from "../api";

export const adminService = {
  getAdminBySchoolId: async (id) => {
    try {
      const res = await api.get(`/api/SchoolAdmin/GetAdminBySchoolId/${id}`);
      // console.log("GetAllTeachers success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllTeachers error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  //   create: async (data) => {
  //     try {
  //       const res = await api.post("/api/Teacher/AddTeacher", data);
  //       // console.log("AddTeacherTeacher success:", res.data);
  //       return res.data.data;
  //     } catch (error) {
  //       console.error("AddTeacherTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },

  //   update: async (id, data) => {
  //     try {
  //       const res = await api.put(`/api/Teacher/UpdateTeacher/${id}`, data);
  //       console.log("UpdateTeacher success:", res.data);
  //       return res.data.data;
  //     } catch (error) {
  //       console.error("UpdateTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },

  //   getById: async (id) => {
  //     try {
  //       const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
  //       // console.log("success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },

  // getArrayOfTeachersById: async (ids) => {
  //   try {
  //     const requests = ids.map(i => api.get(`/api/Teacher/GetTeacherById/${i.teacher.teacherId}`));
  //     const responses = await Promise.all(requests);

  //     const data = responses.map(res => res.data.data);
  //     // console.log("success:", data);

  //     return data;
  //   } catch (error) {
  //     console.error("getArrayOfTeachersById error:", error?.response?.data?.message || error.message);
  //     throw error;
  //   }
  // },

  //   getById: async (id) => {
  //     try {
  //       const res = await api.get(`/api/Teacher/GetTeacherById/${id}`);
  //       // console.log("success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
  //   delete: async (id) => {
  //     try {
  //       const res = await api.delete(`/api/Teacher/${id}`);
  //       console.log("DeleteTeacher success:", res.data);
  //       return res.data;
  //     } catch (error) {
  //       console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
  //       throw error;
  //     }
  //   },
};
