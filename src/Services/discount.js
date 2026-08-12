import api from "./api";

export const discountService = {
  addDiscount: async (discountData) => {
    const response = await api.post(`/api/StudentDiscount/AddDiscount`, discountData);
    return response.data;
  },

  getDiscounts: async (schoolId) => {
    const response = await api.get(`/api/StudentDiscount/GetDiscountsBySchool/${schoolId}`);
    return response.data.data;
  },

  getDiscountsByStudentId: async (studentId) => {
    const response = await api.get(`/api/StudentDiscount/GetDiscountsByStudent/${studentId}`);
    return response.data.data;
  },

  DeactivateDiscount: async (discountId) => {
    const response = await api.put(`/api/StudentDiscount/DeactivateDiscount/${discountId}`, {});
    return response.data;
  }
}
