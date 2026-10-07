import axios from "axios";
import { AttendanceRecord, AttendanceResponse } from "../../Types/Admin/attendance";
import api from "../api";

export const studentAttendanceService = {
      getByActiveTerm: async (schoolId: string, classId: string): Promise<AttendanceRecord[]> => {
            const res = await api.get<AttendanceResponse>(
                  `/Attendance/GetAttendanceByActiveTerm/${schoolId}/${classId}`,
            );
            return res.data?.data ?? [];
      },

      // date format: YYYY-MM-DD
      getByDate: async ( schoolId: string, classId: string, date: string ): Promise<AttendanceRecord[]> => {
            try {
                  const res = await api.get<AttendanceResponse>(`/api/Attendance/GetAttendanceByDate/${schoolId}/${classId}?date=${date}`,
                  );
                  return res.data?.data ?? [];
            } catch (err) {
                  // No attendance taken for that date -> treat as empty, not an error
                  if (axios.isAxiosError(err) && err.response?.status === 404) return [];
                  throw err;
            }
      },
};
