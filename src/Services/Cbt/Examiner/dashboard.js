import cbtApi from "../cbtApi";


const API = "/api/ExaminerExam";

export const ExaminerDashboardService = {
    getAll: async () => {
        try {
            const response = await cbtApi.get(`${API}/dashboard`);
            return response.data.data;
        } catch (error) {
            throw new Error(
                error?.response?.data?.responseMessage || "Failed to fetch examinations"
            );
        }
    },
};