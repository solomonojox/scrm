import api from "./api";

export const classroomService = {
  /**
   * Adds a new classroom
   * @param {Object} classroomData - The classroom object (name, schoolId, etc.)
   * @returns {Promise<Object>}
   */
  addClassroom: async (classroomData) => {
    try {
      const response = await api.post(`/api/Classroom/AddClassroom`, classroomData);
      return response.data;
    } catch (error) {
      throw error
    }
  },

  updateClassroom: async (id, data) => {
    try {
      const response = await api.put(`/api/Classroom/${id}`, data);
      return response.data;
    } catch (error) {
      throw error
    }
  },

  /**
   * Retrieves all classrooms
   * @returns {Promise<Array>} - List of classrooms
   */
  getAllClassrooms: async (id) => {
    try {
      const response = await api.get(`/api/Classroom/GetClassroomsBySchoolId?schoolId=${id}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  },

  getStudentsByClassroomId: async (classroomId) => {
    try {
      const response = await api.get(`/api/Classroom/GetStudentsByClassId/${classroomId}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  },

  getClassroomBySchoolId: async (schoolId) => {
    try {
      const response = await api.get(`/api/Classroom/GetClassroomsBySchoolId?schoolId=${schoolId}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  },

  getClassroomByTeacherId: async (teacherId) => {
    try {
      const response = await api.get(`/api/Classroom/GetClassroomByTeacherId/${teacherId}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  },

  getClassroomTudentsByClassId: async (classId) => {
    try {
      const response = await api.get(`/api/Classroom/GetStudentsByClassId/${classId}`);
      return response.data.data;
    } catch (error) {
      throw error
    }
  },
};
