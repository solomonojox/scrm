import axios from "axios";
import api from "../../api";
import {
  ApiResponse,
  AddSubjectPayload,
  AssignTeacherPayload,
  Subject,
  SubjectTeacher,
  TeacherOption,
} from "../../../Types/Teacher/subjectTeacher";

const emptyIf404 = <T,>(err: unknown, fallback: T): T => {
  if (axios.isAxiosError(err) && err.response?.status === 404) return fallback;
  throw err;
};

export const subjectTeacherService = {
  getByClass: async (schoolId: string, classroomId: string): Promise<Subject[]> => {
    try {
      const res = await api.get<ApiResponse<Subject[]>>(
        `/api/Result/GetSubjectsByClass/${schoolId}/${classroomId}`,
      );
      return res.data?.data ?? [];
    } catch (err) {
      return emptyIf404<Subject[]>(err, []);
    }
  },

  add: async (payload: AddSubjectPayload) => {
    const res = await api.post<ApiResponse<unknown>>(`/api/Result/AddSubject`, payload);
    return res.data;
  },

  // Teachers already assigned to ONE subject
  getSubjectTeachers: async (schoolId: string, subjectId: string): Promise<SubjectTeacher[]> => {
    try {
      const res = await api.get<ApiResponse<SubjectTeacher[]>>(
        `/api/schools/${schoolId}/subjects/${subjectId}/teachers`,
      );
      return res.data?.data ?? [];
    } catch (err) {
      // A subject with no teachers yet may come back as 404: treat as empty
      return emptyIf404<SubjectTeacher[]>(err, []);
    }
  },

  assignTeacher: async (schoolId: string, subjectId: string, payload: AssignTeacherPayload) => {
    const res = await api.post<ApiResponse<unknown>>(
      `/api/schools/${schoolId}/subjects/${subjectId}/teachers`,
      payload,
    );
    return res.data;
  },

  removeTeacher: async (schoolId: string, subjectId: string, teacherId: string) => {
    const res = await api.delete<ApiResponse<unknown>>(
      `/api/schools/${schoolId}/subjects/${subjectId}/teachers/${teacherId}`,
    );
    return res.data;
  },

  // All teachers in the school (for the assign dropdown and name lookups)
  getAllTeachers: async (schoolId: string): Promise<TeacherOption[]> => {
    const res = await api.get<ApiResponse<any[]>>(`/api/Teacher/GetTeachersBySchool/${schoolId}`);
    const list = res.data?.data ?? [];
    return list.map((t) => ({
      teacherId: String(t.teacherId ?? t.id ?? ""),
      name: `${t.firstname ?? t.firstName ?? ""} ${t.lastname ?? t.lastName ?? ""}`.trim(),
      phone: t.phone ?? "",
      active: t.isDeleted !== true && t.isActive !== false,
    }));
  },
};