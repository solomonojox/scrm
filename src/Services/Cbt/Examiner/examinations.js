import cbtApi from "../cbtApi";


const API = "/api/ExaminerExam";

export const ExaminerExamService = {
  getMyExams: async () => {
    const response = await cbtApi.get(`${API}/exams`)
    return response.data.data
  },

  getSubjects: async (schoolId) => {
    const response = await cbtApi.get(`/api/Subject/school/${schoolId}`)
    return response.data.data
  },

  create: async (data) => {
    try {
      const response = await cbtApi.post(`${API}/exams`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to create examination"
      );
    }
  },

  /**
   * PUT /api/Examination/{id}
   * Update an existing examination.
   */
  update: async (id, data) => {
    try {
      const response = await cbtApi.put(`${API}/exams/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to update examination"
      );
    }
  },

  delete: async (id) => {
    try {
      const response = await cbtApi.delete(`${API}/exams/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to delete examination"
      );
    }
  },

  publishExam: async (examinationId) => {
    const response = await cbtApi.patch(`${API}/exams/${examinationId}/publish`, {})
    return response.data
  },

  unPublishExam: async (examinationId) => {
    const response = await cbtApi.patch(`${API}/exams/${examinationId}/unpublish`, {})
    return response.data
  },

  getTeachers: async (schoolId) => {
    const response = await cbtApi.get(`/api/Teacher/school/${schoolId}`)
    return response.data.data

  },

  getStudents: async (schoolId) => {
    const response = await cbtApi.get(`/api/Student/school/${schoolId}`)
    return response.data.data

  },

  assignTeachersToExam: async (data) => {
    const response = await cbtApi.post(`${API}/teacher-assignments`, data);
    return response.data
  },

  assignStudentsToExam: async (data) => {
    const response = await cbtApi.post(`${API}/student-assignments/bulk`, data);
    return response.data
  },
};
