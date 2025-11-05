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
      const response = await cbtApi.post(`/api/Student/AddStudent`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  addTeacher: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/Teacher/AddTeacher`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  getAllStudents: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Student/GetStudentsBySchool?schoolId=${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  getAllTeachers: async (id) => {
    try {
      const res = await cbtApi.get(`/api/Teacher/GetTeachersBySchool/${id}`);
      // console.log("GetAllStudents success:", res.data);
      return res.data.data;
    } catch (error) {
      console.error("GetAllStudents error:", error?.response?.data?.message || error.message);
      throw error;
    }
  },
};
