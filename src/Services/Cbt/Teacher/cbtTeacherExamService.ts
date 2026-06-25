import { BulkPayload, SingleQuestion } from "../../../pages/Cbt/Teacher/dashboard/examination/AddExamQuestions";
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

  addSingleExamQuestion: async (examData: SingleQuestion) => {
    try {
      const response = await cbtApi.post(`/api/TeacherExam/questions/submit`, examData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add exam questions");
    }
  },

  addBulkExamQuestion: async (examData: BulkPayload) => {
    try {
      const response = await cbtApi.post(`/api/TeacherExam/questions/submit/bulk`, examData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to add exam questions");
    }
  },

  getExams: async (params?: ExamFilterParams) => {
    try {
      const response = await cbtApi.get(`/api/TeacherExam/assignments`, { params });
      return response?.data?.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch exams");
    }
  },

  respondToAssignment: async (payload: { accept: boolean; notes: string }, assignmentId: string | undefined) => {
    try {
      const response = await cbtApi.patch(`/api/TeacherExam/assignments/${assignmentId}/respond`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.responseMessage || "Failed to respond to assignment");
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
