import cbtApi from "../../cbtApi";

const API = "/api/Examination";

export const AdminCbtExaminationService = {
  /**
   * GET /api/Examination/GetAll
   * Paginated list of all examinations (admin view).
   */
  getAll: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await cbtApi.get(`${API}/GetAll`, {
        params: { pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch examinations"
      );
    }
  },

  /**
   * GET /api/Examination
   * Paginated examinations filtered by schoolId.
   */
  getBySchool: async (schoolId, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await cbtApi.get(`/api/CbtAdmin/school/${schoolId}`, {
        params: { schoolId, pageNumber, pageSize },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch examinations"
      );
    }
  },

  /**
   * GET /api/Examination/{id}
   * Single examination with nested questions and options.
   */
  getById: async (id) => {
    try {
      const response = await cbtApi.get(`${API}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to fetch examination"
      );
    }
  },

  /**
   * POST /api/Examination
   * Create a new examination.
   * @param {Object} data - { title, class, classLabel, subjectId, duration,
   *                          scheduledDate, passingScore, instructions,
   *                          examType, term, academicSession, schoolId }
   */
  create: async (data) => {
    try {
      const response = await cbtApi.post(API, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to create examination"
      );
    }
  },

  /**
   * PUT /api/Examination/{id}
   * Update an existing examination.
   */
  update: async (id, data) => {
    try {
      const response = await cbtApi.put(`${API}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to update examination"
      );
    }
  },

  /**
   * DELETE /api/Examination/{id}
   * Delete an examination by ID.
   */
  delete: async (id) => {
    try {
      const response = await cbtApi.delete(`${API}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to delete examination"
      );
    }
  },

  /**
   * PATCH /api/Examination/{id}/activate
   * Activate an examination so students can access it.
   */
  activate: async (id) => {
    try {
      const response = await cbtApi.patch(`${API}/${id}/activate`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to activate examination"
      );
    }
  },

  /**
   * PATCH /api/Examination/{id}/deactivate
   * Deactivate an examination (sets status back to SCHEDULED).
   */
  deactivate: async (id) => {
    try {
      const response = await cbtApi.patch(`${API}/${id}/deactivate`);
      return response.data;
    } catch (error) {
      throw new Error(
        error?.response?.data?.responseMessage || "Failed to deactivate examination"
      );
    }
  },
};