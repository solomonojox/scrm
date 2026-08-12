import api from "./api";

export const promoteService = {
  promoteStudents: async (promoteData) => {
    const response = await api.post(`/api/Classroom/BulkPromoteStudents`, promoteData);
    return response.data;
  }
}
