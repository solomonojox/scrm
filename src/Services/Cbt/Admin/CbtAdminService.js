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

  // registerAdmin: async (eventsData) => {
  //   try {
  //     const response = await cbtApi.post(`/api/SchoolAdmin/Register`, eventsData);
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
  //   }
  // },

  // login: async (eventsData) => {
  //   try {
  //     const response = await cbtApi.post(`/api/CbtLogin/authenticate`, eventsData);
  //     return response.data.data;
  //   } catch (error) {
  //     throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
  //   }
  // },

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
