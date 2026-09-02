import api from "./api";

export const classroomService = {
  /**
   * Adds a new classroom
   * @param {Object} classroomData - The classroom object (name, schoolId, etc.)
   * @returns {Promise<Object>}
   */
  addClassroom: async (classroomData) => {
    const response = await api.post(`/api/Classroom/AddClassroom`, classroomData);
    return response.data;
  },

  updateClassroom: async (id, data) => {
    const response = await api.put(`/api/Classroom/UpdateClassroom/${id}`, data);
    return response.data;
  },

  /**
   * Retrieves all classrooms
   * @returns {Promise<Array>} - List of classrooms
   */
  getAllClassrooms: async (id) => {
    const response = await api.get(`/api/Classroom/GetClassroomsBySchoolId?schoolId=${id}`);
    return response.data.data;
  },

  getStudentsByClassroomId: async (classroomId) => {
    const response = await api.get(`/api/Classroom/GetStudentsByClassId/${classroomId}`);
    return response.data.data;
  },

  getClassroomBySchoolId: async (schoolId) => {
    const response = await api.get(`/api/Classroom/GetClassroomsBySchoolId?schoolId=${schoolId}`);
    return response.data.data;
  },

  getClassroomByTeacherId: async (teacherId) => {
    const response = await api.get(`/api/Classroom/GetClassroomByTeacherId/${teacherId}`);
    return response.data.data;
  },

  getClassroomTudentsByClassId: async (classId) => {
    const response = await api.get(`/api/Classroom/GetStudentsByClassId/${classId}`);
    return response.data.data;
  },

  deleteClassroom: async (classroomId) => {
    const response = await api.delete(`/api/Classroom/DeleteClassroom/${classroomId}`);
    return response.data;
  },
};
