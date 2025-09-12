import api from "../api";

export const transactionService = {
  getClassroomBySchoolId: async (schoolId) => {
    try {
      const response = await api.get(
        `/api/GuardianTransactions/GetTransactionsBySchool/${schoolId}`
      );
      return response.data.data;
    } catch (error) {
      console.error("GetAllClassroom error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch classrooms");
    }
  },
};
