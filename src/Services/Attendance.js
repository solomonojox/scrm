import api from "./api";

export const attendanceService = {
  saveAttendance: async (attendance) => {
    try {
      const response = await api.post(`/api/Attendance/SaveAttendance`, attendance);
      return response.data;
    } catch (error) {
      console.error("AddSchoolFee error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to add school fee");
    }
  },
  getAttendanceByClassroomIdAndSchoolId: async (schoolId, classroomId) => {
    try {
      const response = await api.get(
        `/api/Attendance/GetClassAttendanceSummary/${schoolId}/${classroomId}`
      );
      return response.data.data; 
    } catch (error) {
      console.error("GetClassFeeForSession error:", error);
      throw new Error(error?.response?.data?.responseMessage || "Failed to fetch school fees");
    }
  },

  //   getAllSchoolFees: async () => {
  //     try {
  //       const response = await api.get(`/api/SchoolFee/GetAllSchoolFees`);
  //       return response.data.data; // ✅ get the array inside `data`
  //     } catch (error) {
  //       console.error("GetAllSchoolFees error:", error);
  //       throw new Error(error?.response?.data?.responseMessage || "Failed to fetch school fees");
  //     }
  //   },

    update: async (attendanceData) => {
      try {
        const response = await api.put(`/api/Attendance/EditAttendance`, attendanceData);
        return response.data;
      } catch (error) {
        console.error("UpdateAttendance error:", error);
        throw new Error(error?.response?.data?.responseMessage || "Failed to update attendance");
      }
    },

  //   getAllSchoolFeesBySchoolId: async (id) => {
  //     try {
  //       const response = await api.get(`/api/SchoolFee/GetSchoolFeesBySchoolId?schoolId=${id}`);
  //       return response.data.data; // ✅ get the array inside `data`
  //     } catch (error) {
  //       console.error("GetAllSchoolFeesBySchoolId error:", error);
  //       throw new Error(error?.response?.data?.responseMessage || "Failed to fetch school fees");
  //     }
  //   },
};
