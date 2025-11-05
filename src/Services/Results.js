import api from "./api";

export const resultService = {
  addResult: async (subjectData) => {
    try {
      const response = await api.post(`/api/Result/AddSubjectScores`, subjectData);
      return response.data;
    } catch (error) {
      console.error("AddResult error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to add session");
    }
  },
  getResultBySchoolAndClass: async (schoolId, studentId, classroomId, sessionId, term) => {
    try {
      const response = await api.get(
        // '/api/Result/GetStudentResultBySchoolAndClass?schoolId=1e6e8616-b236-4454-bb91-08de0faeb290&studentId=bfffe480-0ec0-49f9-c326-08de0fb1e943&classroomId=5421aafb-2940-4e47-a7e0-ee24a4e480aa&sessionId=4cb1ac85-af82-40ea-b6bd-0aea27008071&term=1'
        `/api/Result/GetStudentResultBySchoolAndClass?schoolId=${schoolId}&studentId=${studentId}&classroomId=${classroomId}&sessionId=${sessionId}&term=${term}`
        );

      return response.data;
    } catch (error) {
      console.error("GetAllsubject error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch sessions");
    }
  },
  delete: async (subjectData) => {
    try {
      const response = await api.post(`/api/Session/delete`, subjectData);
      return response.data;
    } catch (error) {
      console.error("DeleteSession error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to add session");
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
