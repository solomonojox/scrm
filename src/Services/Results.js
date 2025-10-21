import api from "./api";

export const resultService = {

  addResult: async (subjectData) => {
    try {
      const response = await api.post(`/api/Result/AddSubjectScores`, subjectData);
      return response.data;
    } catch (error) {
      console.error("AddResult error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add session"
      );
    }
    
  },
  delete: async (subjectData) => {
    try {
      const response = await api.post(`/api/Session/delete`, subjectData);
      return response.data;
    } catch (error) {
      console.error("DeleteSession error:", error);
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to add session"
      );
    }
  },

  
//   getAlSubjectByClassIdAndSchoolId: async (schoolId, classroomId) => {
//     try {
//       const response = await api.get(`/api/Result/GetSubjectsByClass/${schoolId}/${classroomId}`);
      
//       return response.data.data;
//     } catch (error) {
//       console.error("GetAllsubject error:", error);
//       throw new Error(error?.response?.data?.responseMessage || "Failed to fetch sessions");
//     }
//   },
};
