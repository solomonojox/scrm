import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminCbtTeacherType } from "../../../../Types/Cbt/Admin/Teacher/teacherCbtStudentTypes";



interface AdminCbtTeacherState {
  listRecords: AdminCbtTeacherType[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCbtTeacherState = {
  listRecords: [],
  loading: false,
  error: null,
};

export const AdminCbtTeacherslice = createSlice({
    name: "adminCbtTeachers",
    initialState,
    reducers: {
        fetchAdminCbtTeacherStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAdminCbtTeacherSuccess: (state, action: PayloadAction<AdminCbtTeacherType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchAdminCbtTeacherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchAdminCbtTeacherFailure, fetchAdminCbtTeacherStart, fetchAdminCbtTeacherSuccess } = AdminCbtTeacherslice.actions;
export default AdminCbtTeacherslice.reducer;