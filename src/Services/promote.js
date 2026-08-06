import api from "./api";

export const promoteService = {
  promoteStudents: async (promoteData) => {
    try {
      const response = await api.post(`/api/Classroom/BulkPromoteStudents`, promoteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
