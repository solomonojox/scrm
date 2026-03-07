// src/Services/Auth/onboarding.js

import cbtApi from "../../Cbt/cbtApi";


export const teacherSubjectService = {
  getAll: async () => {
    try {
      const res = await cbtApi.get(`/api/Subject`);
      // console.log("GetAllSubjects success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllSubjects error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const res = await cbtApi.post("/api/Subject", data);
      // console.log("AddTeacherTeacher success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("Add Teacher Subject error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const res = await cbtApi.put(`/api/Subject/${id}`, data);
      // console.log("UpdateSubject success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("UpdateSubject error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Subject/${id}`);
      // console.log("success:", res.data.data);
      return res.data.data;
    } catch (error) {
      console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getSubjectByTeacherId: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Subject/teacherId/${id}`);
      // console.log("success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("DeleteTeacher error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
 
  delete: async (id) => {
    try {
      const res = await cbtApi.delete(`/api/Subject/${id}`);
      // console.log("DeleteSubject success:", res.data);
      return res.data;
    } catch (error) {
      console.error("DeleteSubject error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
