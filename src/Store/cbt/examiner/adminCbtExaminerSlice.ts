import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExaminerType } from "../../../Types/Cbt/Admin/examiner/adminCbtExaminerTypes";



interface AdminCbtExaminerState {
  listRecords: ExaminerType[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCbtExaminerState = {
  listRecords: [],
  loading: false,
  error: null,
};

export const AdminCbtExaminerslice = createSlice({
    name: "adminCbtExaminers",
    initialState,
    reducers: {
        fetchAdminCbtExaminerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchAdminCbtExaminerSuccess: (state, action: PayloadAction<ExaminerType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchAdminCbtExaminerFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchAdminCbtExaminerFailure, fetchAdminCbtExaminerStart, fetchAdminCbtExaminerSuccess } = AdminCbtExaminerslice.actions;
export default AdminCbtExaminerslice.reducer;