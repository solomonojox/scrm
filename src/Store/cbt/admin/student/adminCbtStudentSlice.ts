import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminCbtStudentType } from "../../../../Types/Cbt/Admin/Student/adminCbtStudentTypes";


interface AdminCbtStudentState {
  listRecords: AdminCbtStudentType[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCbtStudentState = {
  listRecords: [],
  loading: false,
  error: null,
};

export const AdminCbtStudentslice = createSlice({
    name: "adminCbtStudents",
    initialState,
    reducers: {
        fetchAdminCbtStudentStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAdminCbtStudentSuccess: (state, action: PayloadAction<AdminCbtStudentType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchAdminCbtStudentFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchAdminCbtStudentFailure, fetchAdminCbtStudentStart, fetchAdminCbtStudentSuccess } = AdminCbtStudentslice.actions;
export default AdminCbtStudentslice.reducer;