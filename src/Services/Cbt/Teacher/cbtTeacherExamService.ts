import {
  AllExamQuestionType,
  ExamFilterParams,
  ExamQuestion,
  PaginatedExamResponse,
} from "../../../Types/Cbt/cbtTypes";

import cbtApi from "../cbtApi";

export const cbtTeacherExamService = {
  createExam: async (examData: any) => {
    try {
      const response = await cbtApi.post(`/api/Examination`, examData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to create exam");
    }
  },

  updateExam: async (id: string, examData: any) => {
    try {
      const response = await cbtApi.put(`/api/QuizQuestion/Update?id=${id}`, examData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to update exam");
    }
  },

  addExamQuestion: async (examData: any) => {
    try {
      const response = await cbtApi.post(`/api/QuizQuestion/bulk`, examData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add exam questions");
    }
  },

  getExams: async (params?: ExamFilterParams): Promise<PaginatedExamResponse> => {
    try {
      const response = await cbtApi.get(`/api/Examination/GetAll`, { params });
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch exams");
    }
  },

  getExamById: async (id: string): Promise<AllExamQuestionType> => {
    try {
      const response = await cbtApi.get(`/api/QuizQuestion/GetById?id=${id}`);
      return response.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch exam");
    }
  },

  getExamQuestions: async (examId: string): Promise<ExamQuestion[]> => {
    try {
      const response = await cbtApi.get(`/api/QuizQuestion/GetByExamId?examId=${examId}`);
      // console.log(response)
      return response.data ?? response.data?.data ?? [];
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch exam questions");
    }
  },
};
