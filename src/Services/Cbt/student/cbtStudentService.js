// src/Services/Auth/onboarding.js

import cbtApi from "../cbtApi";


export const cbtStudentService = {
  getAllBySchoolId: async (id) => {
    const res = await cbtApi.get(`/api/Student/school/${id}`);
    // console.log("GetAllStudents success:", res.data);
    return res.data.data;
    // try {
    // } 
    // catch (error) {
    //   // console.error("GetAllStudents error:", error);
    //   throw error;
    // }
  },

  create: async (data) => {
    const res = await cbtApi.post("/api/Student/AddStudent", data);
    // console.log("AddStudentStudent success:", res.data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await cbtApi.put(`/api/Student/UpdateStudent/${id}`, data);
    // console.log("UpdateStudent success:", res.data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await cbtApi.delete(`/api/Student/${id}`);
    // console.log("DeleteStudent success:", res.data);
    return res.data;
  },

  uploadPhoto: async (id, data) => {
    const res = await cbtApi.post(`/api/Student/UploadImage/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
    // console.log("UploadStudentPhoto success:", res.data);
    return res.data;
  },

  getStudentDashboard: async (id) => {
    const res = await cbtApi.get(`/api/ExamStudent/dashboard/${id}`);
    // console.log("GetStudentDashboard success:", res.data);
    return res.data.data;
  },

  getStudentCatalog: async (id) => {
    const res = await cbtApi.get(`/api/ExamStudent/catalog/${id}`);
    // console.log("GetStudentCatalog success:", res.data);
    return res.data.data;
  },

  getStudentPerformance: async (id) => {
    const res = await cbtApi.get(`/api/ExamStudent/performance/${id}`);
    // console.log("GetStudentPerformance success:", res.data);
    return res.data.data;
  },

  getStudentExamResults: async (id) => {
    const res = await cbtApi.get(`/api/ExamStudent/results/${id}`);
    // console.log("GetStudentPerformance success:", res.data);
    return res.data.data;
  },

  startExam: async (studentId, examId) => {
    const res = await cbtApi.post(`/api/ExamStudent/startExam/${examId}/${studentId}`);
    // console.log("StartExam success:", res.data);
    return res.data.data;
  },

  submitExam: async (payload) => {
    const res = await cbtApi.post(`/api/ExamStudent/submitExam`, payload);
    // console.log("SubmitExam success:", res.data);
    return res.data.data;
  },
};
