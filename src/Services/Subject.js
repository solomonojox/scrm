import api from "./api";

export const subjectService = {

  addSubject: async (subjectData) => {
    try {
      const response = await api.post(`/api/Result/AddSubject`, subjectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (subjectData) => {
    try {
      const response = await api.post(`/api/Session/delete`, subjectData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  
  getAlSubjectByClassIdAndSchoolId: async (schoolId, classroomId) => {
    try {
      const response = await api.get(`/api/Result/GetSubjectsByClass/${schoolId}/${classroomId}`);
      
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
