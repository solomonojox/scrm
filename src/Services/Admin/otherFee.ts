import axios from "axios";
import {
  ApiResponse,
  GuardianOption,
  OtherFee,
  OtherFeePayment,
  RecordPaymentPayload,
  StudentOption,
} from "../../Types/Admin/otherFee";
import api from "../api";

const emptyIf404 = <T,>(err: unknown, fallback: T): T => {
  if (axios.isAxiosError(err) && err.response?.status === 404) return fallback;
  throw err;
};

export const otherFeeService = {
  getFees: async (schoolId: string, activeOnly = true): Promise<OtherFee[]> => {
    try {
      const res = await api.get<ApiResponse<OtherFee[]>>(`/api/OtherFee/GetOtherFees/${schoolId}`, {
        params: { activeOnly },
      });
      return res.data?.data ?? [];
    } catch (err) {
      return emptyIf404<OtherFee[]>(err, []);
    }
  },

  getPayments: async (schoolId: string): Promise<OtherFeePayment[]> => {
    try {
      const res = await api.get<ApiResponse<OtherFeePayment[]>>(
        `/api/OtherFee/GetPaymentsBySchool/${schoolId}`,
      );
      return res.data?.data ?? [];
    } catch (err) {
      return emptyIf404<OtherFeePayment[]>(err, []);
    }
  },

  recordPayment: async (payload: RecordPaymentPayload) => {
    const res = await api.post<ApiResponse<OtherFeePayment>>(
      `/api/OtherFee/RecordOtherFeePayment`,
      payload,
    );
    return res.data;
  },

  // Guardians for the dropdown. Only the fields we need are kept (the response is large).
  getGuardians: async (schoolId: string): Promise<GuardianOption[]> => {
    try {
      const res = await api.get<ApiResponse<any[]>>(`/api/Guardian/GetGuardiansBySchool`, {
        params: { schoolId },
      });
      const list = res.data?.data ?? [];
      return list
        .filter((g) => g.isDeleted !== true && g.isActive !== false)
        .map((g) => ({
          guardianId: String(g.guardianId ?? ""),
          name: `${g.firstname ?? ""} ${g.lastname ?? ""}`.trim(),
          phone: g.phone ?? "",
        }))
        .filter((g) => g.guardianId);
    } catch (err) {
      return emptyIf404<GuardianOption[]>(err, []);
    }
  },

  // Students linked to one guardian (defensive about field names)
  getGuardianStudents: async (guardianId: string): Promise<StudentOption[]> => {
    try {
      const res = await api.get<ApiResponse<any[]>>(`/api/Student/GetGuardianStudents/${guardianId}`);
      const list = res.data?.data ?? [];
      return list
        .map((s) => {
          const name =
            s.fullName ??
            s.studentName ??
            `${s.firstName ?? s.firstname ?? ""} ${s.lastName ?? s.lastname ?? ""}`;
          return {
            studentId: String(s.studentId ?? s.id ?? ""),
            name: String(name).trim() || "Unnamed student",
          };
        })
        .filter((s) => s.studentId);
    } catch (err) {
      return emptyIf404<StudentOption[]>(err, []);
    }
  },
};