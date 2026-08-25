import api from "./api";

export const OtherFeeService = {
  createOtherFees: async (discountData) => {
    const response = await api.post(`/api/OtherFee/CreateOtherFee`, discountData);
    return response.data;
  },

  getOtherFees: async (schoolId, classroomId) => {
    const response = await api.get(`/api/OtherFee/GetOtherFees/${schoolId}?activeOnly=true&classroomId=${classroomId}`);
    return response.data.data;
  },

  getDiscountsByStudentId: async (studentId) => {
    const response = await api.get(`/api/StudentDiscount/GetDiscountsByStudent/${studentId}`);
    return response.data.data;
  },

  deactivateOtherFee: async (otherFeeId) => {
    const response = await api.put(`/api/OtherFee/DeactivateOtherFee/${otherFeeId}`, {});
    return response.data;
  }
}
