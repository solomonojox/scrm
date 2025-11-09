import api from "./api";

export const superAdminService = {
    adminLogin: async (username, password) => {
        const res = await api.post("/api/Admin/SuperAdminLogin", { username, password });
        return res.data;
    },

    getAllSchools: async () => {
        const res = await api.get("/api/School/GetAllSchools");
        return res.data;
    },

    getTotalStudents: async () => {
        const res = await api.get("/api/Student/GetTotalStudentCount");
        return res.data;
    },

    getAllStudents: async (id) => {
        const res = await api.get(`/api/Student/GetStudentsBySchool?schoolId=${id}`);
        return res.data;
    },

    getAllTeachers: async (id) => {
        const res = await api.get(`/api/Teacher/GetTeachersBySchool/${id}`);
        return res.data;
    },

    getAllGuardians: async (id) => {
        const res = await api.get(`/api/Guardian/GetGuardiansBySchool?schoolId=${id}`);
        return res.data;
    },

    changeSchoolStatus: async (data) => {
        const res = await api.post(`/api/School/ApproveSchool`, data);
        return res.data;
    },
}