import api from "../api";
// const token = localStorage.getItem('mevUserToken');

export const onboardingService = {
    addSchool: async (data) => {
        try {
            const res = await api.post(`/api/School/RegisterSchool`, data)
            // console.log(res.data);
            return res.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    accountRegistration: async (data) => {
        try {
            const res = await api.post(`/api/SchoolAccount/AddSchoolAccount`, data)
            console.log(res.data);
            return res.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
}