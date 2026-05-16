import cbtApi from "../cbtApi";

export const cbtAdminService = {
  // registerSchool: async (eventsData) => {
  //   try {
  //     const response = await cbtApi.post(`/api/School/RegisterSchool`, eventsData);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
  //   }
  // },

  addStudent: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/Student`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  addTeacher: async (eventsData) => {
    const response = await cbtApi.post(`/api/Teacher`, eventsData);
    return response.data;
  },

  getAllStudents: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Student/school/${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getAllTeachers: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Teacher/school/${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getAllSchoolSessions: async (id) => {
    try {
      const res = await cbtApi.get(`/api/School/GetAllSchools/${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  deleteTeacher: async (id) => {
    const res = await cbtApi.delete(`/api/Teacher/${id}`)
    return res.data.data
  }
};
