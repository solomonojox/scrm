import api from "./api";

export const attendanceService = {
  saveAttendance: async (attendance) => {
    try {
      const response = await api.post(`/api/Attendance/SaveAttendance`, attendance);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAttendanceByClassroomIdAndSchoolId: async (schoolId, classroomId, termId) => {
    try {
      const response = await api.get(
        `/api/Attendance/GetClassAttendanceSummary/${schoolId}/${classroomId}/${termId}`
      );
      return response.data.data; 
    } catch (error) {
      throw error;
    }
  },

  //   getAllSchoolFees: async () => {
  //     try {
  //       const response = await api.get(`/api/SchoolFee/GetAllSchoolFees`);
  //       return response.data.data; // ✅ get the array inside `data`
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   getAllSchoolFeesBySchoolId: async (id) => {
  //     try {
  //       const response = await api.get(`/api/SchoolFee/GetSchoolFeesBySchoolId?schoolId=${id}`);
  //       return response.data.data; // ✅ get the array inside `data`
  //     } catch (error) {
  //       console.error("GetAllSchoolFeesBySchoolId error:", error);
  //       throw error;
  //     }
  //   },
};
