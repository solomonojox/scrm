import cbtApi from "../cbtApi";

export const cbtTeacherExamService = {

  createExam: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/Examination/Create`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  addExamQuestion: async (eventsData) => {
    try {
      const response = await cbtApi.post(`/api/QuizQuestion/BulkCreate/bulk`, eventsData);
      return response.data;
    } catch (error) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add news");
    }
  },

  
};
