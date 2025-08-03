import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StudentType } from "../../Types/Student/studentTypes";

interface GuardianTypes {
  listRecords: StudentType[];
  loading: boolean;
  error: string | null;
}

const initialState: GuardianTypes = {
  listRecords: [],
  loading: false,
  error: null,
};

export const Studentslice = createSlice({
    name: "students",
    initialState,
    reducers: {
        fetchStudentsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchStudentsSuccess: (state, action: PayloadAction<StudentType[]>) => {
            state.loading = false;  
            state.listRecords = action.payload;
        },
        fetchStudentsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchStudentsFailure, fetchStudentsStart, fetchStudentsSuccess } = Studentslice.actions;
export default Studentslice.reducer;