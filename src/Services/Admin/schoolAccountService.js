import api from "../api";

export const schoolAccountService = {
  addAccount: async (accountData) => {
    try {
      const response = await api.post(`/api/SchoolAccount/AddSchoolAccount`, accountData);

      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getAccountsBySchoolId: async (schoolId) => {
    try {
      const response = await api.get(`/api/SchoolAccount/GetSchoolAccountBySchoolId/${schoolId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
